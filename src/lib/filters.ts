import type { Place, PlaceCategory, UbDistrict, VibeTag } from '../data/places'
import { DEFAULT_FILTERS, type SortMode } from '../components/AdvancedFiltersPanel'

export type FilterState = {
  q: string
  cat: 'all' | PlaceCategory
  city?: 'Улаанбаатар'
  district?: UbDistrict
  vibes: VibeTag[]
  openNow: boolean
  minRating: number
  maxDistanceKm: number
  price1: boolean
  price2: boolean
  price3: boolean
  sort: SortMode
}

export const FILTER_KEYS = [
  'cat',
  'q',
  'city',
  'dist',
  'v',
  'open',
  'minR',
  'maxD',
  'sort',
  'p1',
  'p2',
  'p3',
] as const

export function parseFilterState(params: URLSearchParams): FilterState {
  const cat = (params.get('cat') ?? 'all') as 'all' | PlaceCategory
  const q = params.get('q') ?? ''
  const city = (params.get('city') ?? '') as 'Улаанбаатар' | ''
  const district = (params.get('dist') ?? '') as UbDistrict | ''
  const vibes = (params.get('v') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean) as VibeTag[]
  const openNow = params.get('open') === '1'
  const minRatingRaw = Number(params.get('minR') ?? DEFAULT_FILTERS.minRating)
  const maxDistanceRaw = Number(params.get('maxD') ?? DEFAULT_FILTERS.maxDistanceKm)
  const price1 = params.get('p1') !== '0'
  const price2 = params.get('p2') !== '0'
  const price3 = params.get('p3') !== '0'
  const sort = (params.get('sort') ?? DEFAULT_FILTERS.sort) as SortMode

  return {
    cat,
    q,
    city: city || undefined,
    district: district || undefined,
    vibes,
    openNow,
    minRating: Number.isFinite(minRatingRaw)
      ? Math.max(0, Math.min(5, minRatingRaw))
      : DEFAULT_FILTERS.minRating,
    maxDistanceKm: Number.isFinite(maxDistanceRaw)
      ? Math.max(1, Math.min(25, maxDistanceRaw))
      : DEFAULT_FILTERS.maxDistanceKm,
    price1,
    price2,
    price3,
    sort,
  }
}

export function writeAdvancedToParams(
  base: URLSearchParams,
  next: Omit<FilterState, 'q' | 'cat'>,
) {
  const p = new URLSearchParams(base)
  if (next.openNow) p.set('open', '1')
  else p.delete('open')

  if (next.minRating !== DEFAULT_FILTERS.minRating) p.set('minR', String(next.minRating))
  else p.delete('minR')

  if (next.maxDistanceKm !== DEFAULT_FILTERS.maxDistanceKm) p.set('maxD', String(next.maxDistanceKm))
  else p.delete('maxD')

  p.set('p1', next.price1 ? '1' : '0')
  p.set('p2', next.price2 ? '1' : '0')
  p.set('p3', next.price3 ? '1' : '0')

  if (next.sort !== DEFAULT_FILTERS.sort) p.set('sort', next.sort)
  else p.delete('sort')

  return p
}

export function clearAllFilters(params: URLSearchParams) {
  const p = new URLSearchParams(params)
  FILTER_KEYS.forEach((k) => p.delete(k))
  return p
}

export function applyFilters(places: Place[], f: FilterState) {
  return places
    .filter((p) => (f.city ? p.city === f.city : true))
    .filter((p) => (f.district ? p.district === f.district : true))
    .filter((p) =>
      f.vibes?.length ? f.vibes.every((v) => p.vibes.includes(v)) : true,
    )
    .filter((p) => (f.cat === 'all' ? true : p.category === f.cat))
    .filter((p) => (f.openNow ? p.openNow : true))
    .filter((p) => p.rating >= f.minRating)
    .filter((p) => p.distanceKm <= f.maxDistanceKm)
    .filter((p) => {
      const ok1 = f.price1 && p.priceLevel === 1
      const ok2 = f.price2 && p.priceLevel === 2
      const ok3 = f.price3 && p.priceLevel === 3
      return ok1 || ok2 || ok3
    })
    .filter((p) => {
      const hay = `${p.name} ${p.address} ${p.highlights.join(' ')} ${p.vibes.join(' ')}`.toLowerCase()
      return f.q.trim() ? hay.includes(f.q.trim().toLowerCase()) : true
    })
    .sort((a, b) => {
      if (f.sort === 'rating') return b.rating - a.rating
      return a.distanceKm - b.distanceKm
    })
}

