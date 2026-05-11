export const COOKIE_CONSENT_KEY = 'cookie_consent'
export const COOKIE_CONSENT_EVENT = 'cookie-consent-changed'

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

export type CookieConsentValue = 'accepted' | 'rejected'

export const isCookieConsentValue = (value: string | null): value is CookieConsentValue => {
	return value === 'accepted' || value === 'rejected'
}

export const getCookieConsentFromDocument = (): CookieConsentValue | null => {
	if (typeof document === 'undefined') {
		return null
	}

	const consentCookie = document.cookie
		.split(';')
		.map((cookieEntry) => cookieEntry.trim())
		.find((cookieEntry) => cookieEntry.startsWith(`${COOKIE_CONSENT_KEY}=`))

	if (!consentCookie) {
		return null
	}

	const cookieValue = decodeURIComponent(consentCookie.slice(COOKIE_CONSENT_KEY.length + 1))
	return isCookieConsentValue(cookieValue) ? cookieValue : null
}

export const getCookieConsent = (): CookieConsentValue | null => {
	if (typeof window === 'undefined') {
		return null
	}

	const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY)
	if (isCookieConsentValue(storedConsent)) {
		return storedConsent
	}

	return getCookieConsentFromDocument()
}

export const persistCookieConsent = (value: CookieConsentValue) => {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return
	}

	window.localStorage.setItem(COOKIE_CONSENT_KEY, value)
	document.cookie = `${COOKIE_CONSENT_KEY}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
	window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }))
}