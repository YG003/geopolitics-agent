import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StoryCard from '../components/StoryCard'
import ProgressLog from '../components/ProgressLog'

function Briefing() {
  const [briefing, setBriefing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const generateBriefing = async () => {
    setLoading(true)
    setError(null)
    setBriefing(null)

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

  useEffect(() => {
    generateBriefing()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <button onClick={() => navigate('/')} className="text-xl font-bold hover:text-gray-300 transition cursor-pointer">
          ← GeoPulse
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Loading state */}
        {loading && <ProgressLog isLoading={loading} isComplete={false} />}

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
            {/* Header */}
            <div className="mb-8">
              <p className="text-gray-500 text-sm mb-2">
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-gray-400 text-lg">
                Here's your daily intelligence briefing — the most significant geopolitical
                developments from the past 24 hours, summarised and analysed by our AI agent.
              </p>
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

      {/* Footer */}
      <footer className="text-center text-gray-700 text-xs py-3 border-t border-gray-800">
        Built by Yaseen Gheedan — Powered by Claude &amp; NewsAPI
      </footer>
      
    </div>
  )
}

export default Briefing