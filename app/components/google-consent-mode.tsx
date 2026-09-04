import Script from 'next/script'

const consentBootstrap = String.raw`
(function () {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  var denied = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  };

  window.__tolearnGoogleConsent = denied;
  window.gtag('consent', 'default', Object.assign({ wait_for_update: 1500 }, denied));

  function publishConsent(nextConsent) {
    window.__tolearnGoogleConsent = nextConsent;
    window.gtag('consent', 'update', nextConsent);
    window.dispatchEvent(new CustomEvent('tolearn:google-consent-update', {
      detail: nextConsent
    }));
  }

  function handleTcfUpdate(tcData, success) {
    if (!success || !tcData) return;

    if (tcData.gdprApplies !== true) return;
    if (tcData.eventStatus !== 'tcloaded' && tcData.eventStatus !== 'useractioncomplete') return;

    var purposeConsents = (tcData.purpose && tcData.purpose.consents) || {};
    var vendorConsents = (tcData.vendor && tcData.vendor.consents) || {};
    var googleVendorConsent = vendorConsents[755] === true;
    var storageConsent = purposeConsents[1] === true;
    var personalizationConsent = purposeConsents[3] === true && purposeConsents[4] === true;

    publishConsent({
      analytics_storage: storageConsent ? 'granted' : 'denied',
      ad_storage: storageConsent && googleVendorConsent ? 'granted' : 'denied',
      ad_user_data: storageConsent && googleVendorConsent ? 'granted' : 'denied',
      ad_personalization: storageConsent && personalizationConsent && googleVendorConsent
        ? 'granted'
        : 'denied'
    });
  }

  function connectToCmp() {
    if (typeof window.__tcfapi !== 'function') return false;
    window.__tcfapi('addEventListener', 2, handleTcfUpdate);
    return true;
  }

  if (!connectToCmp()) {
    var attempts = 0;
    var cmpTimer = window.setInterval(function () {
      attempts += 1;
      if (connectToCmp() || attempts >= 20) window.clearInterval(cmpTimer);
    }, 500);
  }
})();
`

export default function GoogleConsentMode() {
  return (
    <Script
      id="google-consent-mode-v2"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: consentBootstrap }}
    />
  )
}
