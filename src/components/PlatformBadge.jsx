import React from 'react'
import { Car } from 'lucide-react'

// Professional Platform Logo & Badge Component
export default function PlatformBadge({ platform, size = 'md', showText = true, className = '' }) {
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
        <svg viewBox="0 0 1000 355" height={iconHeight} style={{ width: 'auto', display: 'block' }}>
          <path
            fill="#00b14f"
            d="M332.5 1495.6c-77.4-6.9-145.1-37.5-196.5-88.9-48.6-48.6-78.4-110.2-88.5-183-2.5-17.9-3-59.9-1-78.8 6.5-61.3 28.8-116 66.5-163.2 10.2-12.7 31.3-34.3 43.4-44.3 64.4-53.4 145.7-79.4 233.6-74.7 41.5 2.2 70 7.3 101.9 18.2 22.1 7.6 53.9 23.7 63.8 32.2l2.5 2.2-.3 24.1-.3 24.1-10.5-6.5c-48.2-29.6-109.3-45.3-176.4-45.3-56.9 0-109.4 15.3-154.1 44.7-46 30.3-80.7 73.1-100.9 124.6-27.5 69.8-23.2 155 11.2 223.8 39.2 78.4 111.4 128.9 201 140.5 26.4 3.4 65.2 1.9 92.8-3.7 90.3-18.2 147-80 159.1-173.4 1.3-9.8 1.7-21.5 1.8-47l.1-34-106.8-.3-106.8-.3v-49.1h261l-.1 43.3c0 48.8-1.1 74.3-3.9 94.7-8.7 61.6-31.6 110.7-69.5 148.6-38.4 38.4-87.5 60.9-150.5 69-14.7 1.9-57.8 2.7-72.5 1.4z"
            transform="matrix(.523 0 0 .523 -23.6 -427.8)"
          />
          <path
            fill="#00b14f"
            d="M345.5 1421c-61.5-4.8-113.3-28.6-154.1-70.7-12-12.4-18.9-20.9-28.1-34.9-34.1-51.8-47.4-119.4-35.8-182.3 14.9-80.6 70.5-147.5 148.5-178.6 19.8-7.9 44.3-13.7 67.5-16.1 15.1-1.5 55.6-.7 71.5 1.5 51.5 7 97.4 22.9 134.2 46.5l8.7 5.6v23.7c0 21.6-.2 23.8-1.8 24.7-1.4.7-4.5-.8-14.3-7-38.6-24.4-79.6-38.7-128-44.5-18.4-2.2-58.3-2.5-72-.5-88.4 12.7-151.3 76.3-162.5 164.1-3 23.9-1 57.6 5 81 13.3 52.2 45.4 94.7 88.4 116.8 29.2 15.1 54.9 21.2 89.1 21.2 48 0 86.6-13.6 113-40 17.2-17.1 27.2-37.7 29.5-60.8l.7-7.2h-138v-51h188v20.4c0 31.5-2.5 50.2-9.6 71.3-14.3 42.8-44.7 76.8-86.4 96.7-27.1 13-56 19.3-91.9 20-9.7.2-19.9.2-22.6 0z"
            transform="matrix(.523 0 0 .523 -23.6 -427.8)"
          />
        </svg>
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
        <svg viewBox="0 0 54 32" height={iconHeight} style={{ width: 'auto', display: 'block' }}>
          <path
            fill="#34d186"
            d="M14.7 11.1C16.8 7.7 15.8 3.2 12.4 1.1 11.2.4 9.9 0 8.6 0H0v23.6h9.6c4 0 7.2-3.3 7.2-7.3 0-2-.7-3.8-2.1-5.2zM5.5 5.6h3.1c.9 0 1.7.7 1.7 1.7 0 .9-.8 1.7-1.7 1.7H5.5V5.6zm4.1 12.4H5.5v-3.5h4.1c.9 0 1.7.8 1.7 1.7 0 1-.8 1.8-1.7 1.8zm33.8-18v23.6h-5.5V1.2L43.4 0zm-16 6.7c-4.7 0-8.5 3.8-8.5 8.6 0 4.7 3.8 8.5 8.5 8.5 4.7 0 8.5-3.8 8.5-8.5 0-4.8-3.8-8.6-8.5-8.6zm0 11.3c-1.5 0-2.8-1.2-2.8-2.8 0-1.5 1.2-2.8 2.8-2.8 1.5 0 2.7 1.2 2.7 2.8 0 1.5-1.2 2.8-2.7 2.8zm2.7 10.6c0 1.5-1.2 2.8-2.7 2.8-1.5 0-2.8-1.2-2.8-2.8 0-1.5 1.2-2.8 2.8-2.8 1.5 0 2.7 1.2 2.7 2.8zm23.9-21.6v5.5h-2.7v4.4c0 1.3.4 2.3 1.5 2.3.4 0 .8 0 1.2-.1v4.1c-.8.5-1.7.7-2.7.7h-.1c0 0-.2 0-.3 0h-.1l-.1-.1c-3.1-.2-5.2-2.1-5.2-5.5V7H54z"
          />
        </svg>
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
        <svg viewBox="0 0 320 320" height={iconHeight} style={{ width: 'auto', display: 'block' }}>
          <rect width="320" height="320" rx="72" fill="#06c755" />
          <path
            fill="#fff"
            d="M266.7 144.9c0-47.7-47.9-86.6-106.7-86.6S53.3 97.2 53.3 144.9c0 42.8 38 78.7 89.2 85.4 3.5.8 8.2 2.3 9.4 5.3 1.1 2.7.7 6.9.4 9.7l-1.5 9.1c-.5 2.7-2.2 10.6 9.2 5.8s61.4-36.2 83.8-62c14.9-17 22.9-34.2 22.9-53.3z"
          />
          <path
            fill="#06c755"
            d="M231.2 172.5h-30c-1.1 0-2-.9-2-2v-46.6c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v7.6c0 1.1-.9 2-2 2h-20.4v7.8h20.4c1.1 0 2 .9 2 2v7.6c0 1.1-.9 2-2 2h-20.4v7.9h20.4c1.1 0 2 .9 2 2v7.6c0 1.1-.9 1.9-2 1.9zM120.3 172.5c1.1 0 2-.9 2-2v-7.6c0-1.1-.9-2-2-2H99.9v-37c0-1.1-.9-2-2-2h-7.6c-1.1 0-2 .9-2 2v46.5c0 1.1.9 2 2 2h30zM128.7 121.9h11.6v50.6h-11.6zM189.8 121.9h-7.6c-1.1 0-2 .9-2 2v27.7l-21.3-28.8h-8.8c-1.1 0-2 .9-2 2v46.6c0 1.1.9 2 2 2h7.6c1.1 0 2-.9 2-2v-27.7l21.3 28.8c.3.4.8.6 1.3.6h7.5c1.1 0 2-.9 2-2v-46.6c0-1.2-.9-2.6-2-2.6z"
          />
        </svg>
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
