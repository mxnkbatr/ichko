export type BookingStatus = 'confirmed' | 'cancelled'

export type Booking = {
  id: string
  placeId: string
  placeName: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  people: number
  name: string
  phone: string
  note?: string
  status: BookingStatus
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'hool.bookings'

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function listBookings(): Booking[] {
  const parsed = safeParse<Booking[]>(localStorage.getItem(STORAGE_KEY))
  return Array.isArray(parsed) ? parsed : []
}

function writeBookings(next: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function createBooking(
  input: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
) {
  const now = Date.now()
  const booking: Booking = {
    ...input,
    id: crypto.randomUUID(),
    status: 'confirmed',
    createdAt: now,
    updatedAt: now,
  }

  const all = listBookings()
  writeBookings([booking, ...all])
  return booking
}

export function cancelBooking(id: string) {
  const all = listBookings()
  const next: Booking[] = all.map((b) =>
    b.id === id
      ? { ...b, status: 'cancelled' as BookingStatus, updatedAt: Date.now() }
      : b,
  )
  writeBookings(next)
}

export function rescheduleBooking(id: string, date: string, time: string) {
  const all = listBookings()
  const next = all.map((b) =>
    b.id === id ? { ...b, date, time, updatedAt: Date.now() } : b,
  )
  writeBookings(next)
}

export function hasConflict(placeId: string, date: string, time: string) {
  const all = listBookings()
  return all.some(
    (b) =>
      b.status === 'confirmed' &&
      b.placeId === placeId &&
      b.date === date &&
      b.time === time,
  )
}

