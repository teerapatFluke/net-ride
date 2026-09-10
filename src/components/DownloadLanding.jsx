import React, { useEffect, useState } from 'react'
import { CheckCircle2, Download, ExternalLink, ArrowLeft } from 'lucide-react'

export default function DownloadLanding({ downloadData, onExit }) {
  const [downloaded, setDownloaded] = useState(false)
  const { filename, content } = downloadData

  const triggerDownload = () => {
    try {
      const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 1000)
      setDownloaded(true)
    } catch (err) {
      console.error('Trigger download error:', err)
    }
  }

  useEffect(() => {
    // Automatically trigger download on page load
    triggerDownload()
  }, [])

  const handleBackToLine = () => {
    // Try to open LIFF or close window
    try {
      window.close()
    } catch {}
    window.location.href = 'https://liff.line.me/2011538034-u50VZuPm'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-dark, #0b0f19)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: '#fff',
      fontFamily: "'Prompt', sans-serif"
    }}>
      <div style={{
        background: 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '28px 24px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.15)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          color: '#34d399'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px 0', color: '#fff' }}>
          กำลังส่งไฟล์ลงเครื่องของคุณ
        </h2>
        
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 20px 0' }}>
          เบราว์เซอร์ได้เริ่มดาวน์โหลดไฟล์ CSV เรียบร้อยแล้ว หากมีหน้าต่างถาม ให้แตะที่ <strong>"ดาวน์โหลด"</strong>
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textAlign: 'left'
        }}>
          <span style={{ fontSize: '1.4rem' }}>📄</span>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9', wordBreak: 'break-all' }}>
              {filename}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>
              ไฟล์ Excel / CSV พร้อมเปิดใช้งาน
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={triggerDownload}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={16} />
            <span>แตะเพื่อดาวน์โหลดอีกครั้ง</span>
          </button>

          <button
            type="button"
            onClick={handleBackToLine}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '12px',
              background: '#06c755',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>กลับไปที่ LINE</span>
          </button>

          {onExit && (
            <button
              type="button"
              onClick={onExit}
              style={{
                width: '100%',
                padding: '8px',
                background: 'transparent',
                color: '#64748b',
                border: 'none',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              เข้าสู่หน้าหลักของ NetRide บนเบราว์เซอร์นี้
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
