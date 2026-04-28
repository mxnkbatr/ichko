export type Review = {
  id: string
  placeId: string
  authorName: string
  authorAvatar: string
  rating: number
  text: string
  date: string
  helpful: number
  photos?: string[]
}

type ReviewInput = Omit<Review, 'id' | 'date' | 'helpful'>

const STORAGE_KEY = 'hool.reviews.v1'

const seedReviews: Review[] = [
  {
    id: 'rv-seed-1',
    placeId: 'saffron-sky',
    authorName: 'Anu',
    authorAvatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Anu',
    rating: 5,
    text: 'Интерьер маш цэвэрхэн, хоол халуун ирдэг. Оройн болзоонд яг тохирсон газар байна.',
    date: '2026-04-12T11:30:00.000Z',
    helpful: 18,
    photos: [
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=500&q=80',
    ],
  },
  {
    id: 'rv-seed-2',
    placeId: 'morning-bloom',
    authorName: 'Temuulen',
    authorAvatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Temuulen',
    rating: 5,
    text: 'Кофе амттай, зураг авахад гоё гэрэлтэй. Амралтын өдөр эрт очвол хүн багатай байдаг.',
    date: '2026-04-16T09:15:00.000Z',
    helpful: 9,
  },
  {
    id: 'rv-seed-3',
    placeId: 'amber-lantern',
    authorName: 'Saraa',
    authorAvatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Saraa',
    rating: 4,
    text: 'Craft beer-ийн сонголт сайн, хөгжим чанга талдаа. Найзуудтайгаа очиход илүү тохиромжтой.',
    date: '2026-04-18T14:00:00.000Z',
    helpful: 6,
  },
]

function safeParse(value: string | null): Review[] {
  if (!value) return [...seedReviews]
  try {
    const parsed = JSON.parse(value) as Review[]
    if (!Array.isArray(parsed)) return [...seedReviews]
    return parsed
  } catch {
    return [...seedReviews]
  }
}

function readAll() {
  if (typeof window === 'undefined') return [...seedReviews]
  return safeParse(window.localStorage.getItem(STORAGE_KEY))
}

function writeAll(reviews: Review[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
}

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `rv-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

export function getReviews(placeId: string): Review[] {
  return readAll()
    .filter((r) => r.placeId === placeId)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
}

export function addReview(review: ReviewInput): Review {
  const created: Review = {
    ...review,
    id: makeId(),
    date: new Date().toISOString(),
    helpful: 0,
  }
  const all = readAll()
  writeAll([created, ...all])
  return created
}

export function markHelpful(reviewId: string): void {
  const all = readAll()
  const next = all.map((r) =>
    r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r,
  )
  writeAll(next)
}
