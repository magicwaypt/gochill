const LISBON_TIME_ZONE = 'Europe/Lisbon'

export const formatLisbonDate = (value: Date | string | number) => {
  const date = new Date(value)
  return new Intl.DateTimeFormat('pt-PT', {
    timeZone: LISBON_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export const formatLisbonDateTime = (value: Date | string | number) => {
  const date = new Date(value)
  return new Intl.DateTimeFormat('pt-PT', {
    timeZone: LISBON_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export const getLisbonDateKey = (value: Date | string | number) => {
  const date = new Date(value)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: LISBON_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const year = parts.find((p) => p.type === 'year')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  const day = parts.find((p) => p.type === 'day')?.value

  if (!year || !month || !day) return ''
  return `${year}-${month}-${day}`
}

export const getLisbonHour = (value: Date | string | number) => {
  const date = new Date(value)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: LISBON_TIME_ZONE,
    hour: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const hour = parts.find((p) => p.type === 'hour')?.value
  return hour ? Number.parseInt(hour, 10) : Number.NaN
}

