import { useState } from 'react'

function StoryCard({ story }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      {/* Category tag */}
      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full">
        {story.category}
      </span>

      {/* Title and source */}
      <h3 className="text-xl font-semibold mt-3 mb-1">{story.title}</h3>
      <p className="text-gray-500 text-sm mb-3">
        {story.source_name} · {new Date(story.published_at).toLocaleDateString()}
      </p>

      {/* Summary */}
      <p className="text-gray-300 mb-4">{story.summary}</p>

      {/* Analysis accordion */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition cursor-pointer"
      >
        {expanded ? '▾ Hide Analysis' : '▸ Open AI Analysis'}
      </button>

      {expanded && (
        <div className="mt-4 space-y-0">
          {story.what_happened && (
            <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-t-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded">W</span>
                <span className="text-gray-300 text-xs font-semibold tracking-wider uppercase">What Happened</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{story.what_happened}</p>
            </div>
          )}
          {story.why_it_matters && (
            <div className="bg-gray-800/50 border border-t-0 border-gray-700/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded">!</span>
                <span className="text-gray-300 text-xs font-semibold tracking-wider uppercase">Why It Matters</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{story.why_it_matters}</p>
            </div>
          )}
          {story.potential_impact && (
            <div className="bg-gray-800/50 border border-t-0 border-gray-700/50 p-4 rounded-b-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded">↑</span>
                <span className="text-gray-300 text-xs font-semibold tracking-wider uppercase">Potential Impact</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{story.potential_impact}</p>
            </div>
          )}
        </div>
      )}

      {/* Link to original */}
      <div className="mt-4">
        
        <a href={story.url}
          target="_blank"
          className="text-gray-500 hover:text-gray-300 text-sm transition"
        >
          Read full article at {story.source_name} →
        </a>
      </div>
    </div>
  )
}

export default StoryCard