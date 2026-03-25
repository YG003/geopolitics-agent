import { useState } from 'react'

const A  = '#c8903a'
const AD = 'rgba(200, 144, 58, 0.1)'
const AB = 'rgba(200, 144, 58, 0.22)'
const T  = '#d8d0bf'
const TD = 'rgba(216, 208, 191, 0.55)'
const TF = 'rgba(216, 208, 191, 0.24)'
const B  = 'rgba(200, 144, 58, 0.14)'
const BS = 'rgba(200, 144, 58, 0.32)'

function Corners({ size = 10, color = B }) {
  const s = `${size}px`, lw = '1px'
  return (
    <>
      <div style={{ position: 'absolute', top: -1, left: -1, width: s, height: s, borderTop: `${lw} solid ${color}`, borderLeft: `${lw} solid ${color}`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -1, right: -1, width: s, height: s, borderTop: `${lw} solid ${color}`, borderRight: `${lw} solid ${color}`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -1, left: -1, width: s, height: s, borderBottom: `${lw} solid ${color}`, borderLeft: `${lw} solid ${color}`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -1, right: -1, width: s, height: s, borderBottom: `${lw} solid ${color}`, borderRight: `${lw} solid ${color}`, pointerEvents: 'none' }} />
    </>
  )
}

export default function StoryCard({ story, index }) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const num = String(index + 1).padStart(2, '0')
  const date = story.published_at
    ? new Date(story.published_at).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      }).toUpperCase()
    : ''

  const sections = [
    { label: 'WHAT HAPPENED', icon: 'W', content: story.what_happened },
    { label: 'WHY IT MATTERS', icon: '!', content: story.why_it_matters },
    { label: 'POTENTIAL IMPACT', icon: '↑', content: story.potential_impact },
  ].filter(s => s.content)

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(9, 12, 20, 0.85)',
        border: `1px solid ${hovered ? BS : B}`,
        padding: '28px 28px 22px',
        backdropFilter: 'blur(6px)',
        transition: 'border-color 0.25s',
        animation: 'fadeSlideUp 0.6s ease both',
        animationDelay: `${index * 0.07}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Corners size={11} color={hovered ? BS : B} />

      {/* Top row */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '18px',
      }}>
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '2.4rem',
          fontWeight: 300,
          color: A,
          lineHeight: 1,
          opacity: 0.5,
          letterSpacing: '-0.02em',
        }}>
          {num}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
          {story.category && (
            <span style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '8px',
              letterSpacing: '0.22em',
              color: A,
              background: AD,
              border: `1px solid ${AB}`,
              padding: '3px 9px',
              textTransform: 'uppercase',
            }}>
              {story.category}
            </span>
          )}
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '9px',
            color: TF,
            letterSpacing: '0.08em',
          }}>
            {story.source_name}{date ? ` · ${date}` : ''}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: '1.6rem',
        fontWeight: 600,
        color: T,
        lineHeight: 1.22,
        margin: '0 0 14px',
        letterSpacing: '-0.01em',
      }}>
        {story.title}
      </h3>

      {/* Summary */}
      <p style={{
        fontFamily: 'Crimson Pro, Georgia, serif',
        fontSize: '1rem',
        color: TD,
        lineHeight: 1.72,
        margin: '0 0 22px',
      }}>
        {story.summary}
      </p>

      {/* Divider */}
      <div style={{ height: '1px', background: B, marginBottom: '16px' }} />

      {/* Actions row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '9px', letterSpacing: '0.18em',
            color: expanded ? A : TF,
            background: 'none', border: 'none', padding: 0,
            cursor: 'pointer', transition: 'color 0.2s',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}
          onMouseOver={e => e.currentTarget.style.color = A}
          onMouseOut={e => e.currentTarget.style.color = expanded ? A : TF}
        >
          <span style={{ fontSize: '10px' }}>{expanded ? '▾' : '▸'}</span>
          {expanded ? 'COLLAPSE ANALYSIS' : 'VIEW INTELLIGENCE ANALYSIS'}
        </button>

        <a
          href={story.url}
          target="_blank"
          rel="noreferrer"
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '9px', letterSpacing: '0.15em',
            color: TF, textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.color = TD}
          onMouseOut={e => e.currentTarget.style.color = TF}
        >
          SOURCE ↗
        </a>
      </div>

      {/* Analysis panel */}
      {expanded && sections.length > 0 && (
        <div style={{
          marginTop: '20px',
          borderTop: `1px solid ${B}`,
          paddingTop: '20px',
          animation: 'fadeSlideUp 0.35s ease both',
        }}>
          {sections.map((sec, i) => (
            <div
              key={i}
              style={{
                marginBottom: i < sections.length - 1 ? '18px' : 0,
                paddingBottom: i < sections.length - 1 ? '18px' : 0,
                borderBottom: i < sections.length - 1 ? `1px solid rgba(200,144,58,0.07)` : 'none',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px',
              }}>
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '9px', fontWeight: 500,
                  color: A, background: AD,
                  border: `1px solid ${AB}`,
                  width: '18px', height: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {sec.icon}
                </span>
                <span style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '9px', letterSpacing: '0.2em', color: TF, fontWeight: 500,
                }}>
                  {sec.label}
                </span>
              </div>
              <p style={{
                fontFamily: 'Crimson Pro, Georgia, serif',
                fontSize: '0.95rem', color: TD,
                lineHeight: 1.72, margin: 0,
                paddingLeft: '28px',
              }}>
                {sec.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
