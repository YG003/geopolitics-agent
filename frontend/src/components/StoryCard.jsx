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

      {/* Why It Matters accordion */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition cursor-pointer"
      >
        {expanded ? '▾ Hide Analysis' : '▸ Why It Matters'}
      </button>

      {expanded && (
        <div className="mt-3 pl-4 border-l-2 border-blue-800 text-gray-400">
          {story.why_it_matters}
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