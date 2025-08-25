'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'

interface SEOCheck {
  name: string
  passed: boolean
  message: string
  details?: any
}

interface SEOReport {
  timestamp: string
  overallScore: number
  summary: {
    passed: number
    total: number
    status: string
  }
  checks: SEOCheck[]
}

export default function SEODashboard() {
  const [report, setReport] = useState<SEOReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [expandedChecks, setExpandedChecks] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const fetchSEOReport = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/seo-health')
      if (!response.ok) throw new Error('Failed to fetch SEO report')
      
      const data = await response.json()
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSEOReport()
  }, [])

  const toggleExpanded = (checkName: string) => {
    const newExpanded = new Set(expandedChecks)
    if (newExpanded.has(checkName)) {
      newExpanded.delete(checkName)
    } else {
      newExpanded.add(checkName)
    }
    setExpandedChecks(newExpanded)
  }

  const getStatusIcon = (passed: boolean) => {
    return passed ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading && !report) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-red-800 font-medium">Error loading SEO report</h3>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <button
            onClick={fetchSEOReport}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">SEO Health Dashboard</h1>
        <button
          onClick={fetchSEOReport}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Score Card */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Overall SEO Score</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.summary.status)}`}>
            {report.summary.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={report.overallScore >= 80 ? 'text-green-500' : 
                          report.overallScore >= 60 ? 'text-blue-500' : 
                          report.overallScore >= 40 ? 'text-yellow-500' : 'text-red-500'}
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                strokeDasharray={`${report.overallScore}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{report.overallScore}</span>
            </div>
          </div>
          
          <div>
            <div className="text-3xl font-bold mb-1">{report.summary.passed} / {report.summary.total}</div>
            <div className="text-gray-600">checks passed</div>
            <div className="text-sm text-gray-500 mt-2">
              Last updated: {new Date(report.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Checks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Detailed Checks</h2>
        
        {report.checks.map((check) => (
          <div key={check.name} className="bg-white rounded-lg border">
            <div 
              className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpanded(check.name)}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(check.passed)}
                <div>
                  <h3 className="font-medium">{check.name}</h3>
                  <p className="text-sm text-gray-600">{check.message}</p>
                </div>
              </div>
              
              {expandedChecks.has(check.name) ? 
                <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                <ChevronRight className="w-5 h-5 text-gray-400" />
              }
            </div>
            
            {expandedChecks.has(check.name) && check.details && (
              <div className="border-t bg-gray-50 p-4">
                <h4 className="font-medium mb-2">Details:</h4>
                <pre className="text-sm bg-white p-3 rounded border overflow-auto">
                  {JSON.stringify(check.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border rounded hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">View Sitemap</div>
            <div className="text-sm text-gray-600">Check your site's XML sitemap</div>
          </a>
          
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border rounded hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">View Robots.txt</div>
            <div className="text-sm text-gray-600">Review crawler directives</div>
          </a>
          
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border rounded hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">Google Search Console</div>
            <div className="text-sm text-gray-600">Monitor search performance</div>
          </a>
          
          <a
            href="https://pagespeed.web.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border rounded hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">PageSpeed Insights</div>
            <div className="text-sm text-gray-600">Analyze page performance</div>
          </a>
        </div>
      </div>
    </div>
  )
}