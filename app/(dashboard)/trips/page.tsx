'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Trash2,
  ExternalLink,
  Share2,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { format } from 'date-fns'

interface SavedTrip {
  id: string
  title: string
  destination: string
  start_date: string
  end_date: string
  budget_inr: number
  travelers: { adults: number; children: number }
  interests: string[]
  pace: string
  created_at?: string
  itineraries?: any[]
  itinerary?: any[]
}

const DEFAULT_DEMO_TRIP: SavedTrip = {
  id: 'sample',
  title: 'Royal Heritage & Bazaars of Jaipur',
  destination: 'Jaipur, Rajasthan',
  start_date: '2026-11-25',
  end_date: '2026-11-28',
  budget_inr: 50000,
  travelers: { adults: 2, children: 1 },
  interests: ['culture', 'food', 'photography'],
  pace: 'moderate',
  created_at: new Date().toISOString(),
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isCloudSync, setIsCloudSync] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadAllTrips()
  }, [])

  async function loadAllTrips() {
    setLoading(true)
    let fetchedTrips: SavedTrip[] = []

    // 1. Try fetching from Supabase if configured & logged in
    try {
      const { data: authData } = await supabase.auth.getUser()
      if (authData?.user) {
        setIsCloudSync(true)
        const { data, error } = await supabase
          .from('trips')
          .select('*, itineraries(*)')
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          fetchedTrips = data
        }
      }
    } catch (e) {
      console.log('Supabase check skipped or offline:', e)
    }

    // 2. Load locally stored guest trips from localStorage
    if (typeof window !== 'undefined') {
      try {
        const localData = localStorage.getItem('roamio_guest_trips')
        if (localData) {
          const parsed: SavedTrip[] = JSON.parse(localData)
          // Merge without duplicates
          const existingIds = new Set(fetchedTrips.map((t) => t.id))
          for (const item of parsed) {
            if (!existingIds.has(item.id)) {
              fetchedTrips.push(item)
            }
          }
        }
      } catch (err) {
        console.error('Error loading local trips:', err)
      }
    }

    // If no trips found at all, show the sample trip so user sees a rich card
    if (fetchedTrips.length === 0) {
      fetchedTrips = [DEFAULT_DEMO_TRIP]
    }

    setTrips(fetchedTrips)
    setLoading(false)
  }

  async function deleteTrip(id: string) {
    if (!confirm('Are you sure you want to remove this journey from your dossier?')) return

    // Remove from Supabase if connected
    try {
      await supabase.from('trips').delete().eq('id', id)
    } catch {}

    // Remove from localStorage
    if (typeof window !== 'undefined') {
      try {
        const localData = localStorage.getItem('roamio_guest_trips')
        if (localData) {
          const parsed = JSON.parse(localData).filter((t: any) => t.id !== id)
          localStorage.setItem('roamio_guest_trips', JSON.stringify(parsed))
        }
        sessionStorage.removeItem('roamio_trip_' + id)
      } catch {}
    }

    setTrips((prev) => prev.filter((t) => t.id !== id))
  }

  function handleShare(id: string) {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/trips/${id}`
      navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2500)
    }
  }

  function calculateDuration(start: string, end: string) {
    try {
      const s = new Date(start)
      const e = new Date(end)
      const diffTime = Math.abs(e.getTime() - s.getTime())
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return days > 0 ? days : 1
    } catch {
      return 2
    }
  }

  if (loading) {
    return (
      <div className='min-h-[500px] flex flex-col items-center justify-center gap-3 text-primary font-mono text-sm'>
        <div className='w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin' />
        <span>Retrieving Journey Dossiers...</span>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto space-y-8 pb-16'>
      
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6'>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <span className='font-mono text-xs uppercase tracking-widest text-primary font-bold'>
              Traveler Dossier
            </span>
            <span className='text-xs font-mono px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-300'>
              {isCloudSync ? '✦ Cloud Synced' : '✦ Guest / Local Cache'}
            </span>
          </div>
          <h1 className='font-serif text-3xl sm:text-4xl font-bold text-white'>
            Saved <span className='text-gold-shine'>Journeys</span>
          </h1>
          <p className='text-xs sm:text-sm text-gray-400 mt-1'>
            {trips.length} curated domestic itinerary {trips.length === 1 ? 'ready' : 'ready for departure'}.
          </p>
        </div>

        <Link href='/new'>
          <Button className='bg-primary text-black font-semibold text-sm px-6 py-2.5 rounded-full shadow-md gold-glow hover:bg-primary/90 gap-2 cursor-pointer'>
            <Plus className='w-4 h-4' />
            <span>Plan New Journey</span>
          </Button>
        </Link>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <div className='rounded-3xl border border-white/10 glass-dark p-12 text-center space-y-4 max-w-lg mx-auto'>
          <Compass className='w-12 h-12 mx-auto text-primary/60' />
          <h3 className='font-serif text-xl font-bold text-white'>No Saved Journeys Yet</h3>
          <p className='text-xs text-gray-400 leading-relaxed'>
            Design a custom, budget-aware domestic Indian travel itinerary grounded in Google Places and curated pacing.
          </p>
          <div className='pt-2'>
            <Link href='/new'>
              <Button className='bg-primary text-black font-semibold text-xs px-6 py-2 rounded-full gold-glow'>
                Start Your First Trip
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {trips.map((trip) => {
            const days = calculateDuration(trip.start_date, trip.end_date)
            return (
              <div
                key={trip.id}
                className='group rounded-3xl border border-white/10 glass-strong overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between'
              >
                {/* Card Top */}
                <div className='p-6 space-y-4'>
                  
                  {/* Badge & Dates */}
                  <div className='flex items-center justify-between text-xs font-mono'>
                    <span className='px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold'>
                      {days} Days Journey
                    </span>
                    <span className='text-gray-400 flex items-center gap-1'>
                      <Calendar className='w-3.5 h-3.5 text-primary/70' />
                      {format(new Date(trip.start_date), 'MMM d')} – {format(new Date(trip.end_date), 'MMM d, yyyy')}
                    </span>
                  </div>

                  {/* Title & Destination */}
                  <div>
                    <h3 className='font-serif text-xl font-bold text-white group-hover:text-gold-shine transition-colors'>
                      {trip.title}
                    </h3>
                    <p className='text-xs text-gray-400 flex items-center gap-1.5 mt-1'>
                      <MapPin className='w-3.5 h-3.5 text-primary' />
                      {trip.destination}
                    </p>
                  </div>

                  {/* Budget & Travelers specs */}
                  <div className='grid grid-cols-2 gap-3 pt-3 border-t border-white/10 font-mono text-xs'>
                    <div>
                      <span className='text-[10px] text-gray-500 block uppercase'>Target Budget</span>
                      <span className='font-bold text-emerald-400 flex items-center gap-0.5 mt-0.5'>
                        <IndianRupee className='w-3.5 h-3.5' />
                        {trip.budget_inr ? trip.budget_inr.toLocaleString() : '50,000'}
                      </span>
                    </div>
                    <div>
                      <span className='text-[10px] text-gray-500 block uppercase'>Party</span>
                      <span className='font-medium text-gray-200 flex items-center gap-1 mt-0.5'>
                        <Users className='w-3.5 h-3.5 text-gray-400' />
                        {trip.travelers?.adults || 1} Adult{trip.travelers?.adults !== 1 ? 's' : ''}
                        {trip.travelers?.children ? `, ${trip.travelers.children} Kid` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Interest Chips */}
                  {trip.interests && trip.interests.length > 0 && (
                    <div className='flex flex-wrap gap-1.5 pt-1'>
                      {trip.interests.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className='px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-gray-300'
                        >
                          {item}
                        </span>
                      ))}
                      {trip.interests.length > 3 && (
                        <span className='text-[10px] font-mono text-gray-500 self-center'>
                          +{trip.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                </div>

                {/* Card Actions Footer */}
                <div className='px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-2'>
                  <Link
                    href={`/trips/${trip.id}`}
                    className='flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-black font-semibold text-xs gold-glow hover:bg-primary/90 transition-all'
                  >
                    <span>View Itinerary</span>
                    <ExternalLink className='w-3.5 h-3.5' />
                  </Link>

                  <button
                    type='button'
                    onClick={() => handleShare(trip.id)}
                    className='p-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer'
                    title='Share Itinerary Link'
                  >
                    {copiedId === trip.id ? (
                      <Check className='w-4 h-4 text-emerald-400' />
                    ) : (
                      <Share2 className='w-4 h-4' />
                    )}
                  </button>

                  <button
                    type='button'
                    onClick={() => deleteTrip(trip.id)}
                    className='p-2 rounded-xl border border-white/15 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all cursor-pointer'
                    title='Delete Journey'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
