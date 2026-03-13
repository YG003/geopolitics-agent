import { useNavigate } from 'react-router-dom'
import GlobeBackground from '../components/GlobeBackground'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden flex flex-col">
      {/* Animated globe background */}
      <GlobeBackground />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-gray-800/50">
        <h1 className="text-xl font-bold">GeoPulse</h1>
        <a href="https://github.com/YG003/geopolitics-agent" target="_blank" className="text-gray-400 hover:text-white transition">
          GitHub
        </a>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-32 flex-1">
        <h2 className="text-5xl font-bold mb-6">
          Geopolitics. Summarised.
        </h2>
        <p className="text-gray-300 text-xl mb-6 max-w-xl">
          An AI agent that researches global events and delivers concise daily briefings.
        </p>
        <p className="text-gray-500 text-base mb-14 max-w-2xl leading-relaxed">
          Our platform scans the latest geopolitical reporting, selects the most
          relevant stories, and transforms them into short, structured summaries.
          Each briefing includes key developments, source links, and analysis
          explaining why the story matters and its potential global impact.
        </p>
        <button
          onClick={() => navigate('/briefing')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-lg text-lg transition cursor-pointer"
        >
          Generate Today's Briefing
        </button>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center text-gray-600 text-sm py-2 border-t border-gray-800/50">
        Built by Yaseen Gheedan — Powered by Claude &amp; NewsAPI
      </footer>
    </div>
  )
}

export default Landing