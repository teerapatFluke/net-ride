import React, { useState, useEffect } from 'react'
import { X, Settings, Target, Fuel, Gauge, ShieldCheck, Check } from 'lucide-react'
import { OWNER_EMAIL, OWNER_UID } from '../lib/supabase'

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
  user,
}) {
  if (!isOpen) return null

  const [fuelEfficiency, setFuelEfficiency] = useState(settings?.fuel_efficiency?.toString() || '15')
  const [lastFuelPrice, setLastFuelPrice] = useState(settings?.last_fuel_price?.toString() || '38')
  const [monthlyGoal, setMonthlyGoal] = useState(settings?.monthly_goal?.toString() || '8000')
  const [loading, setLoading] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    if (settings) {
      setFuelEfficiency(settings.fuel_efficiency?.toString() || '15')
      setLastFuelPrice(settings.last_fuel_price?.toString() || '38')
      setMonthlyGoal(settings.monthly_goal?.toString() || '8000')
    }
  }, [settings, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSavedSuccess(false)
    try {
      await onSave({
        fuel_efficiency: parseFloat(fuelEfficiency) || 15,
        last_fuel_price: parseFloat(lastFuelPrice) || 38,
        monthly_goal: parseFloat(monthlyGoal) || 8000,
      })
      setSavedSuccess(true)
      setTimeout(() => {
        setSavedSuccess(false)
        onClose()
      }, 700)
    } catch (err) {
      alert('บันทึกการตั้งค่าไม่สำเร็จ: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Settings size={22} style={{ color: 'var(--gold-500)' }} />
            <span>ตั้งค่าระบบและรถของคุณ</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* User security info box */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
        }}>
          <ShieldCheck size={20} style={{ color: 'var(--emerald-400)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div><b style={{ color: '#fff' }}>ผู้ใช้งาน:</b> {user?.email || OWNER_EMAIL}</div>
            <div style={{ wordBreak: 'break-all', marginTop: '2px', color: 'var(--text-muted)' }}>
              <b>UID:</b> {user?.id || OWNER_UID}
            </div>
            <div style={{ marginTop: '4px', color: 'var(--emerald-400)', fontWeight: 600 }}>
              ✓ เปิดใช้งาน Row Level Security (RLS) ล็อกสิทธิ์เฉพาะคุณ 100%
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Baseline Fuel Efficiency */}
          <div className="form-group">
            <label className="form-label">
              <span>อัตราสิ้นเปลืองน้ำมันของรถ (กม./ลิตร)</span>
              <Gauge size={16} style={{ color: '#38bdf8' }} />
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              required
              className="form-input"
              value={fuelEfficiency}
              onChange={(e) => setFuelEfficiency(e.target.value)}
              placeholder="เช่น 15.0"
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              ใช้เป็นค่ามาตรฐานในการคำนวณค่าน้ำมันอัตโนมัติ (เช่น มอเตอร์ไซค์ 35-45, รถยนต์ Eco car 15-20)
            </span>
          </div>

          {/* Default Fuel Price */}
          <div className="form-group">
            <label className="form-label">
              <span>ราคาน้ำมันตั้งต้น (บาท/ลิตร)</span>
              <Fuel size={16} style={{ color: 'var(--rose-500)' }} />
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              className="form-input"
              value={lastFuelPrice}
              onChange={(e) => setLastFuelPrice(e.target.value)}
              placeholder="เช่น 38.00"
            />
          </div>

          {/* Monthly Income Goal */}
          <div className="form-group">
            <label className="form-label">
              <span>เป้าหมายกำไรสุทธิต่อเดือน (บาท)</span>
              <Target size={16} style={{ color: 'var(--gold-500)' }} />
            </label>
            <input
              type="number"
              step="100"
              min="1000"
              required
              className="form-input"
              value={monthlyGoal}
              onChange={(e) => setMonthlyGoal(e.target.value)}
              placeholder="เช่น 8000"
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              สำหรับแสดงความคืบหน้าบน Monthly Goal Tracker
            </span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              ปิด
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
              style={{
                background: savedSuccess
                  ? '#059669'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              }}
            >
              {loading ? 'กำลังบันทึก...' : savedSuccess ? '✓ บันทึกสำเร็จ!' : 'บันทึกการตั้งค่า'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
