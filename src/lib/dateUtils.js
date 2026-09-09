// Helper utilities for local date manipulation avoiding UTC timezone shifts

export const getTodayString = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const shiftDateString = (dateString, offsetDays) => {
  if (!dateString) return getTodayString()
  const [year, month, day] = dateString.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  d.setDate(d.getDate() + offsetDays)
  
  const nextYear = d.getFullYear()
  const nextMonth = String(d.getMonth() + 1).padStart(2, '0')
  const nextDay = String(d.getDate()).padStart(2, '0')
  return `${nextYear}-${nextMonth}-${nextDay}`
}

export const formatThaiDate = (dateString) => {
  if (!dateString) return ''
  try {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('th-TH', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}
