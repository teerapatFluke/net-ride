import React, { useState, useEffect } from 'react'
import { X, PlusCircle, Check, Car, Fuel, Navigation, DollarSign, FileText } from 'lucide-react'

export default function AddRideModal({
  isOpen,
  onClose,
  onSave,
  defaultEfficiency = 15.0,
  defaultFuelPrice = 38.0,
  initialDate,
  editRide = null,
}) {
  if (!isOpen) return null

  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0])
  const [platform, setPlatform] = useState('Grab')
  const [grossIncome, setGrossIncome] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [fuelPrice, setFuelPrice] = useState(defaultFuelPrice.toString())
  const [fuelEfficiency, setFuelEfficiency] = useState(defaultEfficiency.toString())
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
      setNotes(editRide.notes || '')
    } else {
      setDate(initialDate || new Date().toISOString().split('T')[0])
      setPlatform('Grab')
      setGrossIncome('')
      setDistanceKm('')
      setFuelPrice(defaultFuelPrice.toString())
      setFuelEfficiency(defaultEfficiency.toString())
      setNotes('')
    }
  }, [editRide, isOpen, initialDate, defaultEfficiency, defaultFuelPrice])

  // Real-time calculation
  const gross = parseFloat(grossIncome) || 0
  const dist = parseFloat(distanceKm) || 0
  const price = parseFloat(fuelPrice) || 0
  const eff = parseFloat(fuelEfficiency) || 15.0

  const fuelCost = eff > 0 ? (dist / eff) * price : 0
  const netIncome = gross - fuelCost

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
        platform,
        gross_income: gross,
        distance_km: dist,
        fuel_price: price,
        fuel_efficiency: eff,
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
          {/* Platform Selector Buttons */}
          <div className="form-group">
            <label className="form-label">
              <span>แพลตฟอร์ม</span>
              <Car size={14} />
            </label>
            <div className="platform-selector">
              <button
                type="button"
                className={`platform-btn ${platform === 'Grab' ? 'active grab' : ''}`}
                onClick={() => setPlatform('Grab')}
              >
                <span style={{ fontWeight: 800 }}>GRAB</span>
              </button>
              <button
                type="button"
                className={`platform-btn ${platform === 'Bolt' ? 'active bolt' : ''}`}
                onClick={() => setPlatform('Bolt')}
              >
                <span style={{ fontWeight: 800 }}>BOLT</span>
              </button>
            </div>
            {/* Other platform selector option */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Line Man', 'inDrive', 'Other'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  style={{
                    flex: 1,
                    background: platform === p ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${platform === p ? '#fff' : 'var(--border-subtle)'}`,
                    color: platform === p ? '#fff' : 'var(--text-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {p}
                </button>
              ))}
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
                step="0.5"
                min="0"
                required
                placeholder="เช่น 550"
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
                step="0.1"
                min="0"
                required
                placeholder="เช่น 35"
                className="form-input"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
              />
            </div>
          </div>

          {/* Fuel Price & Efficiency */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">
                <span>ราคาน้ำมัน (บาท/ลิตร)</span>
                <Fuel size={14} style={{ color: 'var(--rose-500)' }} />
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="38.00"
                className="form-input"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>อัตรากินน้ำมัน (กม./ลิตร)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                required
                placeholder="15.0"
                className="form-input"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(e.target.value)}
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
              <span>สูตรคำนวณค่าน้ำมัน:</span>
              <span>({dist || 0} กม. ÷ {eff} กม./ลิตร) × {price} บ.</span>
            </div>
            <div className="calc-preview-row">
              <span>ค่าน้ำมันรอบนี้:</span>
              <span style={{ color: '#fda4af', fontWeight: 600 }}>
                -฿{fuelCost.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="calc-preview-row final">
              <span>กำไรสุทธิรอบนี้ (Net Profit):</span>
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
