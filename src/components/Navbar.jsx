import React from 'react'
import { Settings, LogOut, Download, ShieldCheck } from 'lucide-react'

export default function Navbar({ user, onOpenSettings, onOpenExport, onSignOut }) {
  return (
    <header className="navbar">
      <div className="brand-section">
        <img src="./logo.jpeg" alt="Net Ride Logo" className="brand-logo" />
        <div className="brand-info">
          <h1>
            NET RIDE
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--emerald-400)',
              borderRadius: '999px',
              padding: '2px 6px',
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              PRO
            </span>
          </h1>
          <span>คำนวณรายได้สุทธิหักค่าน้ำมัน</span>
        </div>
      </div>

      <div className="nav-actions">
        <button
          className="btn-icon"
          title="ส่งออกข้อมูล CSV"
          onClick={onOpenExport}
        >
          <Download size={18} />
        </button>

        <button
          className="btn-icon"
          title="ตั้งค่า (Settings)"
          onClick={onOpenSettings}
        >
          <Settings size={18} />
        </button>

        <button
          className="btn-icon"
          title="ออกจากระบบ"
          onClick={onSignOut}
          style={{ color: 'var(--rose-500)' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
