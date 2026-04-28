export type PlaceCategory = 'restaurant' | 'pub' | 'cafe'

export type UbDistrict = 'СБД' | 'БГД' | 'СХД'

export type VibeTag =
  | 'chill'
  | 'party'
  | 'romantic'
  | 'family'
  | 'work'
  | 'music'
  | 'craft'

export type MenuItem = {
  id: string
  name: string
  description: string
  priceMnt: number
  tags?: string[]
}

export type Place = {
  id: string
  name: string
  category: PlaceCategory
  city: 'Улаанбаатар'
  district: UbDistrict
  vibes: VibeTag[]
  rating: number
  reviewCount: number
  priceLevel: 1 | 2 | 3
  distanceKm: number
  address: string
  openNow: boolean
  closesAt: string
  phone?: string
  photos: { url: string; alt: string }[]
  coords: { lat: number; lng: number }
  highlights: string[]
  menu: MenuItem[]
}

export const places: Place[] = [
  // ── RESTAURANTS ──────────────────────────────────────────────────────────
  {
    id: 'saffron-sky',
    name: 'Saffron Sky',
    category: 'restaurant',
    city: 'Улаанбаатар',
    district: 'СБД',
    vibes: ['romantic', 'family', 'chill'],
    rating: 4.7,
    reviewCount: 1284,
    priceLevel: 2,
    distanceKm: 1.2,
    address: 'СБД, 1-р хороо, Peace Ave 12',
    openNow: true,
    closesAt: '23:00',
    phone: '+976 7000 1234',
    coords: { lat: 47.9187, lng: 106.9179 },
    highlights: ['Үндэсний + fusion', 'Сайхан интерьер', 'Гэр бүлд ээлтэй'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80', alt: 'Restaurant interior' },
      { url: 'https://images.unsplash.com/photo-1541544181051-e46601b6e0d0?auto=format&fit=crop&w=800&q=80', alt: 'Plated food' },
    ],
    menu: [
      { id: 'm1', name: 'Бууз (8ш)', description: 'Шүүслэг мах, нимгэн гурил, халуун жигнэлт.', priceMnt: 16000, tags: ['Traditional', 'Top'] },
      { id: 'm2', name: 'Цуйван', description: 'Гар татсан гурил, ногоо, мах.', priceMnt: 18000, tags: ['Traditional'] },
      { id: 'm3', name: 'Seabuckthorn spritz', description: 'Чацаргана, сод, цитрус.', priceMnt: 9000, tags: ['Drink'] },
    ],
  },
  {
    id: 'nomad-table',
    name: 'Nomad Table',
    category: 'restaurant',
    city: 'Улаанбаатар',
    district: 'БГД',
    vibes: ['family', 'chill'],
    rating: 4.3,
    reviewCount: 876,
    priceLevel: 1,
    distanceKm: 2.1,
    address: 'БГД, 7-р хороо, Чингис Ave 45',
    openNow: true,
    closesAt: '22:00',
    phone: '+976 7711 2233',
    coords: { lat: 47.9125, lng: 106.8950 },
    highlights: ['Өрхийн найрамдал', 'Уламжлалт хоол', 'Хямд үнэ'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80', alt: 'Family restaurant' },
      { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', alt: 'Food spread' },
    ],
    menu: [
      { id: 'n1', name: 'Хуушуур (6ш)', description: 'Шарсан мах, зөөлөн гурил.', priceMnt: 12000, tags: ['Traditional', 'Top'] },
      { id: 'n2', name: 'Шөл', description: 'Мах, гурил, ногоотой гэрийн шөл.', priceMnt: 8000, tags: ['Traditional'] },
      { id: 'n3', name: 'Цай', description: 'Сүүтэй монгол цай.', priceMnt: 2000, tags: ['Drink'] },
    ],
  },
  {
    id: 'silk-road-kitchen',
    name: 'Silk Road Kitchen',
    category: 'restaurant',
    city: 'Улаанбаатар',
    district: 'СХД',
    vibes: ['romantic', 'chill'],
    rating: 4.8,
    reviewCount: 2100,
    priceLevel: 3,
    distanceKm: 3.5,
    address: 'СХД, 15-р хороо, Ikh Toiruu 88',
    openNow: false,
    closesAt: '22:30',
    phone: '+976 7888 4455',
    coords: { lat: 47.9310, lng: 106.9220 },
    highlights: ['Fine dining', 'Тал нутгийн сэдэв', 'Хосдоо'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=800&q=80', alt: 'Fine dining' },
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', alt: 'Elegant interior' },
    ],
    menu: [
      { id: 'sr1', name: 'Tasting menu (5 course)', description: 'Сезоны хамгийн шилдэг бүтээлүүд.', priceMnt: 85000, tags: ['Premium', 'Top'] },
      { id: 'sr2', name: 'Wagyu beef', description: 'A5 Wagyu, трюфель соус.', priceMnt: 120000, tags: ['Premium'] },
    ],
  },
  {
    id: 'garden-bistro',
    name: 'Garden Bistro',
    category: 'restaurant',
    city: 'Улаанбаатар',
    district: 'СБД',
    vibes: ['family', 'chill', 'work'],
    rating: 4.2,
    reviewCount: 543,
    priceLevel: 2,
    distanceKm: 0.9,
    address: 'СБД, 2-р хороо, Olympic St 3',
    openNow: true,
    closesAt: '21:00',
    phone: '+976 7600 9900',
    coords: { lat: 47.9200, lng: 106.9100 },
    highlights: ['Цэцэрлэгт хашаа', 'Европын хоол', 'Ажил + уулзалт'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80', alt: 'Garden bistro' },
      { url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', alt: 'Bistro food' },
    ],
    menu: [
      { id: 'gb1', name: 'Caesar salad', description: 'Romaine, parmesan, anchovy dressing.', priceMnt: 18000, tags: ['Top'] },
      { id: 'gb2', name: 'Pasta carbonara', description: 'Pancetta, egg yolk, pecorino.', priceMnt: 24000 },
    ],
  },
  {
    id: 'steppe-grill',
    name: 'Steppe Grill',
    category: 'restaurant',
    city: 'Улаанбаатар',
    district: 'БГД',
    vibes: ['party', 'music', 'family'],
    rating: 4.5,
    reviewCount: 1100,
    priceLevel: 2,
    distanceKm: 1.8,
    address: 'БГД, 1-р хороо, Seoul St 22',
    openNow: true,
    closesAt: '00:00',
    phone: '+976 7333 5566',
    coords: { lat: 47.9080, lng: 106.9010 },
    highlights: ['BBQ', 'Live хөгжим (Б.Б)', 'Том бүлэгт'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', alt: 'BBQ grill' },
      { url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80', alt: 'Grilled meat' },
    ],
    menu: [
      { id: 'sg1', name: 'Mixed grill platter', description: 'Хонь, үхэр, тахиа — гурилтай.', priceMnt: 48000, tags: ['Top'] },
      { id: 'sg2', name: 'Mongolian BBQ', description: 'Таны сонгосон мах + ногоо.', priceMnt: 32000 },
    ],
  },

  // ── PUBS / BARS ───────────────────────────────────────────────────────────
  {
    id: 'amber-lantern',
    name: 'Amber Lantern',
    category: 'pub',
    city: 'Улаанбаатар',
    district: 'БГД',
    vibes: ['party', 'music', 'craft'],
    rating: 4.5,
    reviewCount: 742,
    priceLevel: 2,
    distanceKm: 2.6,
    address: 'БГД, 3-р хороо, Seoul St 8',
    openNow: true,
    closesAt: '01:00',
    phone: '+976 7555 8877',
    coords: { lat: 47.9092, lng: 106.9053 },
    highlights: ['Craft beer', 'Live music (Пүрэв)', 'Тайвширч суух'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80', alt: 'Cozy bar' },
      { url: 'https://images.unsplash.com/photo-1514361892635-eae31be96f44?auto=format&fit=crop&w=800&q=80', alt: 'Beer on table' },
    ],
    menu: [
      { id: 'p1', name: 'IPA (Pint)', description: 'Citrus, pine, medium bitter.', priceMnt: 14000, tags: ['Beer'] },
      { id: 'p2', name: 'Buffalo wings', description: 'Spicy, buttery, ranch dip.', priceMnt: 22000, tags: ['Snack', 'Top'] },
      { id: 'p3', name: 'Classic burger', description: 'Beef patty, cheddar, house sauce.', priceMnt: 26000, tags: ['Food'] },
    ],
  },
  {
    id: 'dark-horse',
    name: 'Dark Horse Bar',
    category: 'pub',
    city: 'Улаанбаатар',
    district: 'СБД',
    vibes: ['party', 'chill', 'music'],
    rating: 4.1,
    reviewCount: 389,
    priceLevel: 2,
    distanceKm: 1.5,
    address: 'СБД, 8-р хороо, Sukhbaatar Sq 5',
    openNow: true,
    closesAt: '02:00',
    phone: '+976 7222 1100',
    coords: { lat: 47.9210, lng: 106.9180 },
    highlights: ['DJ хөгжим', 'Дансны ундаа', 'Хожмын шөнө'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80', alt: 'Dark bar' },
      { url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', alt: 'Cocktails' },
    ],
    menu: [
      { id: 'dh1', name: 'Dark & Stormy', description: 'Rum, ginger beer, lime.', priceMnt: 18000, tags: ['Cocktail', 'Top'] },
      { id: 'dh2', name: 'Nachos', description: 'Cheese sauce, jalapeño, guac.', priceMnt: 20000, tags: ['Snack'] },
    ],
  },
  {
    id: 'tap-house',
    name: 'Tap House UB',
    category: 'pub',
    city: 'Улаанбаатар',
    district: 'СХД',
    vibes: ['craft', 'chill', 'work'],
    rating: 4.6,
    reviewCount: 612,
    priceLevel: 2,
    distanceKm: 4.2,
    address: 'СХД, 19-р хороо, Zaisan Rd 14',
    openNow: false,
    closesAt: '23:30',
    phone: '+976 7444 6677',
    coords: { lat: 47.8950, lng: 106.9150 },
    highlights: ['12 craft tap', 'Brewery tour', 'Хос дуртай'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=800&q=80', alt: 'Tap house' },
      { url: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80', alt: 'Beer taps' },
    ],
    menu: [
      { id: 'th1', name: 'Flight (4×150ml)', description: 'Seasonal selection.', priceMnt: 22000, tags: ['Top'] },
      { id: 'th2', name: 'Stout (Pint)', description: 'Roasted malt, chocolate finish.', priceMnt: 15000, tags: ['Beer'] },
    ],
  },
  {
    id: 'vinyl-lounge',
    name: 'Vinyl Lounge',
    category: 'pub',
    city: 'Улаанбаатар',
    district: 'БГД',
    vibes: ['romantic', 'chill', 'music'],
    rating: 4.4,
    reviewCount: 298,
    priceLevel: 3,
    distanceKm: 2.9,
    address: 'БГД, 5-р хороо, Zaisan hill base',
    openNow: true,
    closesAt: '01:30',
    phone: '+976 7999 0011',
    coords: { lat: 47.9050, lng: 106.9200 },
    highlights: ['Vinyl record бар', 'Cocktail menu', 'Хос + romantic'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80', alt: 'Vinyl records bar' },
      { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', alt: 'Lounge interior' },
    ],
    menu: [
      { id: 'vl1', name: 'Old Fashioned', description: 'Bourbon, bitters, orange peel.', priceMnt: 28000, tags: ['Cocktail', 'Top'] },
      { id: 'vl2', name: 'Cheese board', description: 'Selection of 4 cheeses, honey, nuts.', priceMnt: 32000 },
    ],
  },

  // ── CAFES ─────────────────────────────────────────────────────────────────
  {
    id: 'citrus-note',
    name: 'Citrus Note',
    category: 'cafe',
    city: 'Улаанбаатар',
    district: 'СХД',
    vibes: ['work', 'chill'],
    rating: 4.8,
    reviewCount: 1960,
    priceLevel: 1,
    distanceKm: 0.8,
    address: 'СХД, 17-р хороо, Ikh Toiruu 21',
    openNow: false,
    closesAt: '21:00',
    phone: '+976 7777 3333',
    coords: { lat: 47.9222, lng: 106.914 },
    highlights: ['Specialty coffee', 'Oat milk', 'Work-friendly'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=800&q=80', alt: 'Cafe counter' },
      { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80', alt: 'Latte art' },
    ],
    menu: [
      { id: 'c1', name: 'Flat white', description: 'Double shot, silky milk.', priceMnt: 9000, tags: ['Coffee', 'Top'] },
      { id: 'c2', name: 'Yuzu cheesecake', description: 'Citrus finish, light and creamy.', priceMnt: 12000, tags: ['Dessert'] },
      { id: 'c3', name: 'Iced americano', description: 'Clean, bright, refreshing.', priceMnt: 8000, tags: ['Coffee'] },
    ],
  },
  {
    id: 'cloud9-coffee',
    name: 'Cloud 9 Coffee',
    category: 'cafe',
    city: 'Улаанбаатар',
    district: 'СБД',
    vibes: ['chill', 'romantic', 'work'],
    rating: 4.6,
    reviewCount: 1450,
    priceLevel: 2,
    distanceKm: 0.5,
    address: 'СБД, 3-р хороо, Baga Toiruu 9',
    openNow: true,
    closesAt: '22:00',
    phone: '+976 7100 2200',
    coords: { lat: 47.9195, lng: 106.9165 },
    highlights: ['3rd wave coffee', 'Terrace view', 'Хос + work'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=800&q=80', alt: 'Coffee shop' },
      { url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80', alt: 'Coffee cup' },
    ],
    menu: [
      { id: 'cc1', name: 'Pour over', description: 'Ethiopia Yirgacheffe, floral & fruity.', priceMnt: 14000, tags: ['Coffee', 'Top'] },
      { id: 'cc2', name: 'Croissant', description: 'Butter croissant, fresh baked.', priceMnt: 8000, tags: ['Pastry'] },
    ],
  },
  {
    id: 'book-corner',
    name: 'Book Corner Café',
    category: 'cafe',
    city: 'Улаанбаатар',
    district: 'БГД',
    vibes: ['chill', 'work'],
    rating: 4.4,
    reviewCount: 720,
    priceLevel: 1,
    distanceKm: 2.3,
    address: 'БГД, 6-р хороо, Enkhtaivan Ave 101',
    openNow: true,
    closesAt: '20:00',
    phone: '+976 7800 1122',
    coords: { lat: 47.9140, lng: 106.8990 },
    highlights: ['Номын сан дотор', 'Тайван орчин', 'Хямд'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80', alt: 'Book cafe' },
      { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80', alt: 'Books and coffee' },
    ],
    menu: [
      { id: 'bc1', name: 'Americano', description: 'Simple, strong, reliable.', priceMnt: 6000, tags: ['Coffee', 'Top'] },
      { id: 'bc2', name: 'Honey latte', description: 'Espresso, oat milk, honey.', priceMnt: 9000, tags: ['Coffee'] },
    ],
  },
  {
    id: 'morning-bloom',
    name: 'Morning Bloom',
    category: 'cafe',
    city: 'Улаанбаатар',
    district: 'СХД',
    vibes: ['chill', 'family', 'romantic'],
    rating: 4.9,
    reviewCount: 3200,
    priceLevel: 2,
    distanceKm: 1.1,
    address: 'СХД, 10-р хороо, Narny zam 55',
    openNow: true,
    closesAt: '21:30',
    phone: '+976 7050 8080',
    coords: { lat: 47.9180, lng: 106.9300 },
    highlights: ['Цэцэг чимэглэл', 'Instagrammable', 'Гэрийн нандин'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80', alt: 'Flower cafe' },
      { url: 'https://images.unsplash.com/photo-1562305259-ec94b7f8b5f5?auto=format&fit=crop&w=800&q=80', alt: 'Aesthetic coffee' },
    ],
    menu: [
      { id: 'mb1', name: 'Rose latte', description: 'Rose syrup, steamed milk, espresso.', priceMnt: 13000, tags: ['Coffee', 'Top'] },
      { id: 'mb2', name: 'Strawberry tart', description: 'Fresh strawberry, custard, crispy shell.', priceMnt: 15000, tags: ['Dessert'] },
    ],
  },
  {
    id: 'peak-brew',
    name: 'Peak Brew',
    category: 'cafe',
    city: 'Улаанбаатар',
    district: 'СБД',
    vibes: ['work', 'chill'],
    rating: 4.3,
    reviewCount: 890,
    priceLevel: 1,
    distanceKm: 0.7,
    address: 'СБД, 11-р хороо, Peace Ave 77',
    openNow: true,
    closesAt: '20:30',
    phone: '+976 7660 3344',
    coords: { lat: 47.9205, lng: 106.9130 },
    highlights: ['Fast wifi', 'Том ширээ', 'Remote work'],
    photos: [
      { url: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=800&q=80', alt: 'Work cafe' },
      { url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80', alt: 'Laptop cafe' },
    ],
    menu: [
      { id: 'pb1', name: 'Cold brew', description: '24h steep, smooth & bold.', priceMnt: 10000, tags: ['Coffee', 'Top'] },
      { id: 'pb2', name: 'Banana bread', description: 'Moist, walnut, warm.', priceMnt: 7000, tags: ['Snack'] },
    ],
  },
]

export function getPlaceById(placeId: string) {
  return places.find((p) => p.id === placeId)
}
