const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = process.cwd()
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')

test('analytics taxonomy is typed and enriched with locale and page context', () => {
  const events = read('app/lib/analytics-events.ts')

  for (const eventName of [
    'newsletter_signup',
    'guide_start',
    'directory_entry_click',
    'web_vital',
  ]) {
    assert.match(events, new RegExp(`${eventName}:`))
  }

  assert.match(events, /export type AnalyticsEvent = keyof AnalyticsEventMap/)
  assert.match(events, /locale:/)
  assert.match(events, /page_path:/)
})

test('Google integrations use environment configuration and Consent Mode v2 defaults', () => {
  const analytics = read('app/components/google-analytics.tsx')
  const consent = read('app/components/google-consent-mode.tsx')
  const privacyMessage = read('app/components/google-privacy-message.tsx')
  const adsense = read('app/components/google-adsense.tsx')
  const adUnit = read('app/components/AdUnit.tsx')
  const appSources = [analytics, consent, privacyMessage, adsense, adUnit].join('\n')

  assert.match(analytics, /NEXT_PUBLIC_GA_ID/)
  assert.match(adsense, /NEXT_PUBLIC_ADSENSE_ID/)
  assert.match(privacyMessage, /fundingchoicesmessages\.google\.com/)
  assert.match(privacyMessage, /useEffect/)
  assert.match(privacyMessage, /NEXT_PUBLIC_ADSENSE_ID/)
  assert.match(adUnit, /NEXT_PUBLIC_ADSENSE_ID/)
  assert.doesNotMatch(appSources, /G-K3J29WZHLX|pub-8944496077703633|5086618750/)

  for (const signal of [
    'analytics_storage',
    'ad_storage',
    'ad_user_data',
    'ad_personalization',
  ]) {
    assert.match(consent, new RegExp(`${signal}: 'denied'`))
  }

  assert.match(consent, /window\.gtag\('consent', 'update'/)
  assert.doesNotMatch(
    consent,
    /gdprApplies === false/,
    'non-GDPR traffic must not be treated as explicit consent'
  )
})

test('AdSense is limited to English articles and the ad request waits for consent', () => {
  const adsense = read('app/components/google-adsense.tsx')
  const adUnit = read('app/components/AdUnit.tsx')
  const article = read('app/blog/[slug]/page.tsx')

  assert.match(adsense, /\^\\\/blog\\\/\[\^\/\]\+\$/)
  assert.match(adsense, /requestIdleCallback/)
  assert.match(adsense, /ad_storage !== 'granted'/)
  assert.match(adUnit, /ad_storage !== 'granted'/)
  assert.match(adUnit, /requestedRef\.current = true/)
  assert.match(adUnit, /if \(!hasAdStorageConsent\)/)
  assert.match(article, /source\.length \* 0\.4/)
  assert.match(article, /headingPositions\.length < 2/)
  assert.match(article, /locale === defaultLocale/)
  assert.match(article, /NEXT_PUBLIC_IN_ARTICLE_AD_SLOT/)
})

test('article sharing keeps the server and first client render deterministic', () => {
  const socialShare = read('app/components/SocialShare.tsx')

  assert.match(socialShare, /nativeShareAvailable/)
  assert.match(socialShare, /setNativeShareAvailable\(canUseNativeShare\(\)\)/)
  assert.doesNotMatch(socialShare, /\{canUseNativeShare\(\) &&/)
})
