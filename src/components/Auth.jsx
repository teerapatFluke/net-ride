import React, { useState } from 'react'
import { supabase, OWNER_EMAIL } from '../lib/supabase'
import { Lock, Mail, KeyRound, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Auth({ onAuthSuccess }) {
  const [email, setEmail] = useState(OWNER_EMAIL)
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('password') // 'password' | 'magic'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (mode === 'password') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (authError) throw authError
        if (data?.session) {
          try {
            localStorage.setItem('netride_custom_session', JSON.stringify(data.session))
            localStorage.setItem('netride_saved_creds', JSON.stringify({ email: email.trim(), password }))
          } catch (e) {
            console.warn('LocalStorage save failed', e)
          }
        }
        if (onAuthSuccess) onAuthSuccess(data.session)
      } else {
        // Magic link
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: window.location.origin + window.location.pathname,
          },
        })
        if (otpError) throw otpError
        try {
          localStorage.setItem('netride_saved_email', email.trim())
        } catch (e) {}
        setMessage('ส่งลิงก์เข้าสู่ระบบไปที่อีเมลของคุณแล้ว! กรุณาเช็คกล่องข้อความหรือสแปม')
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <img src="./logo.jpeg" alt="Net Ride Logo" className="auth-logo" />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '4px' }}>NET RIDE</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Ride-Hailing Income & Cost Calculator
        </p>

        <div className="auth-badge">
          <ShieldCheck size={14} />
          <span>ระบบส่วนตัว (Private Access Only)</span>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fda4af',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'left'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#6ee7b7',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'left'
          }}>
            <Sparkles size={16} style={{ flexShrink: 0 }} />
            <span>{message}</span>
          </div>
        )}

        {/* Tab switch between Password & Magic Link */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          marginBottom: '20px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => setMode('password')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              background: mode === 'password' ? 'var(--emerald-500)' : 'transparent',
              color: mode === 'password' ? '#fff' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            รหัสผ่าน (Password)
          </button>
          <button
            type="button"
            onClick={() => setMode('magic')}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              background: mode === 'magic' ? 'var(--emerald-500)' : 'transparent',
              color: mode === 'magic' ? '#fff' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Magic Link (ส่งเข้าเมล)
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">
              <span>อีเมลเจ้าของระบบ</span>
              <Mail size={14} />
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="teerapat.choet@gmail.com"
            />
          </div>

          {mode === 'password' && (
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">
                <span>รหัสผ่าน</span>
                <Lock size={14} />
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="กรอกรหัสผ่านของคุณ"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '14px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <span>กำลังตรวจสอบ...</span>
            ) : (
              <>
                <span>{mode === 'password' ? 'เข้าสู่ระบบ' : 'ส่ง Magic Link'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p style={{
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          marginTop: '20px'
        }}>
          ระบบนี้เปิดให้เข้าถึงเฉพาะคุณ teerapat.choet@gmail.com เท่านั้น ข้อมูลทั้งหมดถูกป้องกันด้วย Supabase RLS
        </p>
      </div>
    </div>
  )
}
