'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

const DESTINATION_HERO_MAP: Record<string, string> = {
  jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
  udaipur: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
  rishikesh: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
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

    if (fetchedTrips.length === 0) {
      fetchedTrips = [DEFAULT_DEMO_TRIP]
    }

    setTrips(fetchedTrips)
    setLoading(false)
  }

  async function deleteTrip(id: string) {
    if (!confirm('Are you sure you want to remove this trip?')) return

    try {
      await supabase.from('trips').delete().eq('id', id)
    } catch {}

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

  function getDestinationImage(destination: string) {
    const dest = destination.toLowerCase()
    if (dest.includes('jaipur')) return DESTINATION_HERO_MAP.jaipur
    if (dest.includes('kerala') || dest.includes('alleppey')) return DESTINATION_HERO_MAP.kerala
    if (dest.includes('goa')) return DESTINATION_HERO_MAP.goa
    if (dest.includes('manali')) return DESTINATION_HERO_MAP.manali
    if (dest.includes('udaipur')) return DESTINATION_HERO_MAP.udaipur
    if (dest.includes('rishikesh')) return DESTINATION_HERO_MAP.rishikesh
    return DESTINATION_HERO_MAP.jaipur
  }

  if (loading) {
    return (
      <div className='min-h-[500px] flex flex-col items-center justify-center gap-3 text-primary font-mono text-sm'>
        <div className='w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin' />
        <span>Loading Your Trips...</span>
      </div>
    )
  }

  return (
    <div className='max-w-7xl mx-auto space-y-10 pb-20'>
      
      {/* Editorial Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6'>
        <div>
          <span className='font-mono text-xs uppercase tracking-widest text-primary font-bold block mb-1'>
            The Traveler's Collection
          </span>
          <h1 className='font-serif text-3xl sm:text-5xl font-bold text-white'>
            Saved <span className='text-gold-shine'>Journeys</span>
          </h1>
          <p className='text-xs sm:text-sm text-gray-400 mt-1 font-sans'>
            {trips.length} curated domestic itinerary {trips.length === 1 ? 'ready for departure' : 'ready for departure'}.
          </p>
        </div>

        <Link href='/new'>
          <Button className='bg-primary text-black font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-md gold-glow hover:bg-primary/90 gap-2 cursor-pointer'>
            <Plus className='w-4 h-4' />
            <span>Design New Journey</span>
          </Button>
        </Link>
      </div>

      {/* Postcard Boarding Pass Grid */}
      {trips.length === 0 ? (
        <div className='rounded-3xl border border-white/10 glass-dark p-12 text-center space-y-4 max-w-lg mx-auto'>
          <Compass className='w-12 h-12 mx-auto text-primary/60' />
          <h3 className='font-serif text-xl font-bold text-white'>Your Dossier Is Empty</h3>
          <p className='text-xs text-gray-400 leading-relaxed'>
            Begin your next journey with curated pacing, verified Google Places opening hours, and balanced budgets in ₹ INR.
          </p>
          <div className='pt-2'>
            <Link href='/new'>
              <Button className='bg-primary text-black font-semibold text-xs px-6 py-2 rounded-full gold-glow'>
                Start Planning
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {trips.map((trip) => {
            const days = calculateDuration(trip.start_date, trip.end_date)
            const photoUrl = getDestinationImage(trip.destination)

            return (
              <div
                key={trip.id}
                className='group rounded-3xl border border-[rgba(212,165,116,0.2)] glass-strong overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl flex flex-col sm:flex-row'
              >
                {/* Left Thumbnail Vignette */}
                <div className='relative sm:w-56 h-48 sm:h-auto overflow-hidden bg-black/60 flex-shrink-0'>
                  <Image
                    src={photoUrl}
                    alt={trip.destination}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-700'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#161410] via-black/30 to-transparent' />
                  
                  <div className='absolute top-3 left-3 z-10'>
                    <span className='px-3 py-1 rounded-full stamp-badge text-[10px] font-mono font-bold text-primary'>
                      {days} Days Dossier
                    </span>
                  </div>
                </div>

                {/* Right Postcard Information */}
                <div className='p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4'>
                  
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between text-xs font-mono text-gray-400'>
                      <span className='text-primary/90 flex items-center gap-1 font-bold'>
                        <MapPin className='w-3.5 h-3.5' /> {trip.destination}
                      </span>
                      <span className='text-[11px]'>
                        {format(new Date(trip.start_date), 'MMM d')} – {format(new Date(trip.end_date), 'MMM d, yyyy')}
                      </span>
                    </div>

                    <h3 className='font-serif text-2xl font-bold text-white group-hover:text-gold-shine transition-colors leading-snug'>
                      {trip.title}
                    </h3>
                  </div>

                  {/* Specs: Target Budget & Party */}
                  <div className='grid grid-cols-2 gap-3 pt-3 border-t border-white/10 font-mono text-xs'>
                    <div>
                      <span className='text-[10px] text-gray-500 block uppercase'>Target Budget</span>
                      <span className='font-serif text-base font-bold text-emerald-400 block mt-0.5'>
                        ₹{trip.budget_inr ? trip.budget_inr.toLocaleString() : '50,000'}
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

                  {/* Interest Badges */}
                  {trip.interests && trip.interests.length > 0 && (
                    <div className='flex flex-wrap gap-1.5 pt-1'>
                      {trip.interests.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className='px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase bg-white/5 border border-white/10 text-gray-300'
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='pt-3 border-t border-white/10 flex items-center justify-between gap-2'>
                    <Link
                      href={`/trips/${trip.id}`}
                      className='flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-black font-semibold text-xs gold-glow hover:bg-primary/90 transition-all'
                    >
                      <span>Open Dossier</span>
                      <ExternalLink className='w-3.5 h-3.5' />
                    </Link>

                    <button
                      type='button'
                      onClick={() => handleShare(trip.id)}
                      className='p-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer'
                      title='Share Journey Link'
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
                      className='p-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all cursor-pointer'
                      title='Delete Trip'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>

                </div>

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
