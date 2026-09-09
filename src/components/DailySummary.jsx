import React from 'react'
import { ChevronLeft, ChevronRight, Calendar, DollarSign, Fuel, Navigation, TrendingUp } from 'lucide-react'
import { formatThaiDate, shiftDateString, getTodayString } from '../lib/dateUtils'

export default function DailySummary({
  selectedDate,
  onDateChange,
  ridesForDay,
  onOpenCalendar,
  deductDepreciation,
  onToggleDepreciation,
}) {
  const isToday = () => {
    return selectedDate === getTodayString()
  }

  const changeDay = (offset) => {
    onDateChange(shiftDateString(selectedDate, offset))
  }

  // Aggregate sums
  const totalGross = ridesForDay.reduce((sum, r) => sum + Number(r.gross_income || 0), 0)
  const totalDistance = ridesForDay.reduce((sum, r) => sum + Number(r.distance_km || 0), 0)
  const totalFuelCost = ridesForDay.reduce((sum, r) => sum + Number(r.fuel_cost || 0), 0)
  const totalDepCost = ridesForDay.reduce((sum, r) => sum + (Number(r.depreciation_per_km || 0) * Number(r.distance_km || 0)), 0)
  const totalNet = ridesForDay.reduce((sum, r) => sum + Number(r.net_income || 0), 0)

  // Cost per km
  const costPerKm = totalDistance > 0 ? (totalFuelCost / totalDistance).toFixed(2) : '0.00'

  return (
    <section className="glass-card">
      {/* Date Navigation Bar */}
      <div className="date-bar">
        <button
          className="date-btn"
          onClick={() => changeDay(-1)}
          title="วันก่อนหน้า"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          className="date-display"
          onClick={onOpenCalendar}
          style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px' }}
          title="แตะเพื่อเปิดปฏิทินสรุปรายรับ"
        >
          <Calendar size={16} style={{ color: 'var(--emerald-400)' }} />
          <span style={{ textDecoration: 'underline dotted', textUnderlineOffset: '4px' }}>
            {formatThaiDate(selectedDate)}
          </span>
          {isToday() ? (
            <span className="today-badge">วันนี้</span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDateChange(getTodayString())
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--emerald-400)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              กลับสู่วันนี้
            </button>
          )}
        </div>

        <button
          className="date-btn"
          onClick={() => changeDay(1)}
          title="วันถัดไป"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Mode Switcher: Real Net vs Cash */}
      <div className="depreciation-toggle-container">
        <div className="segmented-control">
          <button
            type="button"
            className={`segmented-btn ${deductDepreciation ? 'active' : ''}`}
            onClick={() => onToggleDepreciation?.(true)}
            title="หักค่าน้ำมันและค่าเสื่อม/สึกหรอรถตามระยะทาง"
          >
            <span>🔧 หักค่าเสื่อมรถ</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${!deductDepreciation ? 'active cash' : ''}`}
            onClick={() => onToggleDepreciation?.(false)}
            title="คิดเฉพาะค่าน้ำมัน ไม่หักค่าเสื่อมรถ"
          >
            <span>💵 ไม่หักค่าเสื่อม</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {/* Net Income */}
        <div className={`metric-box highlight-net ${!deductDepreciation ? 'highlight-cash' : ''}`}>
          <div className="metric-label">
            <TrendingUp size={14} style={{ color: deductDepreciation ? 'var(--emerald-400)' : 'var(--gold-500)' }} />
            <span>{deductDepreciation ? 'กำไรสุทธิ (หักเสื่อมแล้ว)' : 'กำไรเงินสด (หักแค่น้ำมัน)'}</span>
          </div>
          <div className="metric-value" style={{ color: deductDepreciation ? 'var(--emerald-400)' : 'var(--gold-500)' }}>
            <span>฿{totalNet.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {totalGross > 0 ? (
              deductDepreciation ? (
                `เหลือ ${((totalNet / totalGross) * 100).toFixed(0)}% (หักน้ำมัน + ค่าเสื่อม ฿${totalDepCost.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })})`
              ) : (
                `เหลือ ${((totalNet / totalGross) * 100).toFixed(0)}% ${totalDepCost > 0 ? `(มีค่าเสื่อม ฿${totalDepCost.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ยังไม่หัก)` : ''}`
              )
            ) : (
              'ยังไม่มีรายการ'
            )}
          </div>
        </div>

        {/* Gross Income */}
        <div className="metric-box highlight-gross">
          <div className="metric-label">
            <DollarSign size={14} style={{ color: 'var(--gold-500)' }} />
            <span>รายได้รวม (Gross)</span>
          </div>
          <div className="metric-value">
            <span>฿{totalGross.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {ridesForDay.length} รอบ/กะ
          </div>
        </div>

        {/* Fuel Cost */}
        <div className="metric-box">
          <div className="metric-label">
            <Fuel size={14} style={{ color: 'var(--rose-500)' }} />
            <span>ค่าน้ำมันรวม (Fuel)</span>
          </div>
          <div className="metric-value" style={{ color: '#fda4af' }}>
            <span>฿{totalFuelCost.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            เฉลี่ย ฿{costPerKm}/กม.
            {totalDepCost > 0 && ` • สึกหรอ ฿${totalDepCost.toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          </div>
        </div>

        {/* Total Distance */}
        <div className="metric-box">
          <div className="metric-label">
            <Navigation size={14} style={{ color: '#38bdf8' }} />
            <span>ระยะทางรวม</span>
          </div>
          <div className="metric-value">
            <span>{totalDistance.toLocaleString('th-TH', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
            <span className="metric-unit">กม.</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            ระยะทางที่วิ่งทั้งหมด
          </div>
        </div>
      </div>
    </section>
  )
}
