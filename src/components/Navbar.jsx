import React from 'react'
import { Settings, LogOut, Download, ShieldCheck } from 'lucide-react'

export default function Navbar({ user, onOpenSettings, onOpenExport, onSignOut }) {
  return (
    <header className="navbar">
      <div className="brand-section">
        <img src="./image.png" alt="Net Ride Logo" className="brand-logo" />
        <div className="brand-info">
          <h1>NET RIDE</h1>
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
