import React from 'react'
import { Edit2, Trash2, Car, Navigation, Fuel, DollarSign, Clock } from 'lucide-react'
import PlatformBadge from './PlatformBadge'

export default function RideList({ rides, onEdit, onDelete, deductDepreciation }) {
  if (rides.length === 0) {
    return (
      <section className="glass-card" style={{ textAlign: 'center', padding: '36px 16px' }}>
        <Car size={44} style={{ color: 'var(--text-muted)', margin: '0 auto 12px auto', opacity: 0.5 }} />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          ยังไม่มีรายการวิ่งในวันนี้
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          กดปุ่ม <b>"บันทึกรอบใหม่"</b> ด้านล่าง เพื่อเริ่มคำนวณค่าน้ำมันและกำไรสุทธิ
        </p>
      </section>
    )
  }

  return (
    <section className="glass-card">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>ประวัติรอบการขับวันนี้</span>
          <span style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            color: 'var(--text-secondary)'
          }}>
            {rides.length} รอบ
          </span>
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rides.map((ride, index) => (
          <div key={ride.id || index} className="ride-item">
            <div className="ride-item-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlatformBadge platform={ride.platform} size="sm" />
                {ride.notes && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    "{ride.notes}"
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  className="btn-icon"
                  style={{ width: '32px', height: '32px' }}
                  title="แก้ไขรายการ"
                  onClick={() => onEdit(ride)}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  className="btn-icon"
                  style={{ width: '32px', height: '32px', color: 'var(--rose-500)' }}
                  title="ลบรายการ"
                  onClick={() => {
                    if (window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
                      onDelete(ride.id)
                    }
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="ride-item-body">
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>รายได้รวม</div>
                <div style={{ fontWeight: 700, color: 'var(--gold-500)', fontSize: '0.9rem' }}>
                  ฿{Number(ride.gross_income).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ระยะทาง / สิ้นเปลือง</div>
                <div style={{ fontWeight: 600, color: '#38bdf8', fontSize: '0.9rem' }}>
                  {ride.distance_km} กม. <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>({ride.fuel_efficiency} กม./ล.)</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ค่าน้ำมัน (@{ride.fuel_price}บ.)</div>
                <div style={{ fontWeight: 600, color: '#fda4af', fontSize: '0.9rem' }}>
                  -฿{Number(ride.fuel_cost).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {Number(ride.depreciation_per_km) > 0 && (
                <div style={{ opacity: deductDepreciation ? 1 : 0.65 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    ค่าเสื่อม {deductDepreciation ? '(-หักแล้ว)' : '(ไม่หัก)'}
                  </div>
                  <div style={{ fontWeight: 600, color: '#fed7aa', fontSize: '0.9rem' }}>
                    {deductDepreciation ? '-' : ''}฿{(Number(ride.depreciation_per_km) * Number(ride.distance_km)).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              )}
            </div>

            <div className="ride-item-footer">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {deductDepreciation
                  ? `กำไรสุทธิรอบนี้${Number(ride.depreciation_per_km) > 0 ? ' (หักเสื่อมแล้ว)' : ''}:`
                  : 'กำไรเงินสดรอบนี้ (หักแค่น้ำมัน):'}
              </span>
              <span className={`ride-net-badge ${!deductDepreciation ? 'cash-mode' : ''}`}>
                ฿{Number(ride.net_income).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
