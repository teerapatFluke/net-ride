import React, { useState } from 'react'
import { X, Download, FileSpreadsheet, Check } from 'lucide-react'

export default function ExportModal({ isOpen, onClose, allRides }) {
  if (!isOpen) return null

  const [filterMode, setFilterMode] = useState('all') // 'all' | 'month'

  const handleExportCSV = () => {
    let exportData = [...allRides]

    if (filterMode === 'month') {
      const currentYearMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
      exportData = exportData.filter(r => r.log_date?.startsWith(currentYearMonth))
    }

    if (exportData.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก')
      return
    }

    // Sort by date ascending
    exportData.sort((a, b) => a.log_date.localeCompare(b.log_date))

    // Headers
    const headers = [
      'วันที่',
      'แพลตฟอร์ม',
      'รายได้รวม (บาท)',
      'ระยะทาง (กม.)',
      'ราคาน้ำมัน (บาท/ลิตร)',
      'อัตราสิ้นเปลือง (กม./ลิตร)',
      'ค่าน้ำมัน (บาท)',
      'ค่าเสื่อมต่อกม. (บาท/กม.)',
      'รวมค่าเสื่อม (บาท)',
      'กำไรสุทธิ (บาท)',
      'หมายเหตุ',
    ]

    const csvRows = [headers.join(',')]

    for (const r of exportData) {
      const depRate = Number(r.depreciation_per_km || 0)
      const depCost = Number((Number(r.distance_km || 0) * depRate).toFixed(2))
      const row = [
        `"${r.log_date}"`,
        `"${r.platform}"`,
        r.gross_income,
        r.distance_km,
        r.fuel_price,
        r.fuel_efficiency,
        r.fuel_cost,
        depRate,
        depCost,
        r.net_income,
        `"${(r.notes || '').replace(/"/g, '""')}"`,
      ]
      csvRows.push(row.join(','))
    }

    // Add UTF-8 BOM for Excel Thai language support
    const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `net-ride-export-${filterMode}-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-sheet-handle" />
        <div className="modal-header">
          <div className="modal-title">
            <FileSpreadsheet size={22} style={{ color: 'var(--emerald-400)' }} />
            <span>ส่งออกข้อมูล (Export CSV)</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          ดาวน์โหลดประวัติการขับและรายได้เป็นไฟล์ Excel / CSV เพื่อจัดเก็บหรือคำนวณภาษี
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-input)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${filterMode === 'all' ? 'var(--emerald-500)' : 'var(--border-subtle)'}`,
            cursor: 'pointer'
          }}>
            <input
              type="radio"
              name="exportFilter"
              checked={filterMode === 'all'}
              onChange={() => setFilterMode('all')}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#fff' }}>ส่งออกข้อมูลทั้งหมด</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ทั้งหมด {allRides.length} รายการ</div>
            </div>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-input)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${filterMode === 'month' ? 'var(--emerald-500)' : 'var(--border-subtle)'}`,
            cursor: 'pointer'
          }}>
            <input
              type="radio"
              name="exportFilter"
              checked={filterMode === 'month'}
              onChange={() => setFilterMode('month')}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#fff' }}>เฉพาะเดือนปัจจุบัน</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            ยกเลิก
          </button>
          <button
            type="button"
            className="btn-submit"
            onClick={handleExportCSV}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Download size={16} />
            <span>ดาวน์โหลด CSV</span>
          </button>
        </div>
      </div>
    </div>
  )
}
