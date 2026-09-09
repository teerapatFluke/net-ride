import React, { useState, useEffect, useMemo } from 'react'
import { supabase, isOwner, OWNER_EMAIL, OWNER_UID } from './lib/supabase'
import Navbar from './components/Navbar'
import DailySummary from './components/DailySummary'
import MonthlyGoal from './components/MonthlyGoal'
import RideList from './components/RideList'
import AddRideModal from './components/AddRideModal'
import SettingsModal from './components/SettingsModal'
import ExportModal from './components/ExportModal'
import CalendarModal from './components/CalendarModal'
import Auth from './components/Auth'
import { Plus, ShieldAlert } from 'lucide-react'
import { getTodayString } from './lib/dateUtils'

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem('netride_custom_session')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem('netride_custom_session')
    } catch {
      return true
    }
  })
  const [selectedDate, setSelectedDate] = useState(() => getTodayString())
  const [rides, setRides] = useState([])
  const [deductDepreciation, setDeductDepreciation] = useState(() => {
    const saved = localStorage.getItem('netride_deduct_depreciation')
    return saved !== null ? saved === 'true' : true
  })
  const [settings, setSettings] = useState({
    fuel_efficiency: 15.0,
    last_fuel_price: 38.0,
    depreciation_per_km: 0.0,
    monthly_goal: 8000.0,
  })

  const handleToggleDepreciation = (val) => {
    setDeductDepreciation(val)
    localStorage.setItem('netride_deduct_depreciation', val ? 'true' : 'false')
  }

  // Compute display rides with reactive net_income based on toggle (MUST BE AT TOP LEVEL BEFORE RETURNS)
  const displayRides = useMemo(() => {
    return rides.map((r) => ({
      ...r,
      net_income: deductDepreciation ? r.net_income_with_dep : r.net_income_without_dep,
    }))
  }, [rides, deductDepreciation])

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [editingRide, setEditingRide] = useState(null)

  // 1. Check & restore Auth state from LocalStorage & Supabase
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data: { session: activeSession } } = await supabase.auth.getSession()

        if (activeSession) {
          setSession(activeSession)
          localStorage.setItem('netride_custom_session', JSON.stringify(activeSession))
        } else {
          // Check cached session with refresh token
          const cached = localStorage.getItem('netride_custom_session')
          if (cached) {
            try {
              const parsed = JSON.parse(cached)
              if (parsed?.refresh_token) {
                const { data: refreshed } = await supabase.auth.setSession({
                  access_token: parsed.access_token,
                  refresh_token: parsed.refresh_token,
                })
                if (refreshed?.session) {
                  setSession(refreshed.session)
                  localStorage.setItem('netride_custom_session', JSON.stringify(refreshed.session))
                }
              }
            } catch (e) {
              console.warn('Refresh session error:', e)
            }
          }

          // Fallback auto-relogin with saved credentials
          const savedCreds = localStorage.getItem('netride_saved_creds')
          if (savedCreds) {
            try {
              const { email, password } = JSON.parse(savedCreds)
              if (email && password) {
                const { data: loginData } = await supabase.auth.signInWithPassword({ email, password })
                if (loginData?.session) {
                  setSession(loginData.session)
                  localStorage.setItem('netride_custom_session', JSON.stringify(loginData.session))
                }
              }
            } catch (e) {
              console.warn('Auto-login fallback error:', e)
            }
          }
        }
      } catch (err) {
        console.error('Session restore error:', err)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession) {
        setSession(newSession)
        localStorage.setItem('netride_custom_session', JSON.stringify(newSession))
      } else if (_event === 'SIGNED_OUT') {
        setSession(null)
        localStorage.removeItem('netride_custom_session')
        localStorage.removeItem('netride_saved_creds')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. Fetch driver settings
  const fetchSettings = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('driver_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setSettings(data)
      } else {
        // Upsert default settings
        const defaultSet = {
          user_id: userId,
          fuel_efficiency: 15.0,
          last_fuel_price: 38.0,
          depreciation_per_km: 0.0,
          monthly_goal: 8000.0,
        }
        await supabase.from('driver_settings').insert([defaultSet])
        setSettings(defaultSet)
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    }
  }

  // 3. Fetch ride logs
  const fetchRides = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('ride_logs')
        .select('*')
        .eq('user_id', userId)
        .order('log_date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error

      // Calculate/normalize depreciation and net_income so calculations are 100% accurate
      const processedRides = (data || []).map((r) => {
        const dist = Number(r.distance_km || 0)
        const depRate = Number(r.depreciation_per_km || 0)
        const depCost = Number((dist * depRate).toFixed(2))
        const eff = Number(r.fuel_efficiency) || 15
        const price = Number(r.fuel_price) || 0
        const fuelCost = r.fuel_cost != null ? Number(r.fuel_cost) : Number(((dist / eff) * price).toFixed(2))
        const gross = Number(r.gross_income || 0)
        const netWithDep = Number((gross - fuelCost - depCost).toFixed(2))
        const netWithoutDep = Number((gross - fuelCost).toFixed(2))

        return {
          ...r,
          depreciation_per_km: depRate,
          depreciation_cost: depCost,
          fuel_cost: fuelCost,
          net_income_with_dep: netWithDep,
          net_income_without_dep: netWithoutDep,
          net_income: netWithDep,
        }
      })

      setRides(processedRides)
    } catch (err) {
      console.error('Error fetching ride logs:', err)
    }
  }

  // Fetch data on session change
  useEffect(() => {
    if (session?.user?.id) {
      fetchSettings(session.user.id)
      fetchRides(session.user.id)
    }
  }, [session])

  // Save or update ride log
  const handleSaveRide = async (rideData) => {
    const userId = session?.user?.id
    if (!userId) return

    const payload = {
      user_id: userId,
      log_date: rideData.log_date,
      platform: rideData.platform,
      gross_income: rideData.gross_income,
      distance_km: rideData.distance_km,
      fuel_price: rideData.fuel_price,
      fuel_efficiency: rideData.fuel_efficiency,
      depreciation_per_km: rideData.depreciation_per_km || 0,
      notes: rideData.notes,
    }

    if (rideData.id) {
      // Update
      const { error } = await supabase
        .from('ride_logs')
        .update(payload)
        .eq('id', rideData.id)
      if (error) throw error
    } else {
      // Insert
      const { error } = await supabase
        .from('ride_logs')
        .insert([payload])
      if (error) throw error
    }

    // Update last fuel price in settings
    await supabase
      .from('driver_settings')
      .update({
        last_fuel_price: rideData.fuel_price,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    setSettings((prev) => ({ ...prev, last_fuel_price: rideData.fuel_price }))

    // Refresh list
    await fetchRides(userId)
    setEditingRide(null)
  }

  // Delete ride log
  const handleDeleteRide = async (id) => {
    try {
      const { error } = await supabase
        .from('ride_logs')
        .delete()
        .eq('id', id)

      if (error) throw error
      setRides((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      alert('ไม่สามารถลบรายการได้: ' + err.message)
    }
  }

  // Save Settings
  const handleSaveSettings = async (newSettings) => {
    const userId = session?.user?.id
    if (!userId) return

    const { error } = await supabase
      .from('driver_settings')
      .upsert({
        user_id: userId,
        fuel_efficiency: newSettings.fuel_efficiency,
        last_fuel_price: newSettings.last_fuel_price,
        depreciation_per_km: newSettings.depreciation_per_km || 0,
        monthly_goal: newSettings.monthly_goal,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  // Sign out
  const handleSignOut = async () => {
    if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      try {
        localStorage.removeItem('netride_custom_session')
        localStorage.removeItem('netride_saved_creds')
      } catch (e) {}
      await supabase.auth.signOut()
      setSession(null)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <img src="./logo.jpeg" alt="Logo" style={{ width: '64px', borderRadius: '16px', marginBottom: '12px' }} />
          <div>กำลังโหลด Net Ride...</div>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!session) {
    return <Auth onAuthSuccess={(s) => setSession(s)} />
  }

  // Security guard: Only the target user has access
  if (!isOwner(session.user)) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <ShieldAlert size={56} style={{ color: 'var(--rose-500)', margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>สิทธิ์การเข้าถึงถูกจำกัด</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            แอปพลิเคชันนี้สงวนสิทธิ์เฉพาะบัญชีส่วนตัว <b>{OWNER_EMAIL}</b> เท่านั้น
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="btn-submit"
            style={{ width: '100%', background: 'var(--rose-500)' }}
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    )
  }

  // Filter rides for selected day
  const ridesForDay = displayRides.filter((r) => r.log_date === selectedDate)

  // Filter rides for current month
  const currentMonthPrefix = selectedDate.slice(0, 7) // YYYY-MM
  const ridesForMonth = displayRides.filter((r) => r.log_date?.startsWith(currentMonthPrefix))

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        user={session.user}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Daily Summary & Date Navigator */}
      <DailySummary
        selectedDate={selectedDate}
        onDateChange={(newDate) => setSelectedDate(newDate)}
        ridesForDay={ridesForDay}
        onOpenCalendar={() => setIsCalendarOpen(true)}
        deductDepreciation={deductDepreciation}
        onToggleDepreciation={handleToggleDepreciation}
      />

      {/* Monthly Goal Tracker */}
      <MonthlyGoal
        monthlyRides={ridesForMonth}
        monthlyGoal={settings.monthly_goal}
        deductDepreciation={deductDepreciation}
      />

      {/* List of rides today */}
      <RideList
        rides={ridesForDay}
        onEdit={(ride) => {
          setEditingRide(ride)
          setIsAddModalOpen(true)
        }}
        onDelete={handleDeleteRide}
        deductDepreciation={deductDepreciation}
      />

      {/* Bottom Floating Action Button */}
      <div className="bottom-bar">
        <button
          className="btn-primary-action"
          onClick={() => {
            setEditingRide(null)
            setIsAddModalOpen(true)
          }}
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>บันทึกรอบใหม่</span>
        </button>
      </div>

      {/* Add / Edit Ride Modal */}
      <AddRideModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingRide(null)
        }}
        onSave={handleSaveRide}
        defaultEfficiency={settings.fuel_efficiency}
        defaultFuelPrice={settings.last_fuel_price}
        defaultDepreciation={settings.depreciation_per_km || 0}
        initialDate={selectedDate}
        editRide={editingRide}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        user={session.user}
        deductDepreciation={deductDepreciation}
        onToggleDepreciation={handleToggleDepreciation}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        allRides={displayRides}
        deductDepreciation={deductDepreciation}
      />

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={(d) => setSelectedDate(d)}
        allRides={displayRides}
        deductDepreciation={deductDepreciation}
      />
    </div>
  )
}
