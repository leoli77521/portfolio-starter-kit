'use client'

import Script from 'next/script'

const PlausibleAnalytics = () => {
  return (
    <>
      <Script
        src="https://plausible.io/js/pa-QKldr8obV9H8Z2F_VVe7d.js"
        strategy="lazyOnload"
        async
      />
      <Script id="plausible-init" strategy="lazyOnload">
        {`
          window.plausible = window.plausible || function() {
            (plausible.q = plausible.q || []).push(arguments)
          };
          plausible.init = plausible.init || function(i) {
            plausible.o = i || {}
          };
          plausible.init();
        `}
      </Script>
    </>
  )
}

export default PlausibleAnalytics
