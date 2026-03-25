import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import StoryCard from '../components/StoryCard'
import ProgressLog from '../components/ProgressLog'

const A  = '#c8903a'
const AD = 'rgba(200, 144, 58, 0.1)'
const T  = '#d8d0bf'
const TD = 'rgba(216, 208, 191, 0.48)'
const TF = 'rgba(216, 208, 191, 0.22)'
const B  = 'rgba(200, 144, 58, 0.15)'

export default function Briefing() {
  const navigate = useNavigate()
  const [briefing, setBriefing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inFlight = useRef(false)

  const generateBriefing = async () => {
    if (inFlight.current) return
    inFlight.current = true
    setLoading(true)
    setError(null)
    setBriefing(null)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/briefing', { method: 'POST' })
      const data = await response.json()
      let raw = data.briefing
      raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(raw)
      setBriefing({ stories: parsed.stories || [] })
    } catch (err) {
      console.log('Parse error:', err)
      setError('Failed to generate briefing. Is the backend running?')
    } finally {
      setLoading(false)
      inFlight.current = false
    }
  }

  useEffect(() => { generateBriefing() }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060810',
      color: T,
      fontFamily: 'IBM Plex Mono, monospace',
      position: 'relative',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(200,144,58,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(200,144,58,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Noise */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Classification bar */}
      <div style={{
        position: 'relative', zIndex: 10,
        background: 'rgba(200,144,58,0.08)',
        borderBottom: `1px solid ${B}`,
        padding: '4px 36px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: A, fontSize: '9px', letterSpacing: '0.22em', fontWeight: 500 }}>UNCLASSIFIED</span>
          <span style={{ color: TF, fontSize: '9px' }}>//</span>
          <span style={{ color: TF, fontSize: '9px', letterSpacing: '0.14em' }}>OPEN-SOURCE INTELLIGENCE</span>
        </div>
        <span style={{ color: TF, fontSize: '9px', letterSpacing: '0.12em' }}>
          {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
        </span>
      </div>

      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 36px', height: '52px',
        borderBottom: `1px solid ${B}`,
        background: 'rgba(6,8,16,0.82)',
        backdropFilter: 'blur(12px)',
      }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: A, fontSize: '13px', letterSpacing: '0.22em', fontWeight: 600,
          fontFamily: 'IBM Plex Mono, monospace', padding: 0,
        }}>
          ← GEOPULSE
        </button>
      </nav>

      {/* Content */}
      <main style={{
        position: 'relative', zIndex: 10,
        maxWidth: '840px', margin: '0 auto',
        padding: '48px 24px 100px',
      }}>
        {loading && <ProgressLog isLoading={loading} isComplete={false} />}

        {error && (
          <div style={{ textAlign: 'center', paddingTop: '80px' }}>
            <div style={{
              display: 'inline-block',
              border: '1px solid rgba(192,57,43,0.4)',
              padding: '24px 40px',
              marginBottom: '24px',
            }}>
              <p style={{
                color: 'rgba(192,57,43,0.9)', fontSize: '10px',
                letterSpacing: '0.2em', margin: '0 0 8px',
              }}>
                CONNECTION FAILED
              </p>
              <p style={{
                fontFamily: 'Crimson Pro, Georgia, serif',
                color: TD, fontSize: '1rem', margin: 0, lineHeight: 1.6,
              }}>
                {error}
              </p>
            </div>
            <br />
            <button
              onClick={generateBriefing}
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '10px', letterSpacing: '0.2em',
                color: A, background: 'none',
                border: `1px solid ${A}`, padding: '11px 28px',
                cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = AD}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >
              RETRY CONNECTION
            </button>
          </div>
        )}

        {briefing && !loading && (
          <div style={{ animation: 'fadeSlideUp 0.6s ease both' }}>
            {/* Brief intro */}
            <div style={{
              marginBottom: '48px',
              paddingBottom: '32px',
              borderBottom: `1px solid ${B}`,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                marginBottom: '20px',
              }}>
                <div style={{ flex: 1, height: '1px', background: B }} />
                <span style={{ color: A, fontSize: '9px', letterSpacing: '0.26em', fontWeight: 500 }}>
                  DAILY INTELLIGENCE BRIEF
                </span>
                <div style={{ flex: 1, height: '1px', background: B }} />
              </div>
              <p style={{
                fontFamily: 'Crimson Pro, Georgia, serif',
                fontSize: '1.1rem',
                color: TD,
                lineHeight: 1.72,
                margin: 0,
              }}>
                The most significant geopolitical developments from the past 24 hours —
                summarised and analysed by AI, drawing from verified news sources worldwide.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {briefing.stories?.map((story, i) => (
                <StoryCard key={i} story={story} index={i} />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center', color: TF,
        fontSize: '9px', letterSpacing: '0.14em',
        padding: '14px', borderTop: `1px solid ${B}`,
      }}>
        BUILT BY YASEEN GHEEDAN — POWERED BY CLAUDE &amp; NEWSAPI
      </footer>
    </div>
  )
}
