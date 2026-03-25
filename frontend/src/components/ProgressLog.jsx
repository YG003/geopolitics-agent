import { useState, useEffect } from 'react'

const A  = '#c8903a'
const AD = 'rgba(200, 144, 58, 0.1)'
const AB = 'rgba(200, 144, 58, 0.22)'
const TD = 'rgba(216, 208, 191, 0.45)'
const TF = 'rgba(216, 208, 191, 0.2)'
const B  = 'rgba(200, 144, 58, 0.15)'

const STEPS = [
  { label: 'ESTABLISHING SECURE CHANNEL', detail: 'Connecting to intelligence feeds...' },
  { label: 'SCANNING NEWS NETWORKS',      detail: 'Searching trusted global sources...' },
  { label: 'COLLECTING INTELLIGENCE',     detail: 'Gathering recent developments...' },
  { label: 'PATTERN RECOGNITION',         detail: 'Identifying key developments...' },
  { label: 'DEDUPLICATION SWEEP',         detail: 'Removing redundant coverage...' },
  { label: 'GENERATING ANALYSIS',         detail: 'Synthesising intelligence briefing...' },
]

export default function ProgressLog({ isLoading, isComplete }) {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (!isLoading) return
    setVisible(1)
    const id = setInterval(() => {
      setVisible(prev => {
        if (prev >= STEPS.length) { clearInterval(id); return prev }
        return prev + 1
      })
    }, 1200)
    return () => clearInterval(id)
  }, [isLoading])

  useEffect(() => {
    if (isComplete) setVisible(STEPS.length)
  }, [isComplete])

  if (!isLoading && !isComplete) return null

  return (
    <div style={{
      padding: '64px 0',
      maxWidth: '520px',
      margin: '0 auto',
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '36px',
        paddingBottom: '20px',
        borderBottom: `1px solid ${B}`,
      }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: A, flexShrink: 0,
          animation: 'amberPulse 1.8s ease-in-out infinite',
        }} />
        <span style={{ color: A, fontSize: '12px', letterSpacing: '0.2em', fontWeight: 500 }}>
          PROCESSING INTELLIGENCE REQUEST
        </span>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {STEPS.map((step, i) => {
          if (i >= visible) return null
          const done    = i < visible - 1 || isComplete
          const current = i === visible - 1 && !isComplete

          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                opacity: done ? 0.38 : 1,
                transition: 'opacity 0.5s ease',
                animation: 'stepIn 0.4s ease both',
              }}
            >
              {/* Icon */}
              <div style={{ marginTop: '1px', flexShrink: 0, width: '14px', display: 'flex', justifyContent: 'center' }}>
                {done ? (
                  <span style={{ color: A, fontSize: '10px', opacity: 0.8 }}>✓</span>
                ) : (
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    border: `1.5px solid ${A}`,
                    borderTopColor: 'transparent',
                    animation: 'spin 1s linear infinite',
                  }} />
                )}
              </div>

              {/* Text */}
              <div>
                <div style={{
                  fontSize: '12px',
                  letterSpacing: '0.16em',
                  color: current ? A : TD,
                  marginBottom: current ? '5px' : 0,
                  transition: 'color 0.3s',
                }}>
                  {step.label}
                </div>
                {current && (
                  <div style={{
                    fontFamily: 'Crimson Pro, Georgia, serif',
                    fontSize: '14px',
                    color: TF,
                    letterSpacing: '0.04em',
                  }}>
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Time estimate */}
      {!isComplete && visible > 0 && (
        <div style={{
          marginTop: '32px', paddingTop: '18px',
          borderTop: `1px solid ${B}`,
          fontSize: '9px', color: TF,
          letterSpacing: '0.15em',
        }}>
          ESTIMATED PROCESSING TIME: 15–30 SECONDS
        </div>
      )}
    </div>
  )
}
