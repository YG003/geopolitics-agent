import { useNavigate } from 'react-router-dom'
import GlobeBackground from '../components/GlobeBackground'

const A  = '#c8903a'
const AD = 'rgba(200, 144, 58, 0.12)'
const T  = '#d8d0bf'
const TD = 'rgba(216, 208, 191, 0.48)'
const TF = 'rgba(216, 208, 191, 0.22)'
const B  = 'rgba(200, 144, 58, 0.15)'

function FadeUp({ delay = 0, children, style = {} }) {
  return (
    <div style={{
      animation: 'fadeSlideUp 0.75s ease both',
      animationDelay: `${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060810',
      color: T,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      {/* Subtle coordinate grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `
          linear-gradient(rgba(200,144,58,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(200,144,58,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Noise texture */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      <GlobeBackground />

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

      {/* Navbar */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 36px', height: '52px',
        borderBottom: `1px solid ${B}`,
        background: 'rgba(6,8,16,0.72)',
        backdropFilter: 'blur(12px)',
      }}>
        <span style={{ color: A, fontSize: '13px', letterSpacing: '0.22em', fontWeight: 600 }}>
          GEOPULSE
        </span>
        <a
          href="https://github.com/YG003/geopolitics-agent"
          target="_blank"
          rel="noreferrer"
          style={{ color: TF, fontSize: '10px', letterSpacing: '0.14em', textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseOver={e => e.currentTarget.style.color = A}
          onMouseOut={e => e.currentTarget.style.color = TF}
        >
          GITHUB
        </a>
      </nav>

      {/* Hero */}
      <div style={{
        position: 'relative', zIndex: 10,
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '72px 24px',
      }}>
        <FadeUp delay={0.05}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            color: A, fontSize: '9px', letterSpacing: '0.28em',
            fontWeight: 500, marginBottom: '30px',
          }}>
            <div style={{ width: '32px', height: '1px', background: A, opacity: 0.4 }} />
            AI-POWERED GEOPOLITICAL ANALYSIS
            <div style={{ width: '32px', height: '1px', background: A, opacity: 0.4 }} />
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 600,
            lineHeight: 1.05,
            color: T,
            margin: '0 0 4px',
            letterSpacing: '-0.01em',
          }}>
            Global Intelligence.
          </h1>
        </FadeUp>

        <FadeUp delay={0.32}>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.05,
            color: A,
            margin: '0 0 38px',
            letterSpacing: '-0.01em',
          }}>
            Distilled.
          </h1>
        </FadeUp>

        <FadeUp delay={0.48}>
          <p style={{
            fontFamily: 'Crimson Pro, Georgia, serif',
            fontSize: '1.15rem',
            color: TD,
            maxWidth: '460px',
            lineHeight: 1.7,
            margin: '0 0 52px',
            fontWeight: 400,
          }}>
            An AI agent that researches global events and delivers
            concise daily briefings — with source analysis and geopolitical context.
          </p>
        </FadeUp>

        <FadeUp delay={0.62}>
          <button
            onClick={() => navigate('/briefing')}
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.22em',
              color: A,
              background: 'transparent',
              border: `1px solid ${A}`,
              padding: '14px 38px',
              cursor: 'pointer',
              transition: 'background 0.2s',
              animation: 'amberGlow 3.5s ease-in-out infinite',
            }}
            onMouseOver={e => e.currentTarget.style.background = AD}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            GENERATE TODAY'S BRIEFING
          </button>
        </FadeUp>

        <FadeUp delay={0.82} style={{ marginTop: '32px' }}>
          <div style={{ color: TF, fontSize: '9px', letterSpacing: '0.18em' }}>
            LAT 51.5°N · LON 0.1°W · NODE-9 ACTIVE
          </div>
        </FadeUp>
      </div>

      <footer style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center',
        color: TF,
        fontSize: '9px',
        letterSpacing: '0.14em',
        padding: '12px',
        borderTop: `1px solid ${B}`,
      }}>
        BUILT BY YASEEN GHEEDAN — POWERED BY CLAUDE &amp; NEWSAPI
      </footer>
    </div>
  )
}
