'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Activity } from '@/lib/types'
import { MapPin, Navigation, Maximize2 } from 'lucide-react'

interface TripRouteMapProps {
  activities: Activity[]
  destination: string
  selectedActivityId?: string | null
  onSelectActivity?: (activityId: string) => void
}

const DESTINATION_FALLBACK_COORDS: Record<string, L.LatLngTuple> = {
  jaipur: [26.9124, 75.7873],
  kerala: [9.4981, 76.3388],
  alleppey: [9.4981, 76.3388],
  goa: [15.4909, 73.8278],
  manali: [32.2432, 77.1892],
  udaipur: [24.5854, 73.7125],
  rishikesh: [30.0869, 78.2676],
}

function resolveCoordinates(activity: Activity, index: number, destination: string): L.LatLngTuple {
  if (activity.lat && activity.lng && !isNaN(activity.lat) && !isNaN(activity.lng)) {
    return [activity.lat, activity.lng]
  }

  const destKey = Object.keys(DESTINATION_FALLBACK_COORDS).find(k => destination.toLowerCase().includes(k))
  const [baseLat, baseLng] = (destKey && DESTINATION_FALLBACK_COORDS[destKey]) ? DESTINATION_FALLBACK_COORDS[destKey] : [26.9124, 75.7873]

  // Micro-offset stops so they don't overlap if using fallback
  const offsetLat = (index - 1) * 0.015
  const offsetLng = (index - 1) * 0.012
  return [baseLat + offsetLat, baseLng + offsetLng]
}

export default function TripRouteMap({
  activities = [],
  destination,
  selectedActivityId,
  onSelectActivity,
}: TripRouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})
  const routeLineRef = useRef<L.Polyline | null>(null)

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      })

      // OpenStreetMap with Dark Theme styling (Free, 0 API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        className: 'map-tiles-dark',
      }).addTo(map)

      // Add custom minimal zoom control in top-right
      L.control.zoom({ position: 'topright' }).addTo(map)

      mapInstanceRef.current = map
    }

    const map = mapInstanceRef.current

    // Clear previous markers & route line
    Object.values(markersRef.current).forEach((m) => m.remove())
    markersRef.current = {}
    if (routeLineRef.current) {
      routeLineRef.current.remove()
      routeLineRef.current = null
    }

    if (activities.length === 0) {
      const destKey = Object.keys(DESTINATION_FALLBACK_COORDS).find(k => destination.toLowerCase().includes(k))
      const center: L.LatLngTuple = (destKey && DESTINATION_FALLBACK_COORDS[destKey]) ? DESTINATION_FALLBACK_COORDS[destKey] : [26.9124, 75.7873]
      map.setView(center, 13)
      return
    }

    const latLngs: L.LatLngTuple[] = []

    activities.forEach((act, idx) => {
      const [lat, lng] = resolveCoordinates(act, idx, destination)
      latLngs.push([lat, lng])

      const stopNumber = act.sequence || idx + 1
      const isSelected = selectedActivityId === act.placeId

      // Custom Luxury Gold Teardrop Pin
      const pinIcon = L.divIcon({
        className: 'roamio-map-pin',
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            background: ${isSelected ? '#ffd700' : '#d4a574'};
            border: 2px solid ${isSelected ? '#ffffff' : '#0a0a0a'};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: ${isSelected ? '0 0 20px #ffd700' : '0 0 12px rgba(212, 165, 116, 0.6)'};
            transition: all 0.3s ease;
            cursor: pointer;
          ">
            <span style="
              transform: rotate(45deg);
              font-family: monospace;
              font-weight: 800;
              font-size: 13px;
              color: #0a0a0a;
            ">${stopNumber}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })

      const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map)

      // Interactive popup
      const popupContent = `
        <div style="
          background: #141414;
          color: #f5f5f5;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(212, 165, 116, 0.4);
          font-family: sans-serif;
          min-width: 200px;
        ">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="font-family: monospace; font-size: 10px; color: #d4a574; font-weight: bold; text-transform: uppercase;">
              Stop 0${stopNumber} · ${act.startTime || ''}
            </span>
            <span style="font-family: monospace; font-size: 10px; color: #10b981;">
              ₹${(act.costEstimateINR || 0).toLocaleString()}
            </span>
          </div>
          <div style="font-size: 13px; font-weight: bold; color: #ffffff; margin-bottom: 4px;">
            ${act.placeName || act.title}
          </div>
          <div style="font-size: 11px; color: #a0a0a0; margin-bottom: 8px; line-height: 1.3;">
            ${act.address || ''}
          </div>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((act.placeName || '') + ' ' + (act.address || ''))}" 
             target="_blank" 
             rel="noopener noreferrer" 
             style="display: inline-block; font-size: 11px; font-family: monospace; color: #d4a574; text-decoration: underline;">
             Open in Google Maps ↗
          </a>
        </div>
      `
      marker.bindPopup(popupContent, {
        className: 'roamio-dark-popup',
        closeButton: false,
      })

      marker.on('click', () => {
        if (onSelectActivity) {
          onSelectActivity(act.placeId)
        }
      })

      markersRef.current[act.placeId] = marker
    })

    // Draw connecting transit line between stops
    if (latLngs.length > 1) {
      routeLineRef.current = L.polyline(latLngs, {
        color: '#d4a574',
        weight: 3.5,
        dashArray: '6, 8',
        opacity: 0.85,
        lineCap: 'round',
      }).addTo(map)
    }

    // Fit map bounds
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs)
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    }

    // Force tile recalculation after layout settles
    const timeout = setTimeout(() => {
      map.invalidateSize()
    }, 250)

    return () => clearTimeout(timeout)
  }, [activities, destination, onSelectActivity, selectedActivityId])

  // Center on selected activity when changed
  useEffect(() => {
    if (!selectedActivityId || !mapInstanceRef.current) return
    const marker = markersRef.current[selectedActivityId]
    if (marker) {
      const map = mapInstanceRef.current
      map.flyTo(marker.getLatLng(), 15, { duration: 1 })
      marker.openPopup()
    }
  }, [selectedActivityId])

  function resetView() {
    if (!mapInstanceRef.current || activities.length === 0) return
    const latLngs: L.LatLngTuple[] = activities.map((act, idx) => resolveCoordinates(act, idx, destination))
    mapInstanceRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50], maxZoom: 14 })
  }

  return (
    <div className='relative w-full h-[480px] lg:h-[580px] rounded-3xl overflow-hidden border border-primary/30 glass-strong shadow-2xl gold-glow group'>
      
      {/* Top Floating Badge & Legend */}
      <div className='absolute top-4 left-4 z-[1000] flex items-center gap-2 pointer-events-none'>
        <div className='glass-dark px-3 py-1.5 rounded-full border border-primary/30 text-primary font-mono text-xs font-bold flex items-center gap-1.5 shadow-md'>
          <Navigation className='w-3.5 h-3.5 text-primary animate-pulse' />
          <span>Interactive Day Route</span>
        </div>
        <div className='glass-dark px-2.5 py-1.5 rounded-full border border-white/10 text-gray-300 font-mono text-xs hidden sm:flex items-center gap-1'>
          <span>{activities.length} Stops</span>
        </div>
      </div>

      {/* Reset View Button */}
      <button
        type='button'
        onClick={resetView}
        title='Reset Map View'
        className='absolute bottom-4 right-4 z-[1000] p-2.5 rounded-xl glass-dark border border-white/20 hover:border-primary text-gray-300 hover:text-white transition-all shadow-lg cursor-pointer'
      >
        <Maximize2 className='w-4 h-4' />
      </button>

      {/* Map Container Element */}
      <div ref={mapContainerRef} className='w-full h-full z-0 bg-[#0a0a0a]' />

      {/* Bottom Hint */}
      <div className='absolute bottom-3 left-4 z-[1000] text-[11px] font-mono text-gray-400 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none border border-white/5'>
        Click any stop pin to inspect details
      </div>

    </div>
  )
}
