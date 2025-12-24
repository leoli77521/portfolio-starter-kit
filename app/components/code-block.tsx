'use client'

import React, { useState } from 'react'
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react'

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  codeHTML: string
  rawCode: string
  language?: string
}

export function CodeBlock({ codeHTML, rawCode, language, ...props }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(rawCode)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Detect if code is long (simple heuristic)
  const isLong = rawCode.split('\n').length > 20

  return (
    <div className="group relative my-6 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-800/50">
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
          {language}
        </span>
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          aria-label="Copy code"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Code Content */}
      <div 
        className={`relative overflow-hidden transition-all duration-300 ${!isExpanded && isLong ? 'max-h-[300px]' : ''}`}
      >
        <div className="overflow-x-auto p-4">
          <code 
            dangerouslySetInnerHTML={{ __html: codeHTML }} 
            className="grid font-mono text-sm leading-6"
            {...props}
          />
        </div>
        
        {/* Gradient Overlay for collapsed state */}
        {!isExpanded && isLong && (
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Expand/Collapse Button */}
      {isLong && (
        <button
          onClick={toggleExpand}
          className="flex w-full items-center justify-center gap-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              Show more
            </>
          )}
        </button>
      )}
    </div>
  )
}
