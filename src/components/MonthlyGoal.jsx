import React, { useEffect } from 'react'
import { Target, Award, CheckCircle2, TrendingUp } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function MonthlyGoal({ monthlyRides, monthlyGoal }) {
  const currentMonthName = new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })

  // Calculate monthly stats
  const totalMonthlyNet = monthlyRides.reduce((sum, r) => sum + Number(r.net_income || 0), 0)
  const totalMonthlyGross = monthlyRides.reduce((sum, r) => sum + Number(r.gross_income || 0), 0)
  const totalMonthlyFuel = monthlyRides.reduce((sum, r) => sum + Number(r.fuel_cost || 0), 0)
  const totalMonthlyDistance = monthlyRides.reduce((sum, r) => sum + Number(r.distance_km || 0), 0)

  const goal = Number(monthlyGoal) || 8000
  const progressPercent = Math.min(Math.round((totalMonthlyNet / goal) * 100), 100)
  const rawPercent = ((totalMonthlyNet / goal) * 100).toFixed(1)

  // Grab vs Bolt breakdowns
  const grabNet = monthlyRides.filter(r => r.platform === 'Grab').reduce((sum, r) => sum + Number(r.net_income || 0), 0)
  const boltNet = monthlyRides.filter(r => r.platform === 'Bolt').reduce((sum, r) => sum + Number(r.net_income || 0), 0)
  const otherNet = monthlyRides.filter(r => r.platform !== 'Grab' && r.platform !== 'Bolt').reduce((sum, r) => sum + Number(r.net_income || 0), 0)

  // Trigger confetti once if reached 100%
  useEffect(() => {
    if (totalMonthlyNet >= goal && goal > 0) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10b981', '#f59e0b', '#34d399', '#fbbf24'],
        })
      } catch (e) {
        // ignore
      }
    }
  }, [totalMonthlyNet, goal])

  return (
    <section className="glass-card">
      <div className="goal-header">
        <div className="goal-title">
          <Target size={18} style={{ color: 'var(--gold-500)' }} />
          <span>เป้าหมายรายได้สุทธิ ({currentMonthName})</span>
        </div>
        <div className="goal-status">
          {totalMonthlyNet >= goal ? (
            <span style={{ color: 'var(--emerald-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={16} /> ทะลุเป้าหมายแล้ว!
            </span>
          ) : (
            <span>เป้าหมาย ฿{goal.toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-track" style={{ marginBottom: '8px' }}>
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="goal-footer">
        <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
          ฿{totalMonthlyNet.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '6px' }}>
            ({rawPercent}%)
          </span>
        </span>
        <span>
          {totalMonthlyNet < goal ? (
            `ขาดอีก ฿${(goal - totalMonthlyNet).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          ) : (
            `เกินเป้า +฿${(totalMonthlyNet - goal).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          )}
        </span>
      </div>

      {/* Platform Comparison Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginTop: '16px',
        paddingTop: '14px',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div style={{ background: 'rgba(0, 177, 79, 0.08)', padding: '10px 6px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 177, 79, 0.2)' }}>
          <div style={{ fontSize: '0.72rem', color: '#38ef7d', fontWeight: 700 }}>GRAB สุทธิ</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
            ฿{grabNet.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div style={{ background: 'rgba(52, 209, 134, 0.08)', padding: '10px 6px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(52, 209, 134, 0.2)' }}>
          <div style={{ fontSize: '0.72rem', color: '#34d186', fontWeight: 700 }}>BOLT สุทธิ</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
            ฿{boltNet.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px 6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700 }}>อื่น ๆ / รวม</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
            ฿{otherNet.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>
    </section>
  )
}
