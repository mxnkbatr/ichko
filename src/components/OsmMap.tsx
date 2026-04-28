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
import { cn } from '../lib/cn'

const MapContainerAny = MapContainer as unknown as React.ComponentType<any>
const TileLayerAny = TileLayer as unknown as React.ComponentType<any>
const MarkerAny = Marker as unknown as React.ComponentType<any>
const TooltipAny = Tooltip as unknown as React.ComponentType<any>

// ── Yelp-style Numbered Pin ────────────────────────────────────────────────
function createNumberedPin(index: number, isSelected: boolean) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 28px; height: 28px;
        background: ${isSelected ? '#f97316' : '#1d1d1f'};
        color: white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        font-weight: 900; font-size: 11px;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <span style="transform: rotate(45deg)">${index}</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  })
}

function FitToPlaces({
  places,
  selectedId,
  user,
  disabled,
}: {
  places: Place[]
  selectedId?: string
  user?: { lat: number; lng: number }
  disabled?: boolean
}) {
  const map = useMap()

  const bounds = useMemo(() => {
    const pts: L.LatLngTuple[] = [
      ...places.map(p => [p.coords.lat, p.coords.lng] as unknown as L.LatLngTuple),
      ...(user ? [[user.lat, user.lng] as unknown as L.LatLngTuple] as L.LatLngTuple[] : []),
    ]
    if (!pts.length) return null
    return L.latLngBounds(pts)
  }, [places, user])

  useEffect(() => {
    if (!bounds || disabled) return
    map.fitBounds(bounds.pad(0.25), { animate: true })
  }, [bounds, map, disabled])

  useEffect(() => {
    if (!selectedId || disabled) return
    const p = places.find(x => x.id === selectedId)
    if (!p) return
    map.flyTo([p.coords.lat, p.coords.lng], Math.max(map.getZoom(), 15), {
      animate: true,
      duration: 0.6,
    })
  }, [selectedId, places, map, disabled])

  return null
}

export function OsmMap({
  places,
  selectedId,
  userLocation,
  onSelect,
  className,
  showNumbers = true,
  interactive = true,
}: {
  places: Place[]
  selectedId?: string
  userLocation?: { lat: number; lng: number }
  onSelect?: (id: string) => void
  className?: string
  showNumbers?: boolean
  interactive?: boolean
}) {
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [47.9187, 106.9179]

  return (
    <div className={cn("relative h-full w-full bg-zinc-100 dark:bg-zinc-900", className)}>
      <MapContainerAny
        center={center}
        zoom={13}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={false}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayerAny
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitToPlaces
          places={places}
          selectedId={selectedId}
          user={userLocation}
          disabled={!interactive}
        />

        {places.map((p, i) => (
          <MarkerAny
            key={p.id}
            position={[p.coords.lat, p.coords.lng]}
            icon={showNumbers ? createNumberedPin(i + 1, p.id === selectedId) : createNumberedPin(0, p.id === selectedId)}
            eventHandlers={{
              click: () => interactive && onSelect?.(p.id),
            }}
          >
            {interactive && (
              <TooltipAny direction="top" offset={[0, -28]} opacity={1}>
                <div className="rounded-lg bg-white p-2 shadow-xl dark:bg-zinc-950">
                  <div className="text-[13px] font-bold text-zinc-900 dark:text-white">{p.name}</div>
                  <div className="mt-0.5 text-[11px] font-medium text-zinc-500">
                    {p.rating.toFixed(1)} ★ · {p.distanceKm.toFixed(1)} км
                  </div>
                </div>
              </TooltipAny>
            )}
          </MarkerAny>
        ))}
      </MapContainerAny>
      
      {interactive && (
        <div className="absolute right-4 top-4 z-[1000] rounded-xl border border-zinc-200 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/60">
          Live Map
        </div>
      )}
    </div>
  )
}
