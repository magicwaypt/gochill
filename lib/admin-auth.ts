export const ADMIN_SESSION_COOKIE = 'gochill_admin_session_v2'
export const LEGACY_ADMIN_SESSION_COOKIE = 'gochill_admin_session'
export const ADMIN_SESSION_VALUE = 'authenticated'
export const ADMIN_SESSION_COOKIE_NAMES = [
	ADMIN_SESSION_COOKIE,
	LEGACY_ADMIN_SESSION_COOKIE,
] as const

const CANONICAL_ADMIN_HOST = 'www.ibiza.gochill.pt'
const SHARED_ADMIN_COOKIE_DOMAIN = '.ibiza.gochill.pt'
const SHARED_ADMIN_HOSTS = new Set(['ibiza.gochill.pt', CANONICAL_ADMIN_HOST])

export const isAuthenticatedAdminSession = (value?: string) => value === ADMIN_SESSION_VALUE

export const hasAuthenticatedAdminSessionInCookieHeader = (cookieHeader?: string | null) => {
	if (!cookieHeader) {
		return false
	}

	return cookieHeader
		.split(';')
		.map((cookieEntry) => cookieEntry.trim())
		.some((cookieEntry) => {
			const separatorIndex = cookieEntry.indexOf('=')

			if (separatorIndex === -1) {
				return false
			}

			const cookieName = cookieEntry.slice(0, separatorIndex).trim()
			const cookieValue = cookieEntry.slice(separatorIndex + 1).trim()

			return ADMIN_SESSION_COOKIE_NAMES.includes(cookieName as (typeof ADMIN_SESSION_COOKIE_NAMES)[number])
				&& isAuthenticatedAdminSession(cookieValue)
		})
}

export const shouldUseSecureAdminCookie = (hostname?: string) => {
	if (!hostname) {
		return process.env.NODE_ENV === 'production'
	}

	const normalizedHostname = hostname.toLowerCase()

	if (normalizedHostname === 'localhost' || normalizedHostname === '127.0.0.1') {
		return false
	}

	return true
}

export const getAdminCookieDomain = (hostname?: string) => {
	if (!hostname) {
		return undefined
	}

	const normalizedHostname = hostname.toLowerCase()

	if (SHARED_ADMIN_HOSTS.has(normalizedHostname)) {
		return SHARED_ADMIN_COOKIE_DOMAIN
	}

	return undefined
}

export const getAdminCookieClearOptions = (hostname?: string) => ({
	domain: getAdminCookieDomain(hostname),
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: shouldUseSecureAdminCookie(hostname),
	path: '/',
	maxAge: 0,
})

export const getCanonicalAdminHref = (pathname: string, hostname?: string, protocol = 'https') => {
	if (!hostname) {
		return pathname
	}

	const normalizedHostname = hostname.toLowerCase()

	if (!SHARED_ADMIN_HOSTS.has(normalizedHostname)) {
		return pathname
	}

	return `${protocol}://${CANONICAL_ADMIN_HOST}${pathname}`
}

export const getClientAdminHref = (pathname: string) => {
	if (typeof window === 'undefined') {
		return pathname
	}

	return getCanonicalAdminHref(
		pathname,
		window.location.hostname,
		window.location.protocol.replace(':', '')
	)
}