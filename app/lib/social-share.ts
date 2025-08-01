// Social sharing utility functions

export interface ShareData {
  title: string
  url: string
  summary: string
}

export const socialPlatforms = {
  twitter: (data: ShareData) => {
    const text = encodeURIComponent(`${data.title} - ${data.summary}`)
    const url = encodeURIComponent(data.url)
    return `https://twitter.com/intent/tweet?text=${text}&url=${url}`
  },
  
  facebook: (data: ShareData) => {
    const url = encodeURIComponent(data.url)
    const quote = encodeURIComponent(`${data.title} - ${data.summary}`)
    return `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`
  },
  
  linkedin: (data: ShareData) => {
    const url = encodeURIComponent(data.url)
    const title = encodeURIComponent(data.title)
    const summary = encodeURIComponent(data.summary)
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`
  },
  
  weibo: (data: ShareData) => {
    const url = encodeURIComponent(data.url)
    const title = encodeURIComponent(`${data.title} - ${data.summary}`)
    return `https://service.weibo.com/share/share.php?url=${url}&title=${title}&pic=&appkey=`
  },
  
  telegram: (data: ShareData) => {
    const text = encodeURIComponent(`${data.title} - ${data.summary} ${data.url}`)
    return `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${text}`
  },
  
  whatsapp: (data: ShareData) => {
    const text = encodeURIComponent(`${data.title} - ${data.summary} ${data.url}`)
    return `https://wa.me/?text=${text}`
  }
}

export const openShareWindow = (url: string) => {
  const width = 600
  const height = 400
  const left = (window.innerWidth - width) / 2
  const top = (window.innerHeight - height) / 2
  
  window.open(
    url,
    'share',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
  )
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

// Check if native sharing is available
export const canUseNativeShare = () => {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

// Use native sharing if available
export const nativeShare = async (data: ShareData): Promise<boolean> => {
  if (!canUseNativeShare()) return false
  
  try {
    await navigator.share({
      title: data.title,
      text: data.summary,
      url: data.url,
    })
    return true
  } catch (error) {
    console.error('Native sharing failed:', error)
    return false
  }
}