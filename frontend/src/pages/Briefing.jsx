import { useState } from 'react'
import StoryCard from '../components/StoryCard'

function Briefing() {
  const [briefing, setBriefing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateBriefing = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/briefing', {
        method: 'POST',
      })
      const data = await response.json()
      const parsed = JSON.parse(data.briefing)
      setBriefing(parsed)
    } catch (err) {
      setError('Failed to generate briefing. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  // Auto-trigger on page load
  useState(() => {
    generateBriefing()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <a href="/" className="text-xl font-bold hover:text-gray-300 transition">GeoPulse</a>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Generating your briefing...</p>
            <p className="text-gray-600 text-sm mt-2">This usually takes 30-60 seconds</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error}</p>
            <button onClick={generateBriefing} className="mt-4 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg transition cursor-pointer">
              Try Again
            </button>
          </div>
        )}

        {/* Briefing content */}
        {briefing && !loading && (
          <>
            {/* Headline banner */}
            <div className="mb-8">
              <p className="text-gray-500 text-sm mb-2">
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-3xl font-bold mb-4">{briefing.headline}</h1>
              <p className="text-gray-300 text-lg mb-4">{briefing.executive_summary}</p>
              <div className="flex flex-wrap gap-2">
                {briefing.topic_tags?.map((tag, i) => (
                  <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Story cards */}
            <div className="space-y-4">
              {briefing.stories?.map((story, i) => (
                <StoryCard key={i} story={story} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Briefing