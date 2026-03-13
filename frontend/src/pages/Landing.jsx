// frontend/src/pages/Landing.jsx
// Landing page: hero headline, short product description, a CTA button
// that triggers the agent, and a static sample briefing for illustration.


import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">GeoPulse</h1>
        
          <a href="https://github.com/YG003/geopolitics-agent"
          target="_blank"
          className="text-gray-400 hover:text-white transition"
        >
          GitHub
        </a>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-32">
        <h2 className="text-5xl font-bold mb-4">
          Your daily AI briefing on geopolitics
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-xl">
          An autonomous AI agent searches, deduplicates, categorises, and
          summarises today's most important geopolitical developments.
        </p>
        <button
          onClick={() => navigate('/briefing')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-lg text-lg transition cursor-pointer"
        >
          Generate Today's Briefing
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 py-8 border-t border-gray-800">
        Built by Yaseen Gheedan — Powered by Claude &amp; NewsAPI
      </footer>
    </div>
  )
}

export default Landing