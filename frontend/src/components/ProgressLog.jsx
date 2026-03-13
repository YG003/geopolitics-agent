import { useState, useEffect } from 'react'

const STEPS = [
  { text: 'Searching trusted news sources...', emoji: '🔍' },
  { text: 'Collecting recent articles...', emoji: '📰' },
  { text: 'Identifying key developments...', emoji: '🎯' },
  { text: 'Removing duplicate coverage...', emoji: '🧹' },
  { text: 'Generating summaries...', emoji: '✍️' },
  { text: 'Analysing impact...', emoji: '🧠' },
]

function ProgressLog({ isLoading, isComplete }) {
  const [visibleSteps, setVisibleSteps] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    setVisibleSteps(1)

    const interval = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= STEPS.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [isLoading])

  useEffect(() => {
    if (isComplete) {
      setVisibleSteps(STEPS.length)
    }
  }, [isComplete])

  if (!isLoading && !isComplete) return null

  return (
    <div className="py-16 max-w-md mx-auto">
      <div className="space-y-3">
        {STEPS.map((step, i) => {
          if (i >= visibleSteps) return null

          const isCompleted = i < visibleSteps - 1 || isComplete
          const isCurrent = i === visibleSteps - 1 && !isComplete

          return (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isCurrent ? 'text-white' : 'text-gray-500'
              }`}
            >
              {isCompleted ? (
                <span className="w-5 text-center text-base">{step.emoji}</span>
              ) : (
                <span className="w-5 text-center">
                  <span className="inline-block h-3 w-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </span>
              )}
              <span className={isCurrent ? 'font-medium' : ''}>{step.text}</span>
            </div>
          )
        })}
      </div>

      {!isComplete && visibleSteps > 0 && (
        <p className="text-gray-600 text-sm mt-6 text-center">
          This usually takes 15–30 seconds
        </p>
      )}
    </div>
  )
}

export default ProgressLog