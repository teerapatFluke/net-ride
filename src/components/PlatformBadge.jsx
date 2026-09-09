import React from 'react'
import { Car } from 'lucide-react'

// Professional Platform Logo & Badge Component
export default function PlatformBadge({ platform, size = 'md', showText = true, className = '' }) {
  if (typeof platform === 'string' && platform.includes(',')) {
    const list = platform.split(',').map(s => s.trim()).filter(Boolean)
    return (
      <span style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
        {list.map(p => (
          <PlatformBadge key={p} platform={p} size={size} showText={showText} className={className} />
        ))}
      </span>
    )
  }

  const isLg = size === 'lg'
  const isSm = size === 'sm'

  const iconHeight = isLg ? 22 : isSm ? 14 : 18

  if (platform === 'Grab') {
    return (
      <span
        className={`platform-badge-wrapper grab ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0, 177, 79, 0.12)',
          border: '1px solid rgba(0, 177, 79, 0.35)',
          padding: isLg ? '6px 14px' : isSm ? '2px 8px' : '4px 10px',
          borderRadius: '999px',
          color: '#38ef7d',
          fontWeight: 700,
          fontSize: isLg ? '0.9rem' : isSm ? '0.7rem' : '0.8rem',
        }}
      >
        <img
          src="./platforms/grab.svg"
          alt="Grab"
          style={{ height: `${iconHeight}px`, width: 'auto', display: 'block' }}
        />
        {showText && <span>GRAB</span>}
      </span>
    )
  }

  if (platform === 'Bolt') {
    return (
      <span
        className={`platform-badge-wrapper bolt ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(52, 209, 134, 0.12)',
          border: '1px solid rgba(52, 209, 134, 0.35)',
          padding: isLg ? '6px 14px' : isSm ? '2px 8px' : '4px 10px',
          borderRadius: '999px',
          color: '#34d186',
          fontWeight: 700,
          fontSize: isLg ? '0.9rem' : isSm ? '0.7rem' : '0.8rem',
        }}
      >
        <img
          src="./platforms/bolt.svg"
          alt="Bolt"
          style={{ height: `${iconHeight}px`, width: 'auto', display: 'block' }}
        />
        {showText && <span>BOLT</span>}
      </span>
    )
  }

  if (platform === 'Line Man' || platform === 'LINE MAN') {
    return (
      <span
        className={`platform-badge-wrapper lineman ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(6, 199, 85, 0.15)',
          border: '1px solid rgba(6, 199, 85, 0.35)',
          padding: isLg ? '6px 14px' : isSm ? '2px 8px' : '4px 10px',
          borderRadius: '999px',
          color: '#22c55e',
          fontWeight: 700,
          fontSize: isLg ? '0.9rem' : isSm ? '0.7rem' : '0.8rem',
        }}
      >
        <img
          src="./platforms/line.svg"
          alt="LINE MAN"
          style={{ height: `${iconHeight}px`, width: 'auto', display: 'block', borderRadius: '4px' }}
        />
        {showText && <span>LINE MAN</span>}
      </span>
    )
  }

  if (platform === 'inDrive') {
    return (
      <span
        className={`platform-badge-wrapper indrive ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(162, 255, 0, 0.15)',
          border: '1px solid rgba(162, 255, 0, 0.4)',
          padding: isLg ? '6px 14px' : isSm ? '2px 8px' : '4px 10px',
          borderRadius: '999px',
          color: '#bbf246',
          fontWeight: 800,
          fontSize: isLg ? '0.9rem' : isSm ? '0.7rem' : '0.8rem',
        }}
      >
        <span style={{
          background: '#a2ff00',
          color: '#000',
          borderRadius: '4px',
          padding: '1px 4px',
          fontSize: '0.65rem',
          fontWeight: 900
        }}>
          in
        </span>
        {showText && <span>Drive</span>}
      </span>
    )
  }

  // Other / Default
  return (
    <span
      className={`platform-badge-wrapper other ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(148, 163, 184, 0.12)',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        padding: isLg ? '6px 14px' : isSm ? '2px 8px' : '4px 10px',
        borderRadius: '999px',
        color: '#cbd5e1',
        fontWeight: 600,
        fontSize: isLg ? '0.9rem' : isSm ? '0.7rem' : '0.8rem',
      }}
    >
      <Car size={iconHeight} />
      {showText && <span>{platform || 'อื่น ๆ'}</span>}
    </span>
  )
}
