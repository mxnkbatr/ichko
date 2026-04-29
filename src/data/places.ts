export type PlaceCategory = 'restaurant' | 'pub' | 'cafe'

export type UbDistrict = 'СБД' | 'БГД' | 'СХД'

export type VibeTag = 'chill' | 'party' | 'romantic' | 'family' | 'work' | 'music' | 'craft'

export const CATEGORIES = [
  { id: 'all' as const,        emoji: '🗺️', label: 'Бүгд' },
  { id: 'restaurant' as const, emoji: '🍽️', label: 'Ресторан' },
  { id: 'cafe' as const,       emoji: '☕', label: 'Кафе' },
  { id: 'pub' as const,        emoji: '🍺', label: 'Паб/Бар' },
]

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
  phone: string
  photos: { url: string; alt: string }[]
  coords: { lat: number; lng: number }
  highlights: string[]
  menu: MenuItem[]
  featured?: boolean
}

const PHOTO = {
  food1: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
  food2: 'https://images.unsplash.com/photo-1541544181051-e46601b6e0d0?auto=format&fit=crop&w=1200&q=80',
  food3: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
  food4: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80',
  cafe1: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
  cafe2: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
  cafe3: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80',
  cafe4: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1200&q=80',
  pub1: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
  pub2: 'https://images.unsplash.com/photo-1514361892635-eae31be96f44?auto=format&fit=crop&w=1200&q=80',
  pub3: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80',
  pub4: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
} as const

const rMenu = (id: string): MenuItem[] => [
  { id: `${id}-1`, name: 'Онцгой сет', description: 'Шефийн өдөр тутмын сонголт.', priceMnt: 42000 },
  { id: `${id}-2`, name: 'Үндсэн хоол', description: 'Мах, ногооны тэнцвэртэй таваг.', priceMnt: 26000 },
  { id: `${id}-3`, name: 'Салат', description: 'Шинэ ногооны микс.', priceMnt: 14000 },
  { id: `${id}-4`, name: 'Ундаа', description: 'Гэрийн жорын ундаа.', priceMnt: 9000 },
]
const cMenu = (id: string): MenuItem[] => [
  { id: `${id}-1`, name: 'Flat white', description: 'Сүүтэй тэнцвэртэй кофе.', priceMnt: 10000 },
  { id: `${id}-2`, name: 'Pour over', description: 'Single-origin drip coffee.', priceMnt: 13000 },
  { id: `${id}-3`, name: 'Croissant', description: 'Цөцгийн тослог pastry.', priceMnt: 9000 },
  { id: `${id}-4`, name: 'Cheesecake', description: 'Зөөлөн амттай амттан.', priceMnt: 14000 },
]
const pMenu = (id: string): MenuItem[] => [
  { id: `${id}-1`, name: 'Signature cocktail', description: 'Бармены тусгай жор.', priceMnt: 24000 },
  { id: `${id}-2`, name: 'Craft beer pint', description: 'Local craft beer.', priceMnt: 15000 },
  { id: `${id}-3`, name: 'Wings', description: 'Халуун ногоотой тахианы далавч.', priceMnt: 22000 },
  { id: `${id}-4`, name: 'Nachos', description: 'Бяслаг, salsa-тай snack.', priceMnt: 19000 },
]

export const places: Place[] = [
  // Restaurants (12)
  { id: 'saffron-sky', name: 'Saffron Sky', category: 'restaurant', city: 'Улаанбаатар', district: 'СБД', vibes: ['romantic', 'family'], rating: 4.7, reviewCount: 1284, priceLevel: 2, distanceKm: 1.2, address: 'СБД, 1-р хороо, Peace Ave 12', openNow: true, closesAt: '23:00', phone: '+976 7000 1234', photos: [{ url: PHOTO.food1, alt: 'Plated food' }, { url: PHOTO.food2, alt: 'Restaurant interior' }], coords: { lat: 47.9187, lng: 106.9179 }, highlights: ['Үндэсний + fusion', 'Зөөлөн интерьер', 'Хосуудад таатай'], menu: rMenu('saffron-sky'), featured: true },
  { id: 'nomad-table', name: 'Nomad Table', category: 'restaurant', city: 'Улаанбаатар', district: 'БГД', vibes: ['family', 'chill'], rating: 4.4, reviewCount: 954, priceLevel: 1, distanceKm: 2.1, address: 'БГД, 7-р хороо, Энхтайваны өргөн чөлөө 45', openNow: true, closesAt: '22:00', phone: '+976 7711 2233', photos: [{ url: PHOTO.food1, alt: 'Mongolian dishes' }, { url: PHOTO.food4, alt: 'Family dining' }], coords: { lat: 47.9125, lng: 106.895 }, highlights: ['Өрхийн уур амьсгал', 'Хурдан үйлчилгээ', 'Үнэ боломжийн'], menu: rMenu('nomad-table') },
  { id: 'han-river-korean-grill', name: 'Han River Korean Grill', category: 'restaurant', city: 'Улаанбаатар', district: 'СБД', vibes: ['party', 'family'], rating: 4.6, reviewCount: 1702, priceLevel: 2, distanceKm: 1.8, address: 'СБД, 6-р хороо, Seoul Street 14', openNow: true, closesAt: '23:30', phone: '+976 7090 2244', photos: [{ url: PHOTO.food4, alt: 'Korean grill platter' }, { url: PHOTO.food2, alt: 'Korean restaurant' }], coords: { lat: 47.9241, lng: 106.9104 }, highlights: ['Солонгос BBQ', 'Том сет меню', 'Найзуудын уулзалт'], menu: rMenu('han-river-korean-grill'), featured: true },
  { id: 'sakura-zen', name: 'Sakura Zen', category: 'restaurant', city: 'Улаанбаатар', district: 'СБД', vibes: ['romantic', 'chill'], rating: 4.8, reviewCount: 2230, priceLevel: 3, distanceKm: 0.9, address: 'СБД, 3-р хороо, Olympic Street 8', openNow: true, closesAt: '22:30', phone: '+976 7701 5566', photos: [{ url: PHOTO.food3, alt: 'Japanese food' }, { url: PHOTO.food2, alt: 'Japanese interior' }], coords: { lat: 47.9202, lng: 106.9134 }, highlights: ['Япон minimal интерьер', 'Sushi menu', 'Оройн сет'], menu: rMenu('sakura-zen') },
  { id: 'trattoria-roma-ub', name: 'Trattoria Roma UB', category: 'restaurant', city: 'Улаанбаатар', district: 'БГД', vibes: ['romantic', 'family'], rating: 4.5, reviewCount: 1325, priceLevel: 2, distanceKm: 3.2, address: 'БГД, 2-р хороо, Нарны зам 41', openNow: true, closesAt: '23:00', phone: '+976 7012 3344', photos: [{ url: PHOTO.food3, alt: 'Italian pasta' }, { url: PHOTO.food1, alt: 'Italian table' }], coords: { lat: 47.9076, lng: 106.9028 }, highlights: ['Итали хоол', 'Пицца чулуун зуух', 'Вино сонголт'], menu: rMenu('trattoria-roma-ub') },
  { id: 'toktok-fast-kitchen', name: 'TokTok Fast Kitchen', category: 'restaurant', city: 'Улаанбаатар', district: 'СХД', vibes: ['chill', 'family'], rating: 4.1, reviewCount: 760, priceLevel: 1, distanceKm: 2.9, address: 'СХД, 14-р хороо, Хархорин 32', openNow: true, closesAt: '22:00', phone: '+976 7033 1010', photos: [{ url: PHOTO.food4, alt: 'Fast casual bowl' }, { url: PHOTO.food1, alt: 'Fast food table' }], coords: { lat: 47.9315, lng: 106.9036 }, highlights: ['Fast-casual', 'Combo сонголт', 'Залууст тохиромжтой'], menu: rMenu('toktok-fast-kitchen') },
  { id: 'khan-heritage-dining', name: 'Khan Heritage Dining', category: 'restaurant', city: 'Улаанбаатар', district: 'СБД', vibes: ['family', 'romantic'], rating: 4.9, reviewCount: 2860, priceLevel: 3, distanceKm: 1.4, address: 'СБД, 5-р хороо, Жуулчны гудамж 9', openNow: true, closesAt: '22:30', phone: '+976 7550 9988', photos: [{ url: PHOTO.food2, alt: 'Fine dining plate' }, { url: PHOTO.food3, alt: 'Fine dining ambiance' }], coords: { lat: 47.9229, lng: 106.9217 }, highlights: ['Дээд зэрэглэлийн сервис', 'Монгол оройн сет', 'Жуулчдад төгс'], menu: rMenu('khan-heritage-dining'), featured: true },
  { id: 'seoul-bite-house', name: 'Seoul Bite House', category: 'restaurant', city: 'Улаанбаатар', district: 'БГД', vibes: ['party', 'family'], rating: 4.3, reviewCount: 1210, priceLevel: 2, distanceKm: 2.7, address: 'БГД, 4-р хороо, Кёкүшю цамхагийн ард', openNow: true, closesAt: '23:00', phone: '+976 7018 8877', photos: [{ url: PHOTO.food4, alt: 'Korean stew and sides' }, { url: PHOTO.food1, alt: 'Korean table meal' }], coords: { lat: 47.9108, lng: 106.8996 }, highlights: ['Korean comfort food', 'Spicy menu', 'Групп хооллолт'], menu: rMenu('seoul-bite-house') },
  { id: 'sora-japanese-house', name: 'Sora Japanese House', category: 'restaurant', city: 'Улаанбаатар', district: 'СХД', vibes: ['chill', 'work'], rating: 4.2, reviewCount: 670, priceLevel: 2, distanceKm: 4.1, address: 'СХД, 19-р хороо, Зайсангийн гудамж 11', openNow: false, closesAt: '22:00', phone: '+976 7605 4477', photos: [{ url: PHOTO.food3, alt: 'Ramen and sushi' }, { url: PHOTO.food2, alt: 'Japanese decor' }], coords: { lat: 47.8964, lng: 106.9192 }, highlights: ['Рамен онцгой', 'Lunch combo', 'Тайван хөгжим'], menu: rMenu('sora-japanese-house') },
  { id: 'olive-street-italiano', name: 'Olive Street Italiano', category: 'restaurant', city: 'Улаанбаатар', district: 'СБД', vibes: ['romantic', 'chill'], rating: 4.6, reviewCount: 1498, priceLevel: 2, distanceKm: 1.6, address: 'СБД, 8-р хороо, Бага тойруу 23', openNow: true, closesAt: '23:00', phone: '+976 7717 8899', photos: [{ url: PHOTO.food3, alt: 'Pizza and pasta' }, { url: PHOTO.food1, alt: 'Italian restaurant table' }], coords: { lat: 47.926, lng: 106.9241 }, highlights: ['Гарын паста', 'Wood-fired pizza', 'Оройн уур амьсгал'], menu: rMenu('olive-street-italiano') },
  { id: 'mongol-bbq-yard', name: 'Mongol BBQ Yard', category: 'restaurant', city: 'Улаанбаатар', district: 'БГД', vibes: ['party', 'music', 'family'], rating: 4.3, reviewCount: 1122, priceLevel: 2, distanceKm: 3.8, address: 'БГД, 10-р хороо, Дунд голын зам 7', openNow: true, closesAt: '00:30', phone: '+976 7066 5544', photos: [{ url: PHOTO.food4, alt: 'BBQ mixed platter' }, { url: PHOTO.food2, alt: 'BBQ grill table' }], coords: { lat: 47.9029, lng: 106.9094 }, highlights: ['Ил галын BBQ', 'Live band баасан', 'Гадна суудал'], menu: rMenu('mongol-bbq-yard') },
  { id: 'urban-wok-express', name: 'Urban Wok Express', category: 'restaurant', city: 'Улаанбаатар', district: 'СХД', vibes: ['work', 'chill'], rating: 3.9, reviewCount: 482, priceLevel: 1, distanceKm: 5.3, address: 'СХД, 7-р хороо, 5-р хороолол 18', openNow: true, closesAt: '22:00', phone: '+976 7422 8181', photos: [{ url: PHOTO.food4, alt: 'Wok noodle bowl' }, { url: PHOTO.food1, alt: 'Takeaway boxes' }], coords: { lat: 47.9378, lng: 106.9042 }, highlights: ['Хурдан гардаг', 'Box meal сонголт', 'Үнэ боломжийн'], menu: rMenu('urban-wok-express') },

  // Cafes (10)
  { id: 'citrus-note', name: 'Citrus Note', category: 'cafe', city: 'Улаанбаатар', district: 'СХД', vibes: ['work', 'chill'], rating: 4.8, reviewCount: 1960, priceLevel: 1, distanceKm: 0.8, address: 'СХД, 17-р хороо, Их тойруу 21', openNow: false, closesAt: '21:00', phone: '+976 7777 3333', photos: [{ url: PHOTO.cafe4, alt: 'Cafe counter' }, { url: PHOTO.cafe1, alt: 'Latte art' }], coords: { lat: 47.9222, lng: 106.914 }, highlights: ['Specialty coffee', 'Oat milk', 'Ажиллахад тохиромжтой'], menu: cMenu('citrus-note'), featured: true },
  { id: 'cloud-nine-coffee', name: 'Cloud Nine Coffee', category: 'cafe', city: 'Улаанбаатар', district: 'СБД', vibes: ['chill', 'romantic'], rating: 4.6, reviewCount: 1450, priceLevel: 2, distanceKm: 0.5, address: 'СБД, 3-р хороо, Бага тойруу 9', openNow: true, closesAt: '22:00', phone: '+976 7100 2200', photos: [{ url: PHOTO.cafe3, alt: 'Coffee shop seating' }, { url: PHOTO.cafe2, alt: 'Coffee table' }], coords: { lat: 47.9195, lng: 106.9165 }, highlights: ['Террас харагдац', 'Сайхан dessert', 'Болзоо хийхэд тохиромжтой'], menu: cMenu('cloud-nine-coffee') },
  { id: 'book-corner-cafe', name: 'Book Corner Cafe', category: 'cafe', city: 'Улаанбаатар', district: 'БГД', vibes: ['work', 'chill'], rating: 4.4, reviewCount: 720, priceLevel: 1, distanceKm: 2.3, address: 'БГД, 6-р хороо, Энхтайваны өргөн чөлөө 101', openNow: true, closesAt: '20:00', phone: '+976 7800 1122', photos: [{ url: PHOTO.cafe4, alt: 'Books and coffee' }, { url: PHOTO.cafe2, alt: 'Quiet cafe corner' }], coords: { lat: 47.914, lng: 106.899 }, highlights: ['Номын булан', 'Чимээгүй орчин', 'Хямд кофе'], menu: cMenu('book-corner-cafe') },
  { id: 'morning-bloom', name: 'Morning Bloom', category: 'cafe', city: 'Улаанбаатар', district: 'СХД', vibes: ['chill', 'family', 'romantic'], rating: 4.9, reviewCount: 2900, priceLevel: 2, distanceKm: 1.1, address: 'СХД, 10-р хороо, Нарны зам 55', openNow: true, closesAt: '21:30', phone: '+976 7050 8080', photos: [{ url: PHOTO.cafe2, alt: 'Aesthetic cafe interior' }, { url: PHOTO.cafe1, alt: 'Beautiful coffee drink' }], coords: { lat: 47.918, lng: 106.93 }, highlights: ['Aesthetic интерьер', 'Фото авахад гоё', 'Амттай pastry'], menu: cMenu('morning-bloom'), featured: true },
  { id: 'peak-brew', name: 'Peak Brew', category: 'cafe', city: 'Улаанбаатар', district: 'СБД', vibes: ['work', 'chill'], rating: 4.3, reviewCount: 890, priceLevel: 1, distanceKm: 0.7, address: 'СБД, 11-р хороо, Peace Ave 77', openNow: true, closesAt: '20:30', phone: '+976 7660 3344', photos: [{ url: PHOTO.cafe3, alt: 'Work cafe desk' }, { url: PHOTO.cafe4, alt: 'Laptop and coffee' }], coords: { lat: 47.9205, lng: 106.913 }, highlights: ['Хурдан Wi-Fi', 'Том ширээ', 'Remote ажил'], menu: cMenu('peak-brew') },
  { id: 'brick-lane-roastery', name: 'Brick Lane Roastery', category: 'cafe', city: 'Улаанбаатар', district: 'БГД', vibes: ['craft', 'work'], rating: 4.7, reviewCount: 1305, priceLevel: 2, distanceKm: 3.1, address: 'БГД, 8-р хороо, Төмөр замын ар 5', openNow: true, closesAt: '21:00', phone: '+976 7511 5522', photos: [{ url: PHOTO.cafe4, alt: 'Roastery setup' }, { url: PHOTO.cafe1, alt: 'Coffee beans and cup' }], coords: { lat: 47.9062, lng: 106.8937 }, highlights: ['Өөрсдөө roast хийдэг', 'Beans худалдаа', 'Бариста workshop'], menu: cMenu('brick-lane-roastery') },
  { id: 'loft-cowork-cafe', name: 'Loft Cowork Cafe', category: 'cafe', city: 'Улаанбаатар', district: 'СБД', vibes: ['work', 'chill'], rating: 4.5, reviewCount: 1022, priceLevel: 2, distanceKm: 1.3, address: 'СБД, 4-р хороо, Бага тойруу 18', openNow: true, closesAt: '22:00', phone: '+976 7730 3344', photos: [{ url: PHOTO.cafe3, alt: 'Coworking cafe' }, { url: PHOTO.cafe2, alt: 'Cafe meeting area' }], coords: { lat: 47.9218, lng: 106.9193 }, highlights: ['Coworking zone', 'Power outlet олон', 'Meeting room'], menu: cMenu('loft-cowork-cafe') },
  { id: 'north-light-cafe', name: 'North Light Cafe', category: 'cafe', city: 'Улаанбаатар', district: 'СХД', vibes: ['family', 'chill'], rating: 4.2, reviewCount: 510, priceLevel: 1, distanceKm: 4.7, address: 'СХД, 20-р хороо, Яармаг 31', openNow: true, closesAt: '21:00', phone: '+976 7544 2201', photos: [{ url: PHOTO.cafe2, alt: 'Cozy family cafe' }, { url: PHOTO.cafe1, alt: 'Breakfast and coffee' }], coords: { lat: 47.8879, lng: 106.9281 }, highlights: ['Гэр бүлийн булан', 'Хүүхдийн menu', 'Өглөөний сет'], menu: cMenu('north-light-cafe') },
  { id: 'velvet-espresso', name: 'Velvet Espresso', category: 'cafe', city: 'Улаанбаатар', district: 'БГД', vibes: ['romantic', 'chill'], rating: 4.6, reviewCount: 1406, priceLevel: 2, distanceKm: 2.6, address: 'БГД, 3-р хороо, Нарны гүүрний зүүн тал', openNow: false, closesAt: '22:30', phone: '+976 7612 7773', photos: [{ url: PHOTO.cafe1, alt: 'Dessert and coffee' }, { url: PHOTO.cafe3, alt: 'Aesthetic seating' }], coords: { lat: 47.9087, lng: 106.9086 }, highlights: ['Velvet интерьер', 'Dessert bar', 'Оройн кофе'], menu: cMenu('velvet-espresso') },
  { id: 'district-seven-cafe', name: 'District Seven Cafe', category: 'cafe', city: 'Улаанбаатар', district: 'СБД', vibes: ['work', 'craft'], rating: 4.1, reviewCount: 402, priceLevel: 1, distanceKm: 1.9, address: 'СБД, 7-р хороо, Жуулчны гудамж 15', openNow: true, closesAt: '20:30', phone: '+976 7733 9911', photos: [{ url: PHOTO.cafe4, alt: 'Cafe barista bar' }, { url: PHOTO.cafe1, alt: 'Coffee cup closeup' }], coords: { lat: 47.9256, lng: 106.9262 }, highlights: ['Barista class', 'Beans tasting', 'Тайван булан'], menu: cMenu('district-seven-cafe') },

  // Pubs (8)
  { id: 'amber-lantern', name: 'Amber Lantern', category: 'pub', city: 'Улаанбаатар', district: 'БГД', vibes: ['party', 'music', 'craft'], rating: 4.5, reviewCount: 742, priceLevel: 2, distanceKm: 2.6, address: 'БГД, 3-р хороо, Seoul Street 8', openNow: true, closesAt: '01:00', phone: '+976 7555 8877', photos: [{ url: PHOTO.pub1, alt: 'Cozy pub interior' }, { url: PHOTO.pub2, alt: 'Beer glasses on table' }], coords: { lat: 47.9092, lng: 106.9053 }, highlights: ['Craft beer selection', 'Live хөгжим', 'After-work crowd'], menu: pMenu('amber-lantern'), featured: true },
  { id: 'dark-horse-bar', name: 'Dark Horse Bar', category: 'pub', city: 'Улаанбаатар', district: 'СБД', vibes: ['party', 'music'], rating: 4.1, reviewCount: 389, priceLevel: 2, distanceKm: 1.5, address: 'СБД, 8-р хороо, Сүхбаатарын талбай 5', openNow: true, closesAt: '02:00', phone: '+976 7222 1100', photos: [{ url: PHOTO.pub3, alt: 'Dark bar lighting' }, { url: PHOTO.pub4, alt: 'Cocktail lineup' }], coords: { lat: 47.921, lng: 106.918 }, highlights: ['DJ set орой бүр', 'Signature cocktail', 'Late-night scene'], menu: pMenu('dark-horse-bar') },
  { id: 'tap-house-ub', name: 'Tap House UB', category: 'pub', city: 'Улаанбаатар', district: 'СХД', vibes: ['craft', 'chill'], rating: 4.6, reviewCount: 612, priceLevel: 2, distanceKm: 4.2, address: 'СХД, 19-р хороо, Зайсангийн зам 14', openNow: false, closesAt: '23:30', phone: '+976 7444 6677', photos: [{ url: PHOTO.pub1, alt: 'Craft beer taps' }, { url: PHOTO.pub2, alt: 'Pub table beers' }], coords: { lat: 47.895, lng: 106.915 }, highlights: ['12 tap craft beer', 'Seasonal brew', 'Тайван суух орчин'], menu: pMenu('tap-house-ub') },
  { id: 'vinyl-lounge', name: 'Vinyl Lounge', category: 'pub', city: 'Улаанбаатар', district: 'БГД', vibes: ['romantic', 'music', 'chill'], rating: 4.4, reviewCount: 298, priceLevel: 3, distanceKm: 2.9, address: 'БГД, 5-р хороо, Зайсан hill base', openNow: true, closesAt: '01:30', phone: '+976 7999 0011', photos: [{ url: PHOTO.pub3, alt: 'Vinyl style lounge' }, { url: PHOTO.pub4, alt: 'Classic cocktails' }], coords: { lat: 47.905, lng: 106.92 }, highlights: ['Vinyl record сет', 'Craft cocktail', 'Romantic lounge'], menu: pMenu('vinyl-lounge') },
  { id: 'orbit-cocktail-club', name: 'Orbit Cocktail Club', category: 'pub', city: 'Улаанбаатар', district: 'СБД', vibes: ['party', 'romantic'], rating: 4.7, reviewCount: 1675, priceLevel: 3, distanceKm: 1.1, address: 'СБД, 2-р хороо, Seoul Street 19', openNow: true, closesAt: '02:00', phone: '+976 7007 3030', photos: [{ url: PHOTO.pub4, alt: 'Cocktail bar counter' }, { url: PHOTO.pub3, alt: 'Night bar crowd' }], coords: { lat: 47.9175, lng: 106.9232 }, highlights: ['Signature cocktail list', 'Бар show', 'Weekend crowd'], menu: pMenu('orbit-cocktail-club'), featured: true },
  { id: 'craft-yard-pub', name: 'Craft Yard Pub', category: 'pub', city: 'Улаанбаатар', district: 'БГД', vibes: ['craft', 'music', 'party'], rating: 4.2, reviewCount: 533, priceLevel: 2, distanceKm: 3.4, address: 'БГД, 9-р хороо, Нарны гүүр 2', openNow: true, closesAt: '00:30', phone: '+976 7010 6644', photos: [{ url: PHOTO.pub2, alt: 'Pub group table' }, { url: PHOTO.pub1, alt: 'Beer and snacks' }], coords: { lat: 47.9032, lng: 106.9062 }, highlights: ['Homebrew tap', 'Open mic night', 'Group table'], menu: pMenu('craft-yard-pub') },
  { id: 'city-malt-house', name: 'City Malt House', category: 'pub', city: 'Улаанбаатар', district: 'СХД', vibes: ['chill', 'craft'], rating: 3.8, reviewCount: 244, priceLevel: 1, distanceKm: 6.2, address: 'СХД, 23-р хороо, Яармаг central 12', openNow: false, closesAt: '23:00', phone: '+976 7477 1881', photos: [{ url: PHOTO.pub1, alt: 'Local pub interior' }, { url: PHOTO.pub2, alt: 'Beer taps and pints' }], coords: { lat: 47.8848, lng: 106.9365 }, highlights: ['Үнэ боломжийн', 'Happy hour', 'Тайван орчин'], menu: pMenu('city-malt-house') },
  { id: 'live-wire-bar', name: 'Live Wire Bar', category: 'pub', city: 'Улаанбаатар', district: 'СБД', vibes: ['music', 'party'], rating: 4.0, reviewCount: 438, priceLevel: 2, distanceKm: 2.4, address: 'СБД, 9-р хороо, Их сургуулийн гудамж 4', openNow: true, closesAt: '01:30', phone: '+976 7790 6611', photos: [{ url: PHOTO.pub3, alt: 'Live music stage bar' }, { url: PHOTO.pub4, alt: 'Crowded cocktail night' }], coords: { lat: 47.9294, lng: 106.9228 }, highlights: ['Live rock stage', 'Сэтгэгдэлтэй crowd', 'Late snacks'], menu: pMenu('live-wire-bar') },
]

export function getPlaceById(placeId: string) {
  return places.find((p) => p.id === placeId)
}
