import 'server-only'

import crypto from 'node:crypto'

export const PUBLIC_PARTICIPATION_FILE_TYPES = ['talao', 'foto'] as const

type PublicParticipationFileType = (typeof PUBLIC_PARTICIPATION_FILE_TYPES)[number]

const DEFAULT_PUBLIC_FILE_LINK_TTL_SECONDS = 60 * 60 * 24 * 365
const DEVELOPMENT_PUBLIC_FILE_LINK_SECRET = 'gochill-development-public-file-link-secret'

const resolvePublicFileLinkSecret = () => {
	const secret =
		process.env.ADMIN_FILE_LINK_SECRET
		?? process.env.AUTH_SECRET
		?? process.env.NEXTAUTH_SECRET
		?? process.env.POSTGRES_URL
		?? process.env.DATABASE_URL

	if (secret) {
		return secret
	}

	if (process.env.NODE_ENV !== 'production') {
		return DEVELOPMENT_PUBLIC_FILE_LINK_SECRET
	}

	throw new Error('ADMIN_FILE_LINK_SECRET is required in production when no signing secret is configured')
}

const getPublicFileLinkTtlSeconds = () => {
	const value = Number(process.env.ADMIN_FILE_LINK_TTL_SECONDS ?? DEFAULT_PUBLIC_FILE_LINK_TTL_SECONDS)

	if (!Number.isFinite(value) || value <= 0) {
		return DEFAULT_PUBLIC_FILE_LINK_TTL_SECONDS
	}

	return Math.floor(value)
}

const getPublicFileSignature = (
	participationId: number,
	fileType: PublicParticipationFileType,
	expiresAt: number
) => {
	const payload = `${participationId}:${fileType}:${expiresAt}`

	return crypto
		.createHmac('sha256', resolvePublicFileLinkSecret())
		.update(payload)
		.digest('base64url')
}

export const isPublicParticipationFileType = (value: string): value is PublicParticipationFileType =>
	PUBLIC_PARTICIPATION_FILE_TYPES.includes(value as PublicParticipationFileType)

export const createPublicParticipationFileUrl = ({
	origin,
	participationId,
	fileType,
}: {
	origin: string
	participationId: number
	fileType: PublicParticipationFileType
}) => {
	const expiresAt = Math.floor(Date.now() / 1000) + getPublicFileLinkTtlSeconds()
	const token = getPublicFileSignature(participationId, fileType, expiresAt)

	return `${origin}/api/public/participations/${participationId}/files/${fileType}?expires=${expiresAt}&token=${token}`
}

export const isValidPublicParticipationFileToken = ({
	participationId,
	fileType,
	expiresAt,
	token,
}: {
	participationId: number
	fileType: PublicParticipationFileType
	expiresAt: number
	token: string
}) => {
	if (!token || !Number.isFinite(expiresAt) || expiresAt < Math.floor(Date.now() / 1000)) {
		return false
	}

	const expectedToken = getPublicFileSignature(participationId, fileType, expiresAt)
	const tokenBuffer = Buffer.from(token)
	const expectedTokenBuffer = Buffer.from(expectedToken)

	if (tokenBuffer.length !== expectedTokenBuffer.length) {
		return false
	}

	return crypto.timingSafeEqual(tokenBuffer, expectedTokenBuffer)
}