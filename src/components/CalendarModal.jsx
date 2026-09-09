import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp } from 'lucide-react'
import { getTodayString } from '../lib/dateUtils'

export default function CalendarModal({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  allRides = [],
  deductDepreciation,
}) {
  if (!isOpen) return null

  // Current viewing year & month
  const [viewYear, setViewYear] = useState(() => {
    return parseInt(selectedDate.split('-')[0], 10) || new Date().getFullYear()
  })
  const [viewMonth, setViewMonth] = useState(() => {
    return parseInt(selectedDate.split('-')[1], 10) - 1 // 0-indexed
  })

  const todayStr = getTodayString()

  // Calculate days in month
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay() // 0 = Sun, 1 = Mon ...
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  // Pre-calculate daily totals for this month
  const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`
  const dailyTotals = {}

  allRides.forEach((ride) => {
    if (ride.log_date && ride.log_date.startsWith(monthPrefix)) {
      if (!dailyTotals[ride.log_date]) {
        dailyTotals[ride.log_date] = { net: 0, gross: 0, count: 0 }
      }
      dailyTotals[ride.log_date].net += Number(ride.net_income || 0)
      dailyTotals[ride.log_date].gross += Number(ride.gross_income || 0)
      dailyTotals[ride.log_date].count += 1
    }
  })

  // Thai month names
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ]
  const thaiYear = viewYear + 543

  const weekDayHeaders = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

  // Monthly aggregated totals
  const totalMonthNet = Object.values(dailyTotals).reduce((sum, d) => sum + d.net, 0)
  const daysDriven = Object.keys(dailyTotals).length

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '460px', padding: '20px' }}
      >
        <div className="mobile-sheet-handle" />
        {/* Header */}
        <div className="modal-header" style={{ marginBottom: '14px' }}>
          <div className="modal-title" style={{ flexWrap: 'wrap', gap: '6px' }}>
            <CalendarIcon size={20} style={{ color: 'var(--emerald-400)' }} />
            <span>ปฏิทินสรุปรายได้</span>
            <span style={{
              fontSize: '0.68rem',
              padding: '2px 7px',
              borderRadius: '999px',
              background: deductDepreciation ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: deductDepreciation ? 'var(--emerald-400)' : 'var(--gold-500)',
              border: `1px solid ${deductDepreciation ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
              fontWeight: 600
            }}>
              {deductDepreciation ? '🔧 หักค่าเสื่อม' : '💵 ไม่หักค่าเสื่อม'}
            </span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Month Navigator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          marginBottom: '14px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button className="date-btn" onClick={prevMonth} title="เดือนก่อนหน้า">
            <ChevronLeft size={20} />
          </button>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
            {thaiMonths[viewMonth]} {thaiYear}
          </div>
          <button className="date-btn" onClick={nextMonth} title="เดือนถัดไป">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Weekday headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '8px'
        }}>
          {weekDayHeaders.map((day, idx) => (
            <div key={day} style={{ color: idx === 0 ? 'var(--rose-500)' : undefined }}>
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '16px'
        }}>
          {/* Empty cells before 1st day */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} style={{ minHeight: '52px' }} />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
            const hasData = dailyTotals[dateStr]
            const isSelected = dateStr === selectedDate
            const isToday = dateStr === todayStr

            return (
              <button
                key={dateStr}
                onClick={() => {
                  onSelectDate(dateStr)
                  onClose()
                }}
                style={{
                  minHeight: '54px',
                  background: isSelected
                    ? 'rgba(16, 185, 129, 0.25)'
                    : hasData
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'transparent',
                  border: isSelected
                    ? '1.5px solid var(--emerald-400)'
                    : isToday
                    ? '1px solid var(--gold-500)'
                    : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 2px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: isSelected ? '#fff' : 'var(--text-primary)',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
                className="cal-day-cell"
              >
                {/* Day number */}
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: isSelected || isToday ? 800 : 500,
                  color: isToday ? 'var(--gold-500)' : undefined
                }}>
                  {dayNum}
                </span>

                {/* Net Income badge */}
                {hasData ? (
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: hasData.net >= 0 ? 'var(--emerald-400)' : 'var(--rose-500)',
                    background: 'rgba(0,0,0,0.4)',
                    padding: '1px 3px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    lineHeight: 1.1,
                  }}>
                    ฿{Math.round(hasData.net).toLocaleString()}
                  </span>
                ) : (
                  <span style={{ height: '12px' }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Footer Month Summary */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>วิ่งในเดือนนี้</div>
            <div style={{ fontWeight: 700, color: '#fff' }}>{daysDriven} วัน</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>กำไรสุทธิรวมทั้งเดือน</div>
            <div style={{ fontWeight: 800, color: 'var(--emerald-400)', fontSize: '1.05rem' }}>
              ฿{totalMonthNet.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
