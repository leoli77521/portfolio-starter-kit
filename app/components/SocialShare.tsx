'use client'

import React, { useState, useEffect } from 'react'
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link as LinkIcon, 
  MessageCircle,
  Check,
  Share2,
  Copy,
  X
} from 'lucide-react'
import QRCode from 'qrcode'
import { 
  socialPlatforms, 
  openShareWindow, 
  copyToClipboard, 
  canUseNativeShare, 
  nativeShare,
  type ShareData 
} from 'app/lib/social-share'

interface SocialShareProps {
  title: string
  url: string
  summary: string
}

export function SocialShare({ title, url, summary }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isSharing, setIsSharing] = useState(false)

  const shareData: ShareData = { title, url, summary }

  // Generate QR code for WeChat sharing
  useEffect(() => {
    if (showQR && !qrCodeUrl) {
      const generateQR = async () => {
        try {
          const qrString = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            margin: 1,
            width: 200,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          })
          setQrCodeUrl(qrString)
        } catch (err) {
          console.error('Error generating QR code:', err)
        }
      }
      generateQR()
    }
  }, [showQR, url, qrCodeUrl])

  const handlePlatformShare = (platform: keyof typeof socialPlatforms) => {
    const shareUrl = socialPlatforms[platform](shareData)
    openShareWindow(shareUrl)
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    setIsSharing(true)
    const success = await nativeShare(shareData)
    if (!success) {
      // Fallback to copy link if native share fails
      await handleCopyLink()
    }
    setIsSharing(false)
  }

  const handleWeChatShare = () => {
    setShowQR(!showQR)
  }

  const platforms = [
    {
      name: 'Twitter/X',
      icon: Twitter,
      onClick: () => handlePlatformShare('twitter'),
      color: 'hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: () => handlePlatformShare('facebook'),
      color: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: () => handlePlatformShare('linkedin'),
      color: 'hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950'
    },
    {
      name: 'WeChat',
      icon: MessageCircle,
      onClick: handleWeChatShare,
      color: 'hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950'
    }
  ]

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 mt-12">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Share2 size={20} />
            Share This Article
          </h3>
          
          {/* Native Share Button (Mobile) */}
          {canUseNativeShare() && (
            <button
              onClick={handleNativeShare}
              disabled={isSharing}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              title="Share via system"
            >
              <Share2 size={16} />
              {isSharing ? 'Sharing...' : 'Share'}
            </button>
          )}
        </div>
        
        {/* Desktop/Tablet sharing buttons */}
        <div className="hidden md:flex flex-wrap gap-3">
          {platforms.map((platform) => (
            <button
              key={platform.name}
              onClick={platform.onClick}
              className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-all duration-200 text-neutral-600 dark:text-neutral-400 ${platform.color} dark:hover:border-neutral-600`}
              title={`Share on ${platform.name}`}
            >
              <platform.icon size={18} className="transition-transform group-hover:scale-110" />
              <span className="text-sm font-medium">{platform.name}</span>
            </button>
          ))}

          {/* Weibo Button */}
          <button
            onClick={() => handlePlatformShare('weibo')}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-all duration-200 text-neutral-600 dark:text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:border-neutral-600"
            title="Share on Weibo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="transition-transform group-hover:scale-110">
              <path d="M9.31 8.17c-2.76-.05-5.15 1.17-5.35 2.72-.2 1.55 1.86 3.07 4.62 3.12 2.76.05 5.15-1.17 5.35-2.72.2-1.55-1.86-3.07-4.62-3.12zM8.69 12.2c-.9.04-1.67-.45-1.72-1.1-.05-.65.65-1.22 1.55-1.26.9-.04 1.67.45 1.72 1.1.05.65-.65 1.22-1.55 1.26z"/>
              <path d="M20.87 6.95c-.49-.17-.83-.14-.76.08.32 1.02.06 2.17-.71 3.06-1.54 1.78-4.26 1.88-6.09 1.97.7.54 1.18 1.25 1.18 2.09 0 2.25-2.89 4.07-6.45 4.07S2.59 16.4 2.59 14.15c0-1.36.67-2.64 1.79-3.71-1.86-.4-3.15-1.4-3.15-2.61 0-2.13 3.33-3.86 7.43-3.86 2.31 0 4.36.59 5.66 1.51 1.3-.92 3.35-1.51 5.66-1.51 4.1 0 7.43 1.73 7.43 3.86 0 1.21-1.29 2.21-3.15 2.61 1.12 1.07 1.79 2.35 1.79 3.71 0 2.25-2.89 4.07-6.45 4.07-.49 0-.97-.03-1.44-.08.24-.46.37-.97.37-1.51 0-1.36-.67-2.64-1.79-3.71 1.86.4 3.15 1.4 3.15 2.61z"/>
            </svg>
            <span className="text-sm font-medium">Weibo</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 ${
              copied 
                ? 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:hover:border-neutral-600'
            }`}
            title="Copy link"
          >
            {copied ? (
              <>
                <Check size={18} className="text-green-600" />
                <span className="text-sm font-medium text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={18} className="transition-transform group-hover:scale-110" />
                <span className="text-sm font-medium">Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile sharing buttons */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-3">
            {platforms.slice(0, 4).map((platform) => (
              <button
                key={platform.name}
                onClick={platform.onClick}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-all duration-200 text-neutral-600 dark:text-neutral-400 ${platform.color}`}
                title={`Share on ${platform.name}`}
              >
                <platform.icon size={20} />
                <span className="text-sm font-medium">{platform.name}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => handlePlatformShare('weibo')}
              className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-all duration-200 text-neutral-600 dark:text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              title="Share on Weibo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.31 8.17c-2.76-.05-5.15 1.17-5.35 2.72-.2 1.55 1.86 3.07 4.62 3.12 2.76.05 5.15-1.17 5.35-2.72.2-1.55-1.86-3.07-4.62-3.12zM8.69 12.2c-.9.04-1.67-.45-1.72-1.1-.05-.65.65-1.22 1.55-1.26.9-.04 1.67.45 1.72 1.1.05.65-.65 1.22-1.55 1.26z"/>
                <path d="M20.87 6.95c-.49-.17-.83-.14-.76.08.32 1.02.06 2.17-.71 3.06-1.54 1.78-4.26 1.88-6.09 1.97.7.54 1.18 1.25 1.18 2.09 0 2.25-2.89 4.07-6.45 4.07S2.59 16.4 2.59 14.15c0-1.36.67-2.64 1.79-3.71-1.86-.4-3.15-1.4-3.15-2.61 0-2.13 3.33-3.86 7.43-3.86 2.31 0 4.36.59 5.66 1.51 1.3-.92 3.35-1.51 5.66-1.51 4.1 0 7.43 1.73 7.43 3.86 0 1.21-1.29 2.21-3.15 2.61 1.12 1.07 1.79 2.35 1.79 3.71 0 2.25-2.89 4.07-6.45 4.07-.49 0-.97-.03-1.44-.08.24-.46.37-.97.37-1.51 0-1.36-.67-2.64-1.79-3.71 1.86.4 3.15 1.4 3.15 2.61z"/>
              </svg>
              <span className="text-sm font-medium">Weibo</span>
            </button>
            
            <button
              onClick={handleCopyLink}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                copied 
                  ? 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
              title="Copy link"
            >
              {copied ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <span className="text-sm font-medium text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={20} />
                  <span className="text-sm font-medium">Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* WeChat QR Code Modal */}
        {showQR && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
            onClick={() => setShowQR(false)}
          >
            <div 
              className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-neutral-200 dark:border-neutral-700" 
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="WeChat Share QR Code"
            >
              <div className="text-center">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Share via WeChat
                  </h4>
                  <button
                    onClick={() => setShowQR(false)}
                    className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <X size={20} className="text-neutral-500" />
                  </button>
                </div>
                
                {qrCodeUrl ? (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-inner">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code for WeChat sharing" 
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Scan with WeChat to share this article
                    </p>
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center mx-auto">
                    <div className="text-neutral-500 text-sm">Generating QR Code...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Engagement text */}
        <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center border-t border-neutral-100 dark:border-neutral-800 pt-4">
          Found this article helpful? Share it with your network to help others discover it too.
        </div>
      </div>
    </div>
  )
}