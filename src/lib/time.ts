export function pad2(n: number) {
  return n.toString().padStart(2, '0')
}

export function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function fromMinutes(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${pad2(h)}:${pad2(m)}`
}

export function generateSlots({
  start,
  end,
  stepMin = 30,
}: {
  start: string
  end: string
  stepMin?: number
}) {
  const s = toMinutes(start)
  let e = toMinutes(end)
  if (e <= s) e += 24 * 60 // crosses midnight

  const slots: string[] = []
  for (let t = s; t <= e; t += stepMin) {
    slots.push(fromMinutes(t % (24 * 60)))
  }
  return slots
}

