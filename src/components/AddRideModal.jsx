import React, { useState, useEffect } from 'react'
import { X, PlusCircle, Check, Car, Fuel, Navigation, DollarSign, FileText } from 'lucide-react'
import { getTodayString } from '../lib/dateUtils'
import PlatformBadge from './PlatformBadge'

export default function AddRideModal({
  isOpen,
  onClose,
  onSave,
  defaultEfficiency = 15.0,
  defaultFuelPrice = 38.0,
  defaultDepreciation = 0.0,
  initialDate,
  editRide = null,
}) {
  if (!isOpen) return null

  const [date, setDate] = useState(initialDate || getTodayString())
  const [platform, setPlatform] = useState('Grab')
  const [grossIncome, setGrossIncome] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [fuelPrice, setFuelPrice] = useState(defaultFuelPrice.toString())
  const [fuelEfficiency, setFuelEfficiency] = useState(defaultEfficiency.toString())
  const [depreciationPerKm, setDepreciationPerKm] = useState(defaultDepreciation.toString())
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize form if editing
  useEffect(() => {
    if (editRide) {
      setDate(editRide.log_date || initialDate)
      setPlatform(editRide.platform || 'Grab')
      setGrossIncome(editRide.gross_income?.toString() || '')
      setDistanceKm(editRide.distance_km?.toString() || '')
      setFuelPrice(editRide.fuel_price?.toString() || defaultFuelPrice.toString())
      setFuelEfficiency(editRide.fuel_efficiency?.toString() || defaultEfficiency.toString())
      setDepreciationPerKm(editRide.depreciation_per_km?.toString() ?? defaultDepreciation.toString())
      setNotes(editRide.notes || '')
    } else {
      setDate(initialDate || getTodayString())
      setPlatform('Grab')
      setGrossIncome('')
      setDistanceKm('')
      setFuelPrice(defaultFuelPrice.toString())
      setFuelEfficiency(defaultEfficiency.toString())
      setDepreciationPerKm(defaultDepreciation.toString())
      setNotes('')
    }
  }, [editRide, isOpen, initialDate, defaultEfficiency, defaultFuelPrice, defaultDepreciation])

  // Real-time calculation
  const gross = parseFloat(grossIncome) || 0
  const dist = parseFloat(distanceKm) || 0
  const price = parseFloat(fuelPrice) || 0
  const eff = parseFloat(fuelEfficiency) || 15.0
  const depRate = parseFloat(depreciationPerKm) || 0

  const fuelCost = eff > 0 ? (dist / eff) * price : 0
  const depCost = dist * depRate
  const netIncome = gross - fuelCost - depCost

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (gross <= 0 && dist <= 0) {
      setError('กรุณาระบุรายได้รวม หรือระยะทาง')
      return
    }

    if (eff <= 0) {
      setError('อัตราสิ้นเปลืองน้ำมันต้องมากกว่า 0')
      return
    }

    setLoading(true)
    try {
      await onSave({
        id: editRide?.id,
        log_date: date,
        platform: platform,
        gross_income: gross,
        distance_km: dist,
        fuel_price: price,
        fuel_efficiency: eff,
        depreciation_per_km: depRate,
        notes: notes.trim(),
      })
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-sheet-handle" />
        <div className="modal-header">
          <div className="modal-title">
            <PlusCircle size={22} style={{ color: 'var(--emerald-400)' }} />
            <span>{editRide ? 'แก้ไขข้อมูลการขับ' : 'บันทึกรอบการขับใหม่'}</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fda4af',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Platform Selector Buttons (Single Select) */}
          <div className="form-group">
            <label className="form-label">
              <span>เลือกแพลตฟอร์ม</span>
            </label>

            {/* Top 3 Platforms: Grab, Bolt, Line Man */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }}>
              {/* GRAB */}
              <button
                type="button"
                className={`platform-btn ${platform === 'Grab' ? 'active grab' : ''}`}
                onClick={() => setPlatform('Grab')}
                style={{
                  height: '50px',
                  padding: '0 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  borderWidth: platform === 'Grab' ? '1.5px' : '1px'
                }}
              >
                {platform === 'Grab' && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '6px',
                    fontSize: '0.65rem',
                    color: '#38ef7d',
                    fontWeight: 900
                  }}>
                    ✓
                  </span>
                )}
                <img
                  src="./platforms/grab.svg"
                  alt="Grab"
                  style={{ height: '23px', width: 'auto', maxWidth: '85%', objectFit: 'contain', display: 'block' }}
                />
              </button>

              {/* BOLT */}
              <button
                type="button"
                className={`platform-btn ${platform === 'Bolt' ? 'active bolt' : ''}`}
                onClick={() => setPlatform('Bolt')}
                style={{
                  height: '50px',
                  padding: '0 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  borderWidth: platform === 'Bolt' ? '1.5px' : '1px'
                }}
              >
                {platform === 'Bolt' && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '6px',
                    fontSize: '0.65rem',
                    color: '#34d186',
                    fontWeight: 900
                  }}>
                    ✓
                  </span>
                )}
                <img
                  src="./platforms/bolt.svg"
                  alt="Bolt"
                  style={{ height: '22px', width: 'auto', maxWidth: '85%', objectFit: 'contain', display: 'block' }}
                />
              </button>

              {/* LINE MAN */}
              <button
                type="button"
                className={`platform-btn ${platform === 'Line Man' ? 'active lineman' : ''}`}
                onClick={() => setPlatform('Line Man')}
                style={{
                  height: '50px',
                  padding: '0 6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  position: 'relative',
                  borderWidth: platform === 'Line Man' ? '1.5px' : '1px'
                }}
              >
                {platform === 'Line Man' && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '6px',
                    fontSize: '0.65rem',
                    color: '#22c55e',
                    fontWeight: 900
                  }}>
                    ✓
                  </span>
                )}
                <img
                  src="./platforms/line.svg"
                  alt="LINE MAN"
                  style={{ height: '20px', width: '20px', borderRadius: '4px', display: 'block', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, whiteSpace: 'nowrap' }}>LINE MAN</span>
              </button>
            </div>

            {/* inDrive & Other options */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['inDrive', 'Other'].map((p) => {
                const isSelected = platform === p
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    style={{
                      flex: 1,
                      background: isSelected ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${isSelected ? '#fff' : 'var(--border-subtle)'}`,
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {isSelected && <span style={{ color: 'var(--emerald-400)', fontWeight: 800 }}>✓</span>}
                    <PlatformBadge platform={p} size="sm" showText={true} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div className="form-group">
            <label className="form-label">วันที่</label>
            <input
              type="date"
              required
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* 2-column input grid for Mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {/* Gross Income */}
            <div className="form-group">
              <label className="form-label">
                <span>รายได้รวม (บาท)</span>
                <DollarSign size={14} style={{ color: 'var(--gold-500)' }} />
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                required
                placeholder="เช่น 550 หรือ 802.16"
                className="form-input"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
              />
            </div>

            {/* Distance */}
            <div className="form-group">
              <label className="form-label">
                <span>ระยะทาง (กม.)</span>
                <Navigation size={14} style={{ color: '#38bdf8' }} />
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                required
                placeholder="เช่น 35 หรือ 156.3"
                className="form-input"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
              />
            </div>
          </div>

          {/* Fuel Price, Efficiency & Depreciation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>
                <span>ราคาน้ำมัน (บ./ล.)</span>
                <Fuel size={13} style={{ color: 'var(--rose-500)' }} />
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                min="1"
                required
                placeholder="38.00"
                className="form-input"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>
                <span>กินน้ำมัน (กม./ล.)</span>
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                min="1"
                required
                placeholder="15.0"
                className="form-input"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem' }}>
                <span>ค่าเสื่อม (บ./กม.)</span>
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                placeholder="0.00"
                className="form-input"
                value={depreciationPerKm}
                onChange={(e) => setDepreciationPerKm(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">
              <span>บันทึกช่วยจำ (ถ้ามี)</span>
              <FileText size={14} />
            </label>
            <input
              type="text"
              placeholder="เช่น กะเช้า, วิ่งแถวสุขุมวิท, ฝนตก"
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Real-time Calculation Preview Card */}
          <div className="calc-preview-card">
            <div className="calc-preview-row">
              <span>ค่าน้ำมัน ({dist || 0} กม. ÷ {eff} กม./ล. × {price} บ.):</span>
              <span style={{ color: '#fda4af', fontWeight: 600 }}>
                -฿{fuelCost.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {depRate > 0 && (
              <div className="calc-preview-row">
                <span>ค่าเสื่อมรถ ({dist || 0} กม. × {depRate} บ./กม.):</span>
                <span style={{ color: '#fed7aa', fontWeight: 600 }}>
                  -฿{depCost.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="calc-preview-row final">
              <span>กำไรสุทธิรอบนี้ (หักน้ำมัน{depRate > 0 ? ' + ค่าเสื่อม' : ''}):</span>
              <span className="net-val">
                ฿{netIncome.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              ยกเลิก
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'กำลังบันทึก...' : (editRide ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
