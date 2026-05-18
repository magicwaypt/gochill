import 'server-only'

type ParticipationForD365 = {
	id: number
	nome: string
	email: string
	telemovel: string
	aceiteMarketing: boolean
}

export type D365CustomerPayload = {
	Operation: '0'
	SiteCustomer: {
		CountryCode: string
		StoreCode: string
		Language: string
		Username: string
		Name: string
		MainPhone: string
		SubscribeNewsletter: boolean
		Source: string
		Passatempos: Array<{
			Name: string
			CodigoPassatempo: string
		}>
	}
}

type D365CreateUpdateCustomerResult =
	| {
			ok: true
			accountNumber?: string
	  }
	| {
			ok: false
			status?: number
			error: string
	  }

const SENSITIVE_KEYS = new Set([
	'username',
	'name',
	'mainphone',
	'otherphone',
	'contactname',
	'street',
	'street2',
	'postalcode',
	'city',
	'vatcode',
	'cpf',
	'rg',
	'cnpj',
	'payload',
	'talaoblob',
	'fotoblob',
	'base64',
	'subscription-key',
	'subscriptionkey',
])

const getRequiredEnv = (key: string) => {
	const value = process.env[key]?.trim()
	if (!value) {
		throw new Error(`${key}_missing`)
	}
	return value
}

const getTimeoutMs = () => {
	const raw = process.env.D365_TIMEOUT_MS?.trim()
	if (!raw) return 10_000
	const value = Number(raw)
	return Number.isFinite(value) && value > 0 ? value : 10_000
}

const redact = (value: unknown): unknown => {
	if (!value || typeof value !== 'object') return value
	if (Array.isArray(value)) return value.map(redact)
	const entries: Array<[string, unknown]> = Object.entries(value as Record<string, unknown>).map(([k, v]): [string, unknown] => {
		const normalizedKey = k.toLowerCase()
		if (SENSITIVE_KEYS.has(normalizedKey)) return [k, '[redacted]']
		if (normalizedKey.includes('subscription')) return [k, '[redacted]']
		if (normalizedKey.includes('blob')) return [k, '[redacted]']
		if (normalizedKey.includes('base64')) return [k, '[redacted]']
		return [k, redact(v)]
	})
	return Object.fromEntries(entries)
}

export const buildD365CustomerPayload = (participation: ParticipationForD365): D365CustomerPayload => {
	const storeCode = getRequiredEnv('D365_STORE_CODE')
	const language = getRequiredEnv('D365_LANGUAGE')
	const countryCode = getRequiredEnv('D365_COUNTRY_CODE')
	const source = getRequiredEnv('D365_SOURCE')
	const contestName = getRequiredEnv('D365_CONTEST_NAME')
	const contestCode = getRequiredEnv('D365_CONTEST_CODE')

	return {
		Operation: '0',
		SiteCustomer: {
			CountryCode: countryCode,
			StoreCode: storeCode,
			Language: language,
			Username: participation.email,
			Name: participation.nome,
			MainPhone: participation.telemovel,
			SubscribeNewsletter: participation.aceiteMarketing,
			Source: source,
			Passatempos: [
				{
					Name: contestName,
					CodigoPassatempo: contestCode,
				},
			],
		},
	}
}

const normalizeErrorSummary = (input: unknown) => {
	if (!input) return 'unknown_error'

	if (typeof input === 'string') {
		return input.slice(0, 500)
	}

	if (input instanceof Error) {
		return `${input.name}:${input.message}`.slice(0, 500)
	}

	try {
		return JSON.stringify(redact(input)).slice(0, 500)
	} catch {
		return 'error_serialization_failed'
	}
}

const sanitizeD365LogContext = (
	input: Record<string, unknown>
): Record<string, unknown> => redact(input) as Record<string, unknown>

const extractErrorCodeDescription = (rawBody: unknown) => {
	if (!rawBody || typeof rawBody !== 'object') return null
	const record = rawBody as Record<string, unknown>
	const errorCode = typeof record.ErrorCode === 'string' ? record.ErrorCode : undefined
	const errorDescription =
		typeof record.ErrorDescription === 'string' ? record.ErrorDescription : undefined

	if (!errorCode && !errorDescription) return null

	return {
		errorCode,
		errorDescription,
	}
}

export const createUpdateCustomer = async (
	payload: D365CustomerPayload
): Promise<D365CreateUpdateCustomerResult> => {
	const baseUrl = getRequiredEnv('D365_BASE_URL')
	const subscriptionKey = getRequiredEnv('D365_SUBSCRIPTION_KEY')
	const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
	const url = new URL('api/CreateUpdateCustomer', normalizedBaseUrl).toString()
	const timeoutMs = getTimeoutMs()
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), timeoutMs)

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Azure API Management commonly uses this header name.
				'Ocp-Apim-Subscription-Key': subscriptionKey,
				// Keep a fallback for gateways configured with a custom header.
				'Subscription-Key': subscriptionKey,
			},
			body: JSON.stringify(payload),
			signal: controller.signal,
		})

		const contentType = response.headers.get('content-type') ?? ''
		const rawBody = contentType.includes('application/json')
			? await response.json().catch(() => null)
			: await response.text().catch(() => '')

		if (!response.ok) {
			const errorDetails = extractErrorCodeDescription(rawBody)

			console.error(
				'D365 CreateUpdateCustomer failed',
				sanitizeD365LogContext({
					endpoint: url,
					status: response.status,
					subscriptionKeyPresent: Boolean(subscriptionKey),
					errorCode: errorDetails?.errorCode,
					errorDescription: errorDetails?.errorDescription,
					body: normalizeErrorSummary(rawBody),
					contestName: payload.SiteCustomer.Passatempos?.[0]?.Name,
					contestCode: payload.SiteCustomer.Passatempos?.[0]?.CodigoPassatempo,
				})
			)

			return {
				ok: false,
				status: response.status,
				error: `d365_request_failed:${response.status}:${normalizeErrorSummary(rawBody)}`,
			}
		}

		const accountNumber =
			typeof (rawBody as Record<string, unknown> | null)?.AccountNumber === 'string'
				? ((rawBody as Record<string, unknown>).AccountNumber as string)
				: undefined

		console.info('D365 CreateUpdateCustomer success', {
			accountNumber,
		})

		return { ok: true, accountNumber }
	} catch (error) {
		console.error(
			'D365 CreateUpdateCustomer error',
			sanitizeD365LogContext({
				endpoint: url,
				error: normalizeErrorSummary(error),
				contestName: payload.SiteCustomer.Passatempos?.[0]?.Name,
				contestCode: payload.SiteCustomer.Passatempos?.[0]?.CodigoPassatempo,
			})
		)

		return {
			ok: false,
			error: normalizeErrorSummary(error),
		}
	} finally {
		clearTimeout(timeout)
	}
}
