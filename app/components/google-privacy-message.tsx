'use client'

import { useEffect } from 'react'

const ADSENSE_CLIENT_PATTERN = /^ca-pub-\d+$/

function getAdSenseClient() {
  const configuredClient = process.env.NEXT_PUBLIC_ADSENSE_ID?.trim() || ''
  return configuredClient.startsWith('ca-') ? configuredClient : `ca-${configuredClient}`
}

/** Load Google's published Funding Choices message only after React hydration. */
export default function GooglePrivacyMessage() {
  useEffect(() => {
    const client = getAdSenseClient()
    if (!ADSENSE_CLIENT_PATTERN.test(client)) {
      return
    }

    const scriptId = 'google-funding-choices'
    if (document.getElementById(scriptId)) {
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://fundingchoicesmessages.google.com/i/${client}?ers=1`
    script.async = true
    document.head.appendChild(script)
  }, [])

  return null
}
