import React, { useState } from 'react'
import { X, Download, FileSpreadsheet, Check, Copy, Share2, ExternalLink } from 'lucide-react'

export default function ExportModal({ isOpen, onClose, allRides }) {
  if (!isOpen) return null

  const [filterMode, setFilterMode] = useState('all') // 'all' | 'month'
  const [copied, setCopied] = useState(false)
  const isLineBrowser = typeof navigator !== 'undefined' && /Line\//i.test(navigator.userAgent)

  const generateCSVContent = () => {
    let exportData = [...allRides]

    if (filterMode === 'month') {
      const currentYearMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
      exportData = exportData.filter(r => r.log_date?.startsWith(currentYearMonth))
    }

    if (exportData.length === 0) {
      return null
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

    return csvRows.join('\n')
  }

  const handleExportCSV = async () => {
    const csvString = generateCSVContent()
    if (!csvString) {
      alert('ไม่มีข้อมูลสำหรับส่งออก')
      return
    }

    const filename = `net-ride-export-${filterMode}-${new Date().toISOString().split('T')[0]}.csv`
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' })

    // 1. Try Native Web Share API first (Native iOS / Android Share Sheet)
    if (typeof navigator !== 'undefined' && navigator.canShare) {
      try {
        const file = new File([blob], filename, { type: 'text/csv;charset=utf-8' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'ส่งออกข้อมูล NetRide',
            text: filename,
          })
          onClose()
          return
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          // User dismissed the share sheet
          return
        }
        console.warn('Web Share failed, attempting standard download fallback:', err)
      }
    }

    // 2. Standard <a> download for Desktop and browsers that support it
    try {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 1000)
    } catch (e) {
      console.error('Download link error:', e)
    }

    onClose()
  }

  const handleCopyCSV = async () => {
    const csvString = generateCSVContent()
    if (!csvString) {
      alert('ไม่มีข้อมูลสำหรับส่งออก')
      return
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(csvString)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = csvString
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      alert('ไม่สามารถคัดลอกได้ กรุณาลองใหม่อีกครั้ง')
    }
  }

  const handleOpenExternal = () => {
    const currentUrl = window.location.href.split('?')[0]
    window.open(`${currentUrl}?openExternalBrowser=1`, '_blank')
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
          ส่งออกประวัติการขับและรายได้เป็นไฟล์ Excel / CSV เพื่อจัดเก็บหรือคำนวณภาษี
        </p>

        {/* LINE Browser Notice */}
        {isLineBrowser && (
          <div style={{
            background: 'rgba(6, 199, 85, 0.12)',
            border: '1px solid rgba(6, 199, 85, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            marginBottom: '16px',
            fontSize: '0.78rem',
            color: '#86efac',
            lineHeight: 1.5
          }}>
            <strong>💡 คำแนะนำบน LINE:</strong> เบราว์เซอร์ LINE ไม่อนุญาตให้ดาวน์โหลดไฟล์ลงเครื่องโดยตรง แนะนำให้กด <strong>"คัดลอกข้อมูล"</strong> หรือกด <strong>"เปิดใน Safari / Chrome"</strong> ด้านล่างครับ
          </div>
        )}

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

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Main Download / Share Button */}
          <button
            type="button"
            className="btn-submit"
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '12px'
            }}
          >
            <Download size={16} />
            <span>ดาวน์โหลด / แชร์ไฟล์ CSV</span>
          </button>

          {/* Copy CSV to Clipboard Button */}
          <button
            type="button"
            onClick={handleCopyCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '11px',
              background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${copied ? 'var(--emerald-400)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              color: copied ? 'var(--emerald-400)' : '#fff',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? '✓ คัดลอกข้อมูล CSV สำเร็จแล้ว!' : 'คัดลอกข้อมูล CSV (นำไปวางใน Sheets / Excel)'}</span>
          </button>

          {/* Open in external browser for LINE LIFF */}
          {isLineBrowser && (
            <button
              type="button"
              onClick={handleOpenExternal}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <ExternalLink size={14} />
              <span>เปิดใน Safari / Chrome เพื่อดาวน์โหลดไฟล์</span>
            </button>
          )}

          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ width: '100%', padding: '10px', marginTop: '4px' }}
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  )
}
