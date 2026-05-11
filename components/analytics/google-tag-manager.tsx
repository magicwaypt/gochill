"use client"

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import {
	COOKIE_CONSENT_EVENT,
	getCookieConsent,
	type CookieConsentValue,
} from '@/lib/cookie-consent'

declare global {
	interface Window {
		dataLayer: Array<IArguments | Record<string, unknown>>
		gtag?: (...args: unknown[]) => void
	}
}

const getConsentModeState = (consent: CookieConsentValue | null) => ({
	analytics_storage: consent === 'accepted' ? 'granted' : 'denied',
	ad_storage: 'denied',
	ad_user_data: 'denied',
	ad_personalization: 'denied',
})

const ensureGtag = () => {
	window.dataLayer = window.dataLayer || []
	window.gtag = window.gtag || ((...args: unknown[]) => {
		window.dataLayer.push(args as unknown as IArguments)
	})
}

const updateConsentMode = (consent: CookieConsentValue | null) => {
	if (typeof window === 'undefined') {
		return
	}

	ensureGtag()
	const consentState = getConsentModeState(consent)
	window.gtag?.('consent', 'update', consentState)
	window.dataLayer.push({
		event: 'cookie_consent_update',
		cookie_consent: consent ?? 'unset',
		...consentState,
	})
}

const pushPageView = (pathname: string, search: string) => {
	if (typeof window === 'undefined') {
		return
	}

	window.dataLayer = window.dataLayer || []
	window.dataLayer.push({
		event: 'page_view',
		page_path: `${pathname}${search}`,
		page_location: window.location.href,
		page_title: document.title,
	})
}

function GoogleTagManagerInner() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const search = searchParams?.toString() ? `?${searchParams.toString()}` : ''

	useEffect(() => {
		updateConsentMode(getCookieConsent())

		const handleConsentChange = (event: Event) => {
			const consent = event instanceof CustomEvent ? (event.detail as CookieConsentValue) : getCookieConsent()
			updateConsentMode(consent)

			if (consent === 'accepted' && pathname) {
				pushPageView(pathname, search)
			}
		}

		window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange)
		return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange)
	}, [pathname, search])

	useEffect(() => {
		if (!pathname) {
			return
		}

		pushPageView(pathname, search)
	}, [pathname, search])

	return null
}

export function GoogleTagManager({ containerId }: { containerId: string }) {
	const deniedConsentMode = JSON.stringify({
		...getConsentModeState(null),
		wait_for_update: 500,
	})
	const acceptedConsentMode = JSON.stringify(getConsentModeState('accepted'))
	const rejectedConsentMode = JSON.stringify(getConsentModeState('rejected'))

	return (
		<>
			<Script
				id="gtm-consent-mode"
				strategy="beforeInteractive"
				dangerouslySetInnerHTML={{
					__html: `
						window.dataLayer = window.dataLayer || [];
						window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
						window.gtag('consent', 'default', ${deniedConsentMode});
						var consentMatch = document.cookie.match(/(?:^|; )cookie_consent=([^;]+)/);
						var consentValue = consentMatch ? decodeURIComponent(consentMatch[1]) : null;
						if (consentValue === 'accepted') {
							window.gtag('consent', 'update', ${acceptedConsentMode});
						} else if (consentValue === 'rejected') {
							window.gtag('consent', 'update', ${rejectedConsentMode});
						}
					`,
				}}
			/>
			<Script
				id="google-tag-manager"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
						(function(w,d,s,l,i){
							w[l]=w[l]||[];
							w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
							var f=d.getElementsByTagName(s)[0],
								j=d.createElement(s),
								dl=l!='dataLayer'?'&l='+l:'';
							j.async=true;
							j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
							f.parentNode.insertBefore(j,f);
						})(window,document,'script','dataLayer','${containerId}');
					`,
				}}
			/>
			<Suspense fallback={null}>
				<GoogleTagManagerInner />
			</Suspense>
		</>
	)
}