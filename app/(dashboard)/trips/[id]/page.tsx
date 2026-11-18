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
} from 'lucide-react'
import Link from 'next/link'
import { Activity, DayPlan } from '@/lib/types'
import ActivitySwapModal from '@/components/itinerary/ActivitySwapModal'

// Dynamic import with SSR disabled for Leaflet Map
const TripRouteMap = dynamic(() => import('@/components/map/TripRouteMap'), {
  ssr: false,
  loading: () => (
    <div className='w-full h-[480px] lg:h-[580px] rounded-3xl glass-dark border border-white/10 flex flex-col items-center justify-center gap-2 text-xs font-mono text-primary'>
      <div className='w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin' />
      <span>Loading Interactive Route Map...</span>
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

    try {
      setToastMessage(`Regenerating Day 0${dayNum} with fresh curated stops...`)
      const res = await fetch('/api/swap-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: trip.destination,
          intent: 'all',
        }),
      })

      const data = await res.json()
      if (data.alternatives && data.alternatives.length >= 2) {
        const alt1 = data.alternatives[0]
        const alt2 = data.alternatives[1]

        setItinerary((prev) => {
          const updated = prev.map((day) => {
            if (day.dayNumber === dayNum) {
              const acts = day.activities.map((oldAct, idx) => {
                const fresh = idx === 0 ? alt1 : alt2
                return {
                  ...fresh,
                  sequence: oldAct.sequence,
                  startTime: oldAct.startTime,
                  endTime: oldAct.endTime,
                }
              })
              return { ...day, activities: acts }
            }
            return day
          })

          saveUpdatedItinerary(updated)
          return updated
        })

        setToastMessage(`✓ Day 0${dayNum} regenerated with fresh verified places!`)
        setTimeout(() => setToastMessage(null), 4000)
      }
    } catch {
      setToastMessage(`Failed to regenerate Day 0${dayNum}`)
      setTimeout(() => setToastMessage(null), 3000)
    }
  }

  function getTotalCost() {
    return itinerary.reduce((sum, day) => {
      const actCost = day.activities?.reduce((s, a) => s + (a.costEstimateINR || 0), 0) || 0
      const transCost = day.transport?.reduce((s, t) => s + (t.costEstimateINR || 0), 0) || 0
      return sum + actCost + transCost
    }, 0)
  }

  function getDayCost(day: DayPlan) {
    const actCost = day.activities?.reduce((s, a) => s + (a.costEstimateINR || 0), 0) || 0
    const transCost = day.transport?.reduce((s, t) => s + (t.costEstimateINR || 0), 0) || 0
    return actCost + transCost
  }

  if (loading) {
    return (
      <div className='min-h-[50vh] flex flex-col items-center justify-center gap-3'>
        <div className='w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin' />
        <span className='font-mono text-xs text-gray-400'>Loading Confirmed Itinerary...</span>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className='text-center py-20 space-y-4'>
        <h2 className='font-serif text-2xl font-bold text-white'>Trip Not Found</h2>
        <Link href='/new'>
          <Button className='bg-primary text-black font-semibold'>Plan a New Trip</Button>
        </Link>
      </div>
    )
  }

  const totalCost = getTotalCost()
  const days = itinerary.length || 1
  const budgetRatio = trip.budget_inr ? Math.min(100, Math.round((totalCost / trip.budget_inr) * 100)) : 75

  const currentDayPlan = itinerary.find((d) => d.dayNumber.toString() === activeDayTab) || itinerary[0]

  return (
    <div className='max-w-7xl mx-auto space-y-8 pb-20'>

      {/* Luxury Travel Dossier Card */}
      <div className='rounded-3xl border border-primary/30 glass-strong overflow-hidden gold-glow'>

        {/* Ticket Header Ribbon */}
        <div className='bg-primary/15 px-6 sm:px-8 py-4 border-b border-primary/20 flex flex-wrap items-center justify-between gap-3'>
          <div className='flex items-center gap-2 font-mono text-xs text-primary font-bold'>
            <Sparkles className='w-3.5 h-3.5' />
            <span>CONFIRMED ITINERARY · VERIFIED PLACES</span>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => window.print()}
              className='p-2 rounded-lg glass border border-white/10 hover:border-primary text-gray-300 hover:text-white transition-colors cursor-pointer'
              title='Print Itinerary'
            >
              <Printer className='w-4 h-4' />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: trip.title, url: window.location.href }).catch(() => { })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Trip link copied to clipboard!')
                }
              }}
              className='px-4 py-1.5 rounded-full bg-primary text-black font-sans text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-primary/90 transition-colors cursor-pointer'
            >
              <Share2 className='w-3.5 h-3.5' /> Share
            </button>
          </div>
        </div>

        {/* Dossier Body */}
        <div className='p-6 sm:p-8 space-y-6'>
          <div className='flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400'>
            <span className='flex items-center gap-1 text-primary font-bold'>
              <MapPin className='w-3.5 h-3.5' /> {trip.destination}
            </span>
            <span>•</span>
            <span className='flex items-center gap-1'>
              <Calendar className='w-3.5 h-3.5' />
              {trip.start_date} – {trip.end_date} ({days} Days)
            </span>
            <span>•</span>
            <span className='flex items-center gap-1'>
              <Users className='w-3.5 h-3.5' />
              {trip.travelers?.adults || 2} Adults{trip.travelers?.children ? `, ${trip.travelers.children} Kids` : ''}
            </span>
          </div>

          <h1 className='font-serif text-3xl sm:text-5xl font-bold text-white leading-tight'>
            {trip.title}
          </h1>

          <div className='flex flex-wrap items-center gap-2'>
            {trip.interests?.map((interest) => (
              <Badge key={interest} variant='secondary' className='glass border-white/10 text-gray-300 font-mono text-xs'>
                {interest.charAt(0).toUpperCase() + interest.slice(1)}
              </Badge>
            ))}
            <Badge variant='outline' className='border-primary text-primary font-mono text-xs'>
              {trip.pace.toUpperCase()} PACE
            </Badge>
            <span className='inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30'>
              <ShieldCheck className='w-3 h-3' /> Verified Opening Hours
            </span>
          </div>

          {/* Budget Compass Section */}
          <div className='pt-4 border-t border-white/10 space-y-3'>
            <div className='flex flex-wrap items-center justify-between text-xs font-mono'>
              <span className='text-gray-400'>Estimated Ground Expenses</span>
              <span className='font-bold text-white'>
                ₹{totalCost.toLocaleString()} <span className='text-gray-500 font-normal'>/ ₹{trip.budget_inr?.toLocaleString() || '50,000'} Budget</span>
              </span>
            </div>

            <div className='h-3 w-full bg-white/10 rounded-full overflow-hidden flex'>
              <div
                className='h-full bg-primary gold-glow rounded-full transition-all duration-700'
                style={{ width: `${budgetRatio}%` }}
              />
            </div>

            <div className='flex flex-wrap items-center justify-between text-[11px] font-mono text-gray-400'>
              <span>
                Daily Avg: ~₹{Math.round(totalCost / days).toLocaleString()}/day
              </span>
              {trip.budget_inr && totalCost <= trip.budget_inr ? (
                <span className='text-emerald-400 font-semibold'>
                  ✓ ₹{(trip.budget_inr - totalCost).toLocaleString()} in safe reserve buffer
                </span>
              ) : (
                <span className='text-red-400 font-semibold'>
                  ⚠ Exceeds target by ₹{(totalCost - (trip.budget_inr || 0)).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Main Split Layout: Timeline on Left, Sticky Interactive Route Map on Right */}
      <div className='space-y-6'>

        {/* Header and Day Tabs */}
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h2 className='font-serif text-2xl sm:text-3xl font-bold text-white'>
              Day-by-Day <span className='text-gold-shine'>Journey & Map</span>
            </h2>
            <p className='text-xs font-mono text-gray-400 mt-1'>
              Click "Swap Stop" to customize any place or rebalance pacing.
            </p>
          </div>
          <span className='font-mono text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10'>
            {itinerary.length} Days Planned
          </span>
        </div>

        <Tabs value={activeDayTab} onValueChange={setActiveDayTab} className='space-y-6'>

          <TabsList className='glass-dark p-1 rounded-2xl flex flex-wrap h-auto gap-1 border border-white/10'>
            {itinerary.map((day) => (
              <TabsTrigger
                key={day.dayNumber}
                value={day.dayNumber.toString()}
                className='data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:font-bold font-mono text-xs px-5 py-2 rounded-xl transition-all cursor-pointer'
              >
                Day 0{day.dayNumber}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Responsive Split View: Cards (Left 7 cols) & Sticky Map (Right 5 cols) */}
          <div className='grid lg:grid-cols-12 gap-8 items-start'>

            {/* LEFT COLUMN: Activity Cards */}
            <div className='lg:col-span-7 space-y-6'>
              {itinerary.map((day) => (
                <TabsContent key={day.dayNumber} value={day.dayNumber.toString()} className='space-y-6 mt-0'>

                  {/* Day Header Box */}
                  <div className='p-6 rounded-2xl glass-dark border border-white/10 flex flex-wrap items-center justify-between gap-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-serif text-lg font-bold shadow-md gold-glow'>
                        {day.dayNumber}
                      </div>
                      <div>
                        <h3 className='font-serif text-lg font-bold text-white'>
                          Day 0{day.dayNumber}
                        </h3>
                        <p className='text-xs font-mono text-gray-400 mt-0.5'>
                          {day.activities.length} Curated Stops • Est. ₹{getDayCost(day).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-3'>
                      <button
                        type='button'
                        onClick={() => handleRegenerateDay(day.dayNumber)}
                        className='px-3.5 py-1.5 rounded-full glass border border-primary/30 hover:bg-primary/20 text-primary text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer'
                        title='Regenerate this day with fresh curated places'
                      >
                        <RotateCcw className='w-3 h-3' />
                        <span>Regenerate Day</span>
                      </button>
                    </div>

                    {day.notes && (
                      <p className='w-full text-xs font-sans text-gray-300 italic pt-2 border-t border-white/5'>
                        "{day.notes}"
                      </p>
                    )}
                  </div>

                  {/* Activity Timeline */}
                  <div className='space-y-4 relative'>
                    {day.activities.map((activity, index) => {
                      const isSelected = selectedActivityId === activity.placeId
                      return (
                        <div
                          key={activity.sequence || index}
                          id={`activity-${activity.placeId}`}
                          className='relative flex gap-4'
                        >
                          {/* Visual Connector Dot */}
                          <div className='flex flex-col items-center w-6 pt-6'>
                            <div
                              className={`w-3.5 h-3.5 rounded-full ring-4 ring-[#0a0a0a] z-10 transition-all ${isSelected ? 'bg-[#ffd700] scale-125 gold-glow-strong' : 'bg-primary gold-glow'
                                }`}
                            />
                            {index < day.activities.length - 1 && (
                              <div className='w-0.5 flex-1 bg-primary/20' />
                            )}
                          </div>

                          {/* Postcard Activity Card */}
                          <div
                            onClick={() => setSelectedActivityId(activity.placeId)}
                            className={`flex-1 rounded-2xl border p-6 shadow-md transition-all space-y-4 cursor-pointer ${isSelected
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/50 gold-glow'
                              : 'border-white/10 glass-strong hover:border-primary/40'
                              }`}
                          >
                            <div className='flex flex-wrap items-center justify-between gap-2'>
                              <div className='flex items-center gap-2'>
                                <span className='px-2.5 py-1 rounded-md bg-primary/20 text-primary font-mono text-xs font-bold border border-primary/30'>
                                  {activity.startTime} – {activity.endTime}
                                </span>
                                <span className='px-2.5 py-1 rounded-md glass text-gray-300 font-mono text-xs uppercase'>
                                  {activity.type}
                                </span>
                                <span className='text-xs font-mono text-gray-400'>
                                  Stop 0{activity.sequence || index + 1}
                                </span>
                              </div>
                              {activity.verified && (
                                <span className='inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30'>
                                  <CheckCircle2 className='w-3 h-3' /> Verified Open
                                </span>
                              )}
                            </div>

                            <div className='space-y-1.5'>
                              <h4 className='font-serif text-xl font-bold text-white'>
                                {activity.title}
                              </h4>
                              <p className='text-xs font-mono text-gray-400'>
                                📍 {activity.placeName} — {activity.address}
                              </p>
                              {activity.description && (
                                <p className='text-sm text-gray-300 leading-relaxed font-sans pt-1'>
                                  {activity.description}
                                </p>
                              )}
                            </div>

                            {/* Card Footer with ₹ Cost, Swap, Pin, Maps & Booking */}
                            <div className='pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono'>
                              <span className='text-white font-bold'>
                                Est. Cost: ₹{activity.costEstimateINR?.toLocaleString() || 'Free'}
                              </span>

                              <div className='flex flex-wrap items-center gap-2'>
                                {/* Swap Stop Trigger Button */}
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

                                {/* Pin on Map Trigger Button */}
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
                      )
                    })}

                    {/* Transport Legs Summary for Day */}
                    {day.transport && day.transport.length > 0 && (
                      <div className='mt-6 p-4 rounded-xl glass-dark border border-white/10 space-y-2'>
                        <div className='text-xs font-mono uppercase tracking-wider text-primary font-bold flex items-center gap-1.5'>
                          <span>🚖</span> Day Transit Legs (Vande Bharat / AC Cab / Auto)
                        </div>
                        {day.transport.map((t, idx) => (
                          <div key={idx} className='flex items-center justify-between text-xs font-mono text-gray-400 py-0.5'>
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

            {/* RIGHT COLUMN: Sticky Interactive Route Map */}
            <div className='lg:col-span-5 lg:sticky lg:top-24 space-y-4'>
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
