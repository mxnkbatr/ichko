import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo } from 'react'
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import type { Place } from '../data/places'

// react-leaflet@5's TS types can be overly restrictive depending on React/TS versions.
// We keep the runtime API, but loosen the component prop typing for this prototype.
const MapContainerAny = MapContainer as unknown as React.ComponentType<any>
const TileLayerAny = TileLayer as unknown as React.ComponentType<any>
const MarkerAny = Marker as unknown as React.ComponentType<any>
const TooltipAny = Tooltip as unknown as React.ComponentType<any>

const pinSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="g" x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fb923c"/>
      <stop offset="1" stop-color="#ea580c"/>
    </linearGradient>
  </defs>
  <path fill="url(#g)" d="M32 6c10.5 0 19 8.5 19 19 0 14.5-19 33-19 33S13 39.5 13 25C13 14.5 21.5 6 32 6Z"/>
  <circle cx="32" cy="25" r="7.5" fill="white" fill-opacity=".95"/>
  <circle cx="32" cy="25" r="4.5" fill="rgba(11,12,16,.25)"/>
</svg>
`)

const pinIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;charset=UTF-8,${pinSvg}`,
  iconSize: [34, 34],
  iconAnchor: [17, 32],
})

function FitToPlaces({
  places,
  selectedId,
  user,
}: {
  places: Place[]
  selectedId?: string
  user?: { lat: number; lng: number }
}) {
  const map = useMap()

  const bounds = useMemo(() => {
    const pts: L.LatLngTuple[] = [
      ...places.map(
        (p) => [p.coords.lat, p.coords.lng] as unknown as L.LatLngTuple,
      ),
      ...(user
        ? ([[user.lat, user.lng] as unknown as L.LatLngTuple] as L.LatLngTuple[])
        : []),
    ]
    if (!pts.length) return null
    return L.latLngBounds(pts)
  }, [places, user])

  useEffect(() => {
    if (!bounds) return
    map.fitBounds(bounds.pad(0.25), { animate: true })
  }, [bounds, map])

  useEffect(() => {
    if (!selectedId) return
    const p = places.find((x) => x.id === selectedId)
    if (!p) return
    map.flyTo([p.coords.lat, p.coords.lng], Math.max(map.getZoom(), 14), {
      animate: true,
      duration: 0.6,
    })
  }, [selectedId, places, map])

  return null
}

export function OsmMap({
  places,
  selectedId,
  userLocation,
  onSelect,
}: {
  places: Place[]
  selectedId?: string
  userLocation?: { lat: number; lng: number }
  onSelect?: (id: string) => void
}) {
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [47.9187, 106.9179]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="relative min-h-[420px]">
        <div className="absolute left-4 top-4 z-[1000] rounded-2xl border border-zinc-200 bg-white/80 px-3 py-2 text-[12px] font-semibold text-zinc-800 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30 dark:text-zinc-100">
          OpenStreetMap
        </div>

        <MapContainerAny
          center={center}
          zoom={13}
          scrollWheelZoom
          style={{ height: 420, width: '100%' }}
        >
          <TileLayerAny
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitToPlaces
            places={places}
            selectedId={selectedId}
            user={userLocation}
          />

          {places.map((p) => (
            <MarkerAny
              key={p.id}
              position={[p.coords.lat, p.coords.lng]}
              icon={pinIcon}
              eventHandlers={{
                click: () => onSelect?.(p.id),
              }}
            >
              <TooltipAny direction="top" offset={[0, -22]} opacity={1}>
                <div className="text-[12px] font-semibold">{p.name}</div>
                <div className="text-[11px] opacity-70">
                  {p.distanceKm.toFixed(1)} км · {p.rating.toFixed(1)}
                </div>
              </TooltipAny>
            </MarkerAny>
          ))}
        </MapContainerAny>
      </div>
    </div>
  )
}

