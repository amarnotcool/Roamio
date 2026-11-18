'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Users,
  ExternalLink,
  Share2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Compass,
  Navigation,
  ArrowLeftRight,
  RotateCcw,
  Check,
  CloudSun,
  Car,
  Utensils,
  Camera,
  Layers,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Activity, DayPlan } from '@/lib/types'
import ActivitySwapModal from '@/components/itinerary/ActivitySwapModal'

// Dynamic import with SSR disabled for Leaflet Map
const TripRouteMap = dynamic(() => import('@/components/map/TripRouteMap'), {
  ssr: false,
  loading: () => (
    <div className='w-full h-[480px] lg:h-[580px] rounded-3xl glass-dark border border-primary/20 flex flex-col items-center justify-center gap-3 text-xs font-mono text-primary'>
      <div className='w-7 h-7 rounded-full border-2 border-primary/30 border-t-primary animate-spin' />
      <span>Calibrating Cartographic Route Map...</span>
    </div>
  ),
})

interface Trip {
  id: string
  title: string
  destination: string
  start_date: string
  end_date: string
  budget_inr: number
  travelers: { adults: number; children: number }
  interests: string[]
  pace: string
}

const DESTINATION_HERO_MAP: Record<string, string> = {
  jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=85',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=85',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1920&q=85',
  udaipur: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1920&q=85',
  rishikesh: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=85',
}

const PLACE_PHOTO_MAP: Record<string, string> = {
  jp1: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', // Amer Fort
  jp2: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80', // Panna Meena Stepwell
  jp3: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', // LMB Thali / Sweets
  jp4: 'https://images.unsplash.com/photo-1609137144822-26d400490b6a?auto=format&fit=crop&w=800&q=80', // City Palace
  jp5: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80', // Hawa Mahal Cafe
  jp6: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', // Johari Bazaar
  jp7: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80', // Nahargarh Sunset
  jp8: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', // Chokhi Dhani
  jp9: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', // Albert Hall
  jp10: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', // Tapri Tea
  kl1: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', // Shikara
  kl2: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', // Marari Beach
  ga1: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', // Fontainhas
  mn1: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', // Old Manali Cedar
  ud1: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80', // Udaipur City Palace
}

const DEFAULT_SAMPLE_TRIP: Trip = {
  id: 'sample',
  title: 'Royal Heritage & Bazaars of Jaipur',
  destination: 'Jaipur, Rajasthan',
  start_date: '2026-11-25',
  end_date: '2026-11-28',
  budget_inr: 50000,
  travelers: { adults: 2, children: 1 },
  interests: ['culture', 'food', 'photography'],
  pace: 'moderate',
}

const DEFAULT_SAMPLE_ITINERARY: DayPlan[] = [
  {
    dayNumber: 1,
    date: '2026-11-25',
    notes: 'Arrival, palace architecture & evening panoramic sunset over the Aravalli hills.',
    activities: [
      {
        sequence: 1,
        startTime: '09:00',
        endTime: '12:00',
        title: 'Amer Fort & Sheesh Mahal Exploration',
        description: 'Arrive early at the Sun Gate (Suraj Pol) before tourist buses arrive. Walk through the mirrored halls of Sheesh Mahal and descend into the cool geometric depths of Panna Meena Ka Kund.',
        type: 'sightseeing',
        placeId: 'jp1',
        placeName: 'Amer Fort & Sheesh Mahal',
        address: 'Devisinghpura, Amer, Jaipur, Rajasthan 302001',
        costEstimateINR: 1850,
        verified: true,
        lat: 26.9855,
        lng: 75.8513,
      },
      {
        sequence: 2,
        startTime: '13:00',
        endTime: '14:30',
        title: 'Traditional Royal Thali at LMB',
        description: 'Enjoy Ghewar, Dal Baati Churma, and Ker Sangri at Jaipur’s legendary sweet and vegetarian dining institution.',
        type: 'dining',
        placeId: 'jp3',
        placeName: 'LMB (Laxmi Misthan Bhandar)',
        address: 'Johari Bazaar, Pink City, Jaipur, Rajasthan 302003',
        costEstimateINR: 1400,
        verified: true,
        lat: 26.9204,
        lng: 75.8242,
      },
      {
        sequence: 3,
        startTime: '16:00',
        endTime: '18:30',
        title: 'Sunset over Pink City at Nahargarh Fort',
        description: 'Watch the evening twilight cast golden amber tones across the entire cityscape from the ancient fort ramparts.',
        type: 'sightseeing',
        placeId: 'jp7',
        placeName: 'Nahargarh Fort Sunset Point',
        address: 'Krishna Nagar, Brahampuri, Jaipur, Rajasthan 302002',
        costEstimateINR: 600,
        verified: true,
        lat: 26.9372,
        lng: 75.8155,
      },
    ],
    transport: [
      {
        sequence: 1,
        departureTime: '08:20',
        arrivalTime: '08:55',
        mode: 'taxi',
        fromPlaceId: 'hotel',
        toPlaceId: 'jp1',
        costEstimateINR: 350,
      },
      {
        sequence: 2,
        departureTime: '15:15',
        arrivalTime: '15:50',
        mode: 'taxi',
        fromPlaceId: 'jp3',
        toPlaceId: 'jp7',
        costEstimateINR: 400,
      },
    ],
  },
  {
    dayNumber: 2,
    date: '2026-11-26',
    notes: 'Textile arts, astronomical heritage & bustling old city markets.',
    activities: [
      {
        sequence: 1,
        startTime: '09:30',
        endTime: '12:00',
        title: 'City Palace Courtyards & Chandra Mahal',
        description: 'Wander through the Peacock Gate and marvel at the royal costume galleries and arms museums.',
        type: 'cultural',
        placeId: 'jp4',
        placeName: 'City Palace & Chandra Mahal',
        address: 'Tulsi Marg, Gangori Bazaar, Jaipur',
        costEstimateINR: 1500,
        verified: true,
        lat: 26.9258,
        lng: 75.8237,
      },
      {
        sequence: 2,
        startTime: '12:30',
        endTime: '14:00',
        title: 'Rooftop Spiced Tea overlooking Hawa Mahal',
        description: 'Sip saffron chai with uninterrupted views of the honeycomb facade and gentle desert breezes.',
        type: 'dining',
        placeId: 'jp5',
        placeName: 'Hawa Mahal Viewpoint Cafe',
        address: 'Badi Choupad, J.D.A. Market, Pink City, Jaipur',
        costEstimateINR: 850,
        verified: true,
        lat: 26.9239,
        lng: 75.8267,
      },
      {
        sequence: 3,
        startTime: '15:30',
        endTime: '18:30',
        title: 'Handloom Block Printing & Spice Walk in Johari Bazaar',
        description: 'Meet local master craftsmen practicing Sanganeri handblock printing and pick up authentic Jaipuri razai quilts.',
        type: 'shopping',
        placeId: 'jp6',
        placeName: 'Johari Bazaar & Bapu Bazaar Textile Walk',
        address: 'Bapu Bazaar, Pink City, Jaipur, Rajasthan 302003',
        costEstimateINR: 2500,
        verified: true,
        lat: 26.9189,
        lng: 75.8214,
      },
    ],
    transport: [
      {
        sequence: 1,
        departureTime: '09:00',
        arrivalTime: '09:25',
        mode: 'taxi',
        fromPlaceId: 'hotel',
        toPlaceId: 'jp4',
        costEstimateINR: 250,
      },
    ],
  },
]

export default function TripDetailPage() {
  const params = useParams()
  const tripId = params.id as string
  const [trip, setTrip] = useState<Trip | null>(null)
  const [itinerary, setItinerary] = useState<DayPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDayTab, setActiveDayTab] = useState('1')
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)

  // Swap Engine States
  const [swapModalOpen, setSwapModalOpen] = useState(false)
  const [swappingActivity, setSwappingActivity] = useState<Activity | null>(null)
  const [swappingDayNumber, setSwappingDayNumber] = useState<number>(1)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    loadTrip()
  }, [tripId])

  async function loadTrip() {
    try {
      const { data: tripData } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single()

      if (tripData) {
        const { data: itinData } = await supabase
          .from('itineraries')
          .select('*')
          .eq('trip_id', tripId)
          .order('day_number')

        setTrip(tripData)
        setItinerary(itinData || [])
        setLoading(false)
        return
      }
    } catch {
      // Fallback
    }

    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('roamio_trip_' + tripId)
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          setTrip(parsed)
          setItinerary(parsed.itinerary || [])
          setLoading(false)
          return
        } catch (e) {
          console.error('Session storage error:', e)
        }
      }
    }

    setTrip(DEFAULT_SAMPLE_TRIP)
    setItinerary(DEFAULT_SAMPLE_ITINERARY)
    setLoading(false)
  }

  async function saveUpdatedItinerary(newItinerary: DayPlan[]) {
    if (typeof window !== 'undefined' && trip) {
      const updatedTrip = {
        ...trip,
        itinerary: newItinerary,
      }
      sessionStorage.setItem('roamio_trip_' + trip.id, JSON.stringify(updatedTrip))

      // Update local storage for guest dashboard
      try {
        const localData = localStorage.getItem('roamio_guest_trips')
        if (localData) {
          const parsed = JSON.parse(localData)
          const updatedList = parsed.map((t: any) => (t.id === trip.id ? updatedTrip : t))
          localStorage.setItem('roamio_guest_trips', JSON.stringify(updatedList))
        }
      } catch (err) {
        console.error('Local cache error:', err)
      }
    }

    // Sync to Supabase if connected and trip is saved in cloud
    if (trip?.id && !trip.id.startsWith('guest_') && trip.id !== 'sample') {
      try {
        for (const day of newItinerary) {
          await supabase
            .from('itineraries')
            .upsert({
              trip_id: trip.id,
              day_number: day.dayNumber,
              date: day.date,
              activities: day.activities,
              transport: day.transport,
              notes: day.notes,
            }, { onConflict: 'trip_id,day_number' })
        }
      } catch (e) {
        console.error('Failed to sync updated itinerary to Supabase:', e)
      }
    }
  }

  function handleSwapActivity(dayNum: number, oldActivityId: string, newActivity: Activity) {
    setItinerary((prev) => {
      const updated = prev.map((day) => {
        if (day.dayNumber === dayNum) {
          return {
            ...day,
            activities: day.activities.map((act) =>
              act.placeId === oldActivityId ? newActivity : act
            ),
          }
        }
        return day
      })

      saveUpdatedItinerary(updated)
      return updated
    })

    setSelectedActivityId(newActivity.placeId)
    setToastMessage(`✓ Swapped stop with ${newActivity.placeName}`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  async function handleRegenerateDay(dayNum: number) {
    if (!trip) return
    setToastMessage(`Re-choreographing Day 0${dayNum} with fresh verified stops...`)

    try {
      const targetDay = itinerary.find((d) => d.dayNumber === dayNum)
      if (!targetDay || targetDay.activities.length === 0) return

      // Request fresh alternative for the first stop to rotate the day
      const firstStop = targetDay.activities[0]
      const res = await fetch('/api/swap-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: trip.destination,
          currentPlaceId: firstStop.placeId,
          intent: 'all',
        }),
      })

      const data = await res.json()
      if (data.alternatives && data.alternatives.length > 0) {
        const replacement = data.alternatives[0]
        handleSwapActivity(dayNum, firstStop.placeId, replacement)
        setToastMessage(`✓ Day 0${dayNum} rejuvenated with ${replacement.placeName}`)
      } else {
        setToastMessage(`✓ Day 0${dayNum} refreshed with optimal sequence`)
      }
    } catch {
      setToastMessage('Could not regenerate day at this moment.')
    }
  }

  function getDayCost(day: DayPlan) {
    const actCost = day.activities.reduce((sum, a) => sum + (a.costEstimateINR || 0), 0)
    const transitCost = day.transport?.reduce((sum, t) => sum + (t.costEstimateINR || 0), 0) || 0
    return actCost + transitCost
  }

  function getCategoryBreakdown() {
    let sightseeing = 0
    let dining = 0
    let transit = 0
    let cultureAndShopping = 0

    itinerary.forEach((day) => {
      day.activities.forEach((act) => {
        const cost = act.costEstimateINR || 0
        if (act.type === 'sightseeing' || act.type === 'adventure') sightseeing += cost
        else if (act.type === 'dining') dining += cost
        else cultureAndShopping += cost
      })
      day.transport?.forEach((t) => {
        transit += t.costEstimateINR || 0
      })
    })

    return { sightseeing, dining, transit, cultureAndShopping }
  }

  if (loading || !trip) {
    return (
      <div className='min-h-[500px] flex flex-col items-center justify-center gap-3 text-primary font-mono text-sm'>
        <div className='w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin' />
        <span>Compiling Traveler Dossier...</span>
      </div>
    )
  }

  const days = itinerary.length > 0 ? itinerary.length : 2
  const totalCost = itinerary.reduce((sum, day) => sum + getDayCost(day), 0)
  const breakdown = getCategoryBreakdown()
  const targetBudget = trip.budget_inr || 50000
  const budgetRatio = Math.min(100, Math.round((totalCost / targetBudget) * 100))
  const reserveBuffer = Math.max(0, targetBudget - totalCost)

  const currentDayPlan = itinerary.find((d) => d.dayNumber.toString() === activeDayTab) || itinerary[0]

  const destKey = trip.destination.toLowerCase().includes('jaipur')
    ? 'jaipur'
    : trip.destination.toLowerCase().includes('kerala') || trip.destination.toLowerCase().includes('alleppey')
    ? 'kerala'
    : trip.destination.toLowerCase().includes('goa')
    ? 'goa'
    : trip.destination.toLowerCase().includes('manali')
    ? 'manali'
    : trip.destination.toLowerCase().includes('udaipur')
    ? 'udaipur'
    : 'jaipur'

  const heroImage = DESTINATION_HERO_MAP[destKey] || DESTINATION_HERO_MAP.jaipur

  return (
    <div className='max-w-7xl mx-auto space-y-10 pb-24'>
      
      {/* 1. CINEMATIC EDITORIAL HERO COVER */}
      <div className='relative rounded-3xl overflow-hidden border border-[rgba(212,165,116,0.25)] shadow-2xl gold-glow'>
        
        {/* Background Photo with Rich Dark Gradient Veil */}
        <div className='absolute inset-0 z-0'>
          <Image
            src={heroImage}
            alt={trip.destination}
            fill
            className='object-cover opacity-40 scale-105 transition-transform duration-1000'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-t from-[#0e0d0b] via-[#0e0d0b]/70 to-[#0e0d0b]/40' />
          <div className='absolute inset-0 bg-radial-at-c from-transparent via-[#0e0d0b]/30 to-[#0e0d0b]/90' />
        </div>

        {/* Hero Content Overlay */}
        <div className='relative z-10 p-6 sm:p-10 lg:p-12 space-y-6'>
          
          {/* Top Bar: Stamp Badge + Seasonality Weather + Actions */}
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex flex-wrap items-center gap-3'>
              <span className='px-3.5 py-1 rounded-full stamp-badge text-primary text-[11px] font-mono font-bold tracking-widest'>
                ✦ Bespoke Journey Dossier
              </span>
              <div className='flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-mono text-gray-300'>
                <CloudSun className='w-3.5 h-3.5 text-primary' />
                <span>26°C · Autumn Twilight Season</span>
              </div>
            </div>

            {/* Print & Share CTAs */}
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={() => window.print()}
                className='p-2 rounded-xl glass hover:border-primary text-gray-300 hover:text-white transition-colors cursor-pointer'
                title='Print Editorial Brief'
              >
                <Printer className='w-4 h-4' />
              </button>
              <button
                type='button'
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: trip.title, url: window.location.href }).catch(() => {})
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    setToastMessage('✓ Itinerary link copied to clipboard')
                    setTimeout(() => setToastMessage(null), 3000)
                  }
                }}
                className='px-4 py-2 rounded-xl bg-primary text-black font-semibold text-xs flex items-center gap-1.5 shadow-md hover:bg-primary/90 transition-all cursor-pointer gold-glow'
              >
                <Share2 className='w-3.5 h-3.5' />
                <span>Share Journey</span>
              </button>
            </div>
          </div>

          {/* Headline & Location */}
          <div className='space-y-2 max-w-4xl'>
            <div className='flex items-center gap-2 text-xs font-mono text-primary/90 uppercase tracking-widest'>
              <MapPin className='w-3.5 h-3.5' />
              <span>{trip.destination}</span>
              <span>·</span>
              <span>{days} Curated Days</span>
            </div>
            <h1 className='font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight'>
              {trip.title}
            </h1>
          </div>

          {/* Metadata Specs & Badges */}
          <div className='flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-gray-300'>
            <span className='flex items-center gap-1.5 px-3 py-1 rounded-lg glass-dark border-white/10'>
              <Calendar className='w-3.5 h-3.5 text-primary' />
              {trip.start_date} – {trip.end_date}
            </span>
            <span className='flex items-center gap-1.5 px-3 py-1 rounded-lg glass-dark border-white/10'>
              <Users className='w-3.5 h-3.5 text-primary' />
              {trip.travelers?.adults || 2} Adults{trip.travelers?.children ? `, ${trip.travelers.children} Kids` : ''}
            </span>
            <span className='px-3 py-1 rounded-lg glass-dark border-primary/30 text-primary font-bold uppercase'>
              {trip.pace} Pace
            </span>
            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-lg glass-dark border-emerald-500/30 text-emerald-400'>
              <ShieldCheck className='w-3.5 h-3.5' /> Verified Opening Hours
            </span>
            {trip.interests?.map((item) => (
              <span key={item} className='px-2.5 py-1 rounded-lg glass text-gray-400 uppercase text-[10px]'>
                {item}
              </span>
            ))}
          </div>

        </div>

      </div>

      {/* 2. SWISS CHRONOMETER BUDGET COMPLICATION */}
      <div className='rounded-3xl border border-[rgba(212,165,116,0.2)] glass-strong p-6 sm:p-8 space-y-6'>
        
        {/* Complication Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4'>
          <div>
            <span className='font-mono text-xs uppercase tracking-widest text-primary font-bold flex items-center gap-1.5'>
              <Compass className='w-4 h-4' /> The Budget Compass
            </span>
            <h3 className='font-serif text-xl font-bold text-white mt-0.5'>
              Ground Expense Architecture
            </h3>
          </div>
          <div className='text-left sm:text-right font-mono text-xs'>
            <span className='text-gray-400 block'>Safe Reserve Available</span>
            <span className='font-serif text-lg font-bold text-emerald-400'>
              ₹{reserveBuffer.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 4 Multi-Tier Category Cards */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono'>
          
          <div className='p-4 rounded-2xl bg-black/40 border border-[#c86d51]/30 space-y-1.5'>
            <span className='text-[#c86d51] flex items-center gap-1 text-[11px] uppercase font-bold'>
              <Camera className='w-3.5 h-3.5' /> Sightseeing & Entry
            </span>
            <span className='font-serif text-xl font-bold text-white block'>
              ₹{breakdown.sightseeing.toLocaleString()}
            </span>
            <span className='text-[10px] text-gray-500 block'>Palaces & Forts</span>
          </div>

          <div className='p-4 rounded-2xl bg-black/40 border border-[#d4a574]/30 space-y-1.5'>
            <span className='text-[#d4a574] flex items-center gap-1 text-[11px] uppercase font-bold'>
              <Utensils className='w-3.5 h-3.5' /> Royal Dining & Cafes
            </span>
            <span className='font-serif text-xl font-bold text-white block'>
              ₹{breakdown.dining.toLocaleString()}
            </span>
            <span className='text-[10px] text-gray-500 block'>Thalis, Sweets & Tea</span>
          </div>

          <div className='p-4 rounded-2xl bg-black/40 border border-[#2d4a3e]/50 space-y-1.5'>
            <span className='text-emerald-400 flex items-center gap-1 text-[11px] uppercase font-bold'>
              <Car className='w-3.5 h-3.5' /> Private Transit
            </span>
            <span className='font-serif text-xl font-bold text-white block'>
              ₹{breakdown.transit.toLocaleString()}
            </span>
            <span className='text-[10px] text-gray-500 block'>AC Sedans & Autos</span>
          </div>

          <div className='p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5'>
            <span className='text-gray-300 flex items-center gap-1 text-[11px] uppercase font-bold'>
              <Layers className='w-3.5 h-3.5 text-primary' /> Culture & Bazaars
            </span>
            <span className='font-serif text-xl font-bold text-white block'>
              ₹{breakdown.cultureAndShopping.toLocaleString()}
            </span>
            <span className='text-[10px] text-gray-500 block'>Handlooms & Spices</span>
          </div>

        </div>

        {/* Multi-Segmented Gauge Bar */}
        <div className='space-y-2'>
          <div className='h-3.5 w-full bg-black/60 rounded-full overflow-hidden flex border border-white/10 p-0.5 gap-1'>
            <div
              style={{ width: `${(breakdown.sightseeing / targetBudget) * 100}%` }}
              className='h-full bg-[#c86d51] rounded-full'
              title='Sightseeing'
            />
            <div
              style={{ width: `${(breakdown.dining / targetBudget) * 100}%` }}
              className='h-full bg-[#d4a574] rounded-full'
              title='Dining'
            />
            <div
              style={{ width: `${(breakdown.transit / targetBudget) * 100}%` }}
              className='h-full bg-[#2d4a3e] rounded-full'
              title='Transit'
            />
            <div
              style={{ width: `${(breakdown.cultureAndShopping / targetBudget) * 100}%` }}
              className='h-full bg-amber-200/50 rounded-full'
              title='Culture'
            />
          </div>

          <div className='flex items-center justify-between text-[11px] font-mono text-gray-400'>
            <span>
              Total Estimated Ground Burn: <strong className='text-white'>₹{totalCost.toLocaleString()}</strong> of ₹{targetBudget.toLocaleString()}
            </span>
            <span>
              Pacing: ~₹{Math.round(totalCost / days).toLocaleString()}/day
            </span>
          </div>
        </div>

      </div>

      {/* 3. DAY-BY-DAY EDITORIAL TIMELINE & CARTOGRAPHIC MAP */}
      <div className='space-y-6'>
        
        {/* Section Heading & Embossed Day Tabs */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <h2 className='font-serif text-2xl sm:text-3xl font-bold text-white'>
              Chronological <span className='text-gold-shine'>Timeline & Map</span>
            </h2>
            <p className='text-xs font-mono text-gray-400 mt-0.5'>
              Click "Swap Stop" to customize any place or rebalance daily pacing.
            </p>
          </div>
        </div>

        <Tabs value={activeDayTab} onValueChange={setActiveDayTab} className='space-y-6'>
          
          <TabsList className='bg-[#161410] p-1.5 rounded-2xl flex flex-wrap h-auto gap-2 border border-white/10'>
            {itinerary.map((day) => (
              <TabsTrigger
                key={day.dayNumber}
                value={day.dayNumber.toString()}
                className='data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:font-bold font-mono text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer'
              >
                Day 0{day.dayNumber}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* 7 Columns Timeline / 5 Columns Sticky Map */}
          <div className='grid lg:grid-cols-12 gap-8 items-start'>
            
            {/* LEFT COLUMN: Activity Timeline Cards */}
            <div className='lg:col-span-7 space-y-6'>
              {itinerary.map((day) => (
                <TabsContent key={day.dayNumber} value={day.dayNumber.toString()} className='space-y-6 mt-0'>
                  
                  {/* Day Overview Banner */}
                  <div className='p-6 rounded-3xl glass-strong border border-[rgba(212,165,116,0.2)] flex flex-wrap items-center justify-between gap-4'>
                    <div className='flex items-center gap-4'>
                      <div className='w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center font-serif text-xl font-bold shadow-md gold-glow'>
                        0{day.dayNumber}
                      </div>
                      <div>
                        <h3 className='font-serif text-xl font-bold text-white'>
                          Day 0{day.dayNumber} Sequence
                        </h3>
                        <p className='text-xs font-mono text-gray-400 mt-0.5'>
                          {day.activities.length} Curated Stops · Est. ₹{getDayCost(day).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={() => handleRegenerateDay(day.dayNumber)}
                      className='px-4 py-2 rounded-full glass border border-primary/30 hover:bg-primary/20 text-primary text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer'
                      title='Rebalance this day with alternative curated places'
                    >
                      <RotateCcw className='w-3.5 h-3.5' />
                      <span>Regenerate Day</span>
                    </button>

                    {day.notes && (
                      <p className='w-full text-xs font-serif text-gray-300 italic pt-3 border-t border-white/5'>
                        "{day.notes}"
                      </p>
                    )}
                  </div>

                  {/* Activity Timeline Items */}
                  <div className='space-y-6 relative'>
                    {day.activities.map((activity, index) => {
                      const isSelected = selectedActivityId === activity.placeId
                      const photoUrl = PLACE_PHOTO_MAP[activity.placeId] || heroImage

                      return (
                        <div
                          key={activity.sequence || index}
                          id={`activity-${activity.placeId}`}
                          className='relative flex gap-4'
                        >
                          {/* Visual Timeline Node */}
                          <div className='flex flex-col items-center w-8 pt-6'>
                            <div
                              className={`w-4 h-4 rounded-full ring-4 ring-[#0e0d0b] z-10 transition-all ${
                                isSelected ? 'bg-[#ffd700] scale-125 gold-glow-strong' : 'bg-primary gold-glow'
                              }`}
                            />
                            {index < day.activities.length - 1 && (
                              <div className='w-0.5 flex-1 bg-primary/25 my-1' />
                            )}
                          </div>

                          {/* Postcard Activity Card with Photo Vignette */}
                          <div
                            onClick={() => setSelectedActivityId(activity.placeId)}
                            className={`flex-1 rounded-3xl border overflow-hidden shadow-xl transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/40 gold-glow'
                                : 'border-white/10 glass-strong hover:border-primary/40'
                            }`}
                          >
                            <div className='flex flex-col sm:flex-row'>
                              
                              {/* Left Thumbnail Vignette */}
                              <div className='relative sm:w-44 h-44 sm:h-auto flex-shrink-0 overflow-hidden bg-black/60'>
                                <Image
                                  src={photoUrl}
                                  alt={activity.placeName}
                                  fill
                                  className='object-cover hover:scale-105 transition-transform duration-700'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-black/20 to-transparent' />
                                <div className='absolute bottom-3 left-3 sm:top-3 sm:left-3 z-10'>
                                  <span className='px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] font-bold'>
                                    Stop 0{activity.sequence || index + 1}
                                  </span>
                                </div>
                              </div>

                              {/* Right Content Body */}
                              <div className='p-6 flex-1 space-y-3.5'>
                                
                                <div className='flex flex-wrap items-center justify-between gap-2'>
                                  <div className='flex items-center gap-2'>
                                    <span className='px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-mono text-xs font-bold border border-primary/30'>
                                      {activity.startTime} – {activity.endTime}
                                    </span>
                                    <span className='px-2 py-0.5 rounded-full glass text-gray-300 font-mono text-[11px] uppercase'>
                                      {activity.type}
                                    </span>
                                  </div>
                                  {activity.verified && (
                                    <span className='inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30'>
                                      <CheckCircle2 className='w-3 h-3' /> Verified Open
                                    </span>
                                  )}
                                </div>

                                <div>
                                  <h4 className='font-serif text-xl font-bold text-white'>
                                    {activity.title}
                                  </h4>
                                  <p className='text-xs font-mono text-gray-400 flex items-center gap-1.5 mt-1'>
                                    <MapPin className='w-3.5 h-3.5 text-primary flex-shrink-0' />
                                    <span>{activity.placeName}</span>
                                    <span>·</span>
                                    <span className='truncate'>{activity.address}</span>
                                  </p>
                                </div>

                                {activity.description && (
                                  <p className='text-xs sm:text-sm text-gray-300 leading-relaxed font-sans'>
                                    {activity.description}
                                  </p>
                                )}

                                {/* Action Bar */}
                                <div className='pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono'>
                                  <span className='text-white font-bold'>
                                    Est. Cost: ₹{activity.costEstimateINR?.toLocaleString() || 'Free'}
                                  </span>

                                  <div className='flex flex-wrap items-center gap-2'>
                                    {/* Swap Button */}
                                    <button
                                      type='button'
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSwappingActivity(activity)
                                        setSwappingDayNumber(day.dayNumber)
                                        setSwapModalOpen(true)
                                      }}
                                      className='px-3.5 py-1.5 rounded-full glass border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer gold-glow'
                                      title='Customize or swap this activity'
                                    >
                                      <ArrowLeftRight className='w-3 h-3 text-amber-400' />
                                      <span>Swap Stop</span>
                                    </button>

                                    {/* Pin Button */}
                                    <button
                                      type='button'
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedActivityId(activity.placeId)
                                      }}
                                      className='px-3 py-1.5 rounded-full glass border border-primary/40 hover:bg-primary/20 text-primary flex items-center gap-1 transition-colors'
                                    >
                                      <Navigation className='w-3 h-3' />
                                      <span>Pin</span>
                                    </button>

                                    {/* Maps link */}
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.placeName + ' ' + activity.address)}`}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      onClick={(e) => e.stopPropagation()}
                                      className='px-3 py-1.5 rounded-full glass border border-white/20 hover:border-primary text-gray-300 flex items-center gap-1 transition-colors'
                                    >
                                      <span>Maps</span>
                                      <ExternalLink className='w-3 h-3' />
                                    </a>

                                    {/* Book link */}
                                    <button
                                      type='button'
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        alert(`Redirecting to verified partner booking for ${activity.placeName}`)
                                      }}
                                      className='px-3.5 py-1.5 rounded-full bg-primary text-black font-bold flex items-center gap-1 shadow-md hover:bg-primary/90 transition-colors gold-glow'
                                    >
                                      <span>Book</span>
                                      <ExternalLink className='w-3 h-3' />
                                    </button>
                                  </div>
                                </div>

                              </div>

                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Transit Leg Card */}
                    {day.transport && day.transport.length > 0 && (
                      <div className='mt-6 p-5 rounded-2xl glass-dark border border-white/10 space-y-2'>
                        <div className='text-xs font-mono uppercase tracking-wider text-primary font-bold flex items-center gap-2'>
                          <Car className='w-4 h-4' />
                          <span>Private Transit Choreography (AC Chauffeur / Vande Bharat)</span>
                        </div>
                        {day.transport.map((t, idx) => (
                          <div key={idx} className='flex items-center justify-between text-xs font-mono text-gray-400 py-1 border-b border-white/5 last:border-none'>
                            <span>{t.departureTime} – {t.arrivalTime}: <strong className='text-gray-200'>{t.mode.toUpperCase()}</strong></span>
                            <span className='text-gray-200'>₹{t.costEstimateINR?.toLocaleString() || '—'}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                </TabsContent>
              ))}
            </div>

            {/* RIGHT COLUMN: Sticky Cartographic Map with Brass Bezel */}
            <div className='lg:col-span-5 lg:sticky lg:top-24 space-y-4'>
              <div className='p-2 rounded-3xl border border-[rgba(212,165,116,0.3)] glass-strong gold-glow overflow-hidden'>
                <div className='px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs font-mono text-gray-400'>
                  <span className='flex items-center gap-1 text-primary font-bold'>
                    <Compass className='w-3.5 h-3.5' /> Route Cartography
                  </span>
                  <span className='text-[10px] text-gray-500'>Click pins to center</span>
                </div>
                <TripRouteMap
                  activities={currentDayPlan?.activities || []}
                  destination={trip.destination}
                  selectedActivityId={selectedActivityId}
                  onSelectActivity={(id) => {
                    setSelectedActivityId(id)
                    const el = document.getElementById(`activity-${id}`)
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                />
              </div>
            </div>

          </div>

        </Tabs>
      </div>

      {/* Activity Swap & Customization Modal */}
      <ActivitySwapModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        destination={trip.destination}
        dayNumber={swappingDayNumber}
        currentActivity={swappingActivity}
        onSwap={handleSwapActivity}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] px-6 py-3 rounded-full bg-primary text-black font-semibold text-xs sm:text-sm shadow-2xl gold-glow-strong animate-in fade-in slide-in-from-bottom-4 flex items-center gap-2'>
          <Sparkles className='w-4 h-4' />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  )
}
