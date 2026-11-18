'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Compass,
  Clock,
  Heart,
  UserCheck,
  Palmtree,
  Camera,
  Utensils,
  Sun,
  Flame,
  CloudSun,
} from 'lucide-react'
import { TripFormData } from '@/lib/types'

const CURATED_DESTINATIONS = [
  {
    name: 'Jaipur, Rajasthan',
    tag: 'Pink City, Mirrored Forts & Royal Bazaars',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    typicalBudget: 50000,
    season: 'Nov – Mar (Best Season)',
  },
  {
    name: 'Alleppey, Kerala',
    tag: 'Monsoon Backwaters, Private Shikaras & Spices',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    typicalBudget: 55000,
    season: 'Sep – Mar (Lush & Serene)',
  },
  {
    name: 'Udaipur, Rajasthan',
    tag: 'Marble Palaces, Shimmering Lakes & Sunset Ghats',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    typicalBudget: 60000,
    season: 'Oct – Mar (Royal Royalty)',
  },
  {
    name: 'Old Manali, Himachal',
    tag: 'Whispering Cedar Groves & Himalayan Solitude',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    typicalBudget: 38000,
    season: 'Apr – Jun & Dec (Snow / Crisp Air)',
  },
  {
    name: 'South Goa & Fontainhas',
    tag: 'Latin Quarters, Artisan Cafes & Secluded Coast',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    typicalBudget: 55000,
    season: 'Nov – Feb (Golden Sun)',
  },
  {
    name: 'Rishikesh, Uttarakhand',
    tag: 'Ganga Aarti Twilight, Yoga Sanctuaries & Rapids',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    typicalBudget: 35000,
    season: 'Oct – Apr (Serene Spirit)',
  },
]

const PARTY_TYPES = [
  {
    id: 'family',
    label: 'Family Vacation',
    icon: '👨‍👩‍👧',
    desc: 'Child-friendly pacing, verified family dining & private AC transport.',
    defaultAdults: 2,
    defaultKids: 1,
  },
  {
    id: 'couple',
    label: 'Romantic Escape',
    icon: '🥂',
    desc: 'Secluded sunset viewpoints, heritage stays & candlelit courtyard dinners.',
    defaultAdults: 2,
    defaultKids: 0,
  },
  {
    id: 'friends',
    label: 'Curators & Friends',
    icon: '🌿',
    desc: 'Vibrant bazaars, artisan handlooms, street cafes & lively social pacing.',
    defaultAdults: 4,
    defaultKids: 0,
  },
  {
    id: 'solo',
    label: 'Solo Wanderer',
    icon: '🧭',
    desc: 'Contemplative architectural walks, secret stepwells & unhurried freedom.',
    defaultAdults: 1,
    defaultKids: 0,
  },
]

const PACES = [
  {
    value: 'relaxed',
    title: 'Unhurried & Slow',
    sights: '2 key stops / day',
    desc: 'Late morning departures, long leisurely meals, afternoon haveli rest, zero rush.',
  },
  {
    value: 'moderate',
    title: 'Balanced & Curated',
    sights: '3–4 stops / day',
    desc: 'The golden mean. Iconic palace monuments in morning, artisan bazaars by dusk.',
  },
  {
    value: 'packed',
    title: 'Immersive Exploration',
    sights: '4–5 stops / day',
    desc: 'Sunrise-to-dusk choreography for travelers seeking to experience every hidden gem.',
  },
]

const INTEREST_OPTIONS = [
  { id: 'culture', label: 'Forts & Royal Havelis', icon: '🏰' },
  { id: 'food', label: 'Royal Thalis & Street Eats', icon: '🍲' },
  { id: 'nature', label: 'Backwaters, Lakes & Flora', icon: '🌴' },
  { id: 'adventure', label: 'Himalayan Trails & Kayaks', icon: '🏔️' },
  { id: 'shopping', label: 'Bazaars & Handblock Prints', icon: '🛍️' },
  { id: 'wellness', label: 'Ayurveda, Yoga & Ghats', icon: '🧘' },
  { id: 'photography', label: 'Golden Hour Viewpoints', icon: '📸' },
  { id: 'family', label: 'Child-Friendly Leisure', icon: '👨‍👩‍👧' },
]

const BUDGET_TIERS = [
  {
    amount: 35000,
    label: 'Boutique Heritage',
    desc: 'Cozy boutique havelis, authentic street cafes & reliable private autos.',
  },
  {
    amount: 50000,
    label: 'Curated Luxury',
    desc: 'Charming royal stays, premier thali feasts, rooftop chai & private AC sedan.',
  },
  {
    amount: 85000,
    label: 'Palace Experiential',
    desc: 'Heritage suites, fine dining courtyards, personal guides & private chauffeur.',
  },
  {
    amount: 150000,
    label: 'Royal Bespoke VIP',
    desc: 'Legendary palace hotels, private shikara charters, exclusive curator access.',
  },
]

const DURATION_PRESETS = [
  { label: 'Weekend', days: 2, note: 'Quick rejuvenation' },
  { label: 'Long Weekend', days: 3, note: 'The quintessential escape' },
  { label: 'Extended Escape', days: 5, note: 'Deep cultural immersion' },
  { label: 'Grand Tour', days: 7, note: 'Comprehensive regional discovery' },
]

function TripStudioContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const totalSteps = 4

  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    destination: 'Jaipur, Rajasthan',
    startDate: '2026-11-25',
    endDate: '2026-11-28',
    budgetINR: 50000,
    travelers: {
      adults: 2,
      children: 1,
    },
    interests: ['culture', 'food', 'photography'],
    pace: 'moderate',
  })

  const [selectedPartyType, setSelectedPartyType] = useState('family')
  const [generating, setGenerating] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const destParam = searchParams.get('dest')
    if (destParam) {
      const match = CURATED_DESTINATIONS.find((d) =>
        d.name.toLowerCase().includes(destParam.toLowerCase())
      )
      if (match) {
        setFormData((prev) => ({
          ...prev,
          destination: match.name,
          title: `${match.name.split(',')[0]} Journey`,
          budgetINR: match.typicalBudget,
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          destination: destParam,
          title: `${destParam.split(',')[0]} Journey`,
        }))
      }
    }
  }, [searchParams])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const tripDays = Math.max(
    1,
    Math.ceil(
      (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  )

  const dailyBudget = Math.floor(formData.budgetINR / tripDays)

  function handleDestinationSelect(destName: string, defaultBudget?: number) {
    setFormData((prev) => ({
      ...prev,
      destination: destName,
      title: `${destName.split(',')[0]} Vacation`,
      budgetINR: defaultBudget || prev.budgetINR,
    }))
    setError('')
  }

  function handlePartyTypeSelect(typeId: string) {
    setSelectedPartyType(typeId)
    const party = PARTY_TYPES.find((p) => p.id === typeId)
    if (party) {
      setFormData((prev) => ({
        ...prev,
        travelers: { adults: party.defaultAdults, children: party.defaultKids },
      }))
    }
  }

  function applyDurationPreset(days: number) {
    const start = new Date(formData.startDate)
    if (isNaN(start.getTime())) return
    const end = new Date(start.getTime() + 86400000 * (days - 1))
    setFormData((prev) => ({
      ...prev,
      endDate: end.toISOString().split('T')[0],
    }))
  }

  function toggleInterest(interestId: string) {
    setFormData((prev) => {
      const exists = prev.interests.includes(interestId)
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interestId)
          : [...prev.interests, interestId],
      }
    })
  }

  async function handleGenerateItinerary() {
    setGenerating(true)
    setError('')

    try {
      setLoadingPhase('Verifying place hours and ratings on Google Places...')
      await new Promise((r) => setTimeout(r, 600))

      setLoadingPhase('Choreographing realistic transit legs & times...')
      await new Promise((r) => setTimeout(r, 500))

      setLoadingPhase('Balancing daily budget in ₹ Indian Rupees...')

      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to generate itinerary')

      let tripId = 'guest_' + Date.now()

      try {
        const { data: authData } = await supabase.auth.getUser()
        if (authData?.user) {
          const { data: tripRow, error: tripErr } = await supabase
            .from('trips')
            .insert({
              user_id: authData.user.id,
              title: formData.title || `${formData.destination.split(',')[0]} Trip`,
              destination: formData.destination,
              start_date: formData.startDate,
              end_date: formData.endDate,
              budget_inr: formData.budgetINR,
              travelers: formData.travelers,
              interests: formData.interests,
              pace: formData.pace,
            })
            .select()
            .single()

          if (!tripErr && tripRow) {
            tripId = tripRow.id
            const itineraryRows = result.itinerary.dayPlans.map((day: any) => ({
              trip_id: tripRow.id,
              day_number: day.dayNumber,
              date: day.date,
              activities: day.activities,
              transport: day.transport,
              notes: day.notes,
            }))
            await supabase.from('itineraries').insert(itineraryRows)
          }
        }
      } catch {
        // Guest mode fallback
      }

      if (typeof window !== 'undefined') {
        const guestTrip = {
          id: tripId,
          title: formData.title || `${formData.destination.split(',')[0]} Trip`,
          destination: formData.destination,
          start_date: formData.startDate,
          end_date: formData.endDate,
          budget_inr: formData.budgetINR,
          travelers: formData.travelers,
          interests: formData.interests,
          pace: formData.pace,
          itinerary: result.itinerary.dayPlans,
        }
        sessionStorage.setItem('roamio_trip_' + tripId, JSON.stringify(guestTrip))
        try {
          const stored = JSON.parse(localStorage.getItem('roamio_guest_trips') || '[]')
          localStorage.setItem('roamio_guest_trips', JSON.stringify([guestTrip, ...stored.filter((t: any) => t.id !== tripId)]))
        } catch {}
      }

      router.push(`/trips/${tripId}`)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while generating itinerary')
      setGenerating(false)
    }
  }

  // Active Destination Image Lookup for Live Dossier Preview
  const matchedDest = CURATED_DESTINATIONS.find((d) =>
    formData.destination.toLowerCase().includes(d.name.split(',')[0].toLowerCase())
  ) || CURATED_DESTINATIONS[0]

  return (
    <div className='max-w-7xl mx-auto space-y-10 pb-20'>
      
      {/* Editorial Header & Minimalist Stepper */}
      <div className='space-y-4 border-b border-white/10 pb-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <span className='font-mono text-xs uppercase tracking-widest text-primary font-bold block mb-1'>
              Couture Travel Atelier
            </span>
            <h1 className='font-serif text-3xl sm:text-5xl font-bold text-white'>
              Design Your <span className='text-gold-shine'>Journey</span>
            </h1>
          </div>

          <div className='flex items-center gap-3 font-mono text-xs text-gray-400'>
            <span className='px-3 py-1 rounded-full stamp-badge text-primary font-bold'>
              Step 0{step} of 0{totalSteps}
            </span>
            <span>·</span>
            <span>{Math.round((step / totalSteps) * 100)}% Curated</span>
          </div>
        </div>

        {/* Minimalist Foil Step Indicator */}
        <div className='grid grid-cols-4 gap-2 pt-2'>
          {[
            { num: 1, title: 'Destination' },
            { num: 2, title: 'Dates & Party' },
            { num: 3, title: 'Budget & Rhythm' },
            { num: 4, title: 'Review Dossier' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className='space-y-1.5 cursor-pointer group'
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  s.num <= step
                    ? 'bg-primary gold-glow'
                    : 'bg-white/10 group-hover:bg-white/20'
                }`}
              />
              <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                s.num === step ? 'text-primary font-bold' : 'text-gray-500'
              }`}>
                0{s.num}. {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className='p-4 rounded-2xl bg-red-950/40 border border-red-800 text-red-300 text-sm font-sans flex items-center gap-3'>
          <span className='text-lg'>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* LIVING SPLIT-CANVAS: 7 COLS CONSULTATION / 5 COLS LIVE DOSSIER PREVIEW */}
      <div className='grid lg:grid-cols-12 gap-10 items-start'>
        
        {/* LEFT COLUMN: ACTIVE STEP INPUTS */}
        <div className='lg:col-span-7 space-y-8'>
          
          {/* STEP 1: DESTINATION SELECTION */}
          {step === 1 && (
            <div className='space-y-6'>
              <div className='space-y-1.5'>
                <h2 className='font-serif text-2xl sm:text-3xl font-bold text-white'>
                  Where will your spirit wander?
                </h2>
                <p className='text-xs sm:text-sm text-gray-400'>
                  Select a handpicked royal heritage retreat or specify any destination across India.
                </p>
              </div>

              {/* Destination Search Bar */}
              <div className='relative'>
                <MapPin className='w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-primary' />
                <Input
                  value={formData.destination}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      destination: e.target.value,
                      title: `${e.target.value.split(',')[0]} Journey`,
                    }))
                    setError('')
                  }}
                  placeholder='e.g., Jaipur, Munnar, Goa, Udaipur, Coorg, Hampi'
                  className='pl-12 h-14 text-sm sm:text-base bg-[#161410] border-white/15 focus:border-primary text-white rounded-2xl'
                />
              </div>

              {/* Handpicked Destinations Cards */}
              <div className='space-y-3 pt-2'>
                <span className='text-xs font-mono uppercase tracking-widest text-primary/80 font-bold block'>
                  ✦ Handpicked Domestic Retreats
                </span>
                
                <div className='grid sm:grid-cols-2 gap-4'>
                  {CURATED_DESTINATIONS.map((d) => {
                    const isSelected = formData.destination.toLowerCase().includes(d.name.split(',')[0].toLowerCase())
                    return (
                      <div
                        key={d.name}
                        onClick={() => handleDestinationSelect(d.name, d.typicalBudget)}
                        className={`group relative rounded-3xl overflow-hidden border p-3.5 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/40 gold-glow'
                            : 'border-white/10 glass-strong hover:border-primary/40'
                        }`}
                      >
                        <div className='aspect-[16/10] rounded-2xl overflow-hidden mb-3 bg-black relative'>
                          <Image
                            src={d.image}
                            alt={d.name}
                            fill
                            className='object-cover group-hover:scale-105 transition-transform duration-700'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent' />
                          
                          <div className='absolute bottom-2.5 left-2.5 z-10'>
                            <span className='text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30'>
                              {d.season}
                            </span>
                          </div>

                          {isSelected && (
                            <div className='absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center text-xs shadow-md'>
                              <Check className='w-3.5 h-3.5 stroke-[3]' />
                            </div>
                          )}
                        </div>

                        <div className='font-serif font-bold text-lg text-white group-hover:text-gold-shine transition-colors'>
                          {d.name}
                        </div>
                        <p className='text-xs text-gray-400 mt-1 line-clamp-1'>
                          {d.tag}
                        </p>
                        <div className='mt-2.5 flex items-center justify-between text-xs font-mono'>
                          <span className='text-gray-500 uppercase text-[10px]'>Typical Spend</span>
                          <span className='text-emerald-400 font-bold'>
                            From ₹{d.typicalBudget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATES, SEASONALITY & TRAVEL PARTY */}
          {step === 2 && (
            <div className='space-y-8'>
              
              <div className='space-y-1.5'>
                <h2 className='font-serif text-2xl sm:text-3xl font-bold text-white'>
                  When are you traveling, and who is joining?
                </h2>
                <p className='text-xs sm:text-sm text-gray-400'>
                  We choreograph opening hours, daylight pacing, and transport for your exact party.
                </p>
              </div>

              {/* Duration Presets as Boarding Tokens */}
              <div className='p-6 rounded-3xl border border-[rgba(212,165,116,0.25)] glass-strong space-y-5 gold-glow'>
                
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-mono uppercase tracking-widest text-primary font-bold flex items-center gap-2'>
                    <Calendar className='w-4 h-4' /> Journey Duration
                  </span>
                  <span className='font-serif text-sm font-bold text-white px-3 py-1 rounded-full bg-primary/20 border border-primary/30'>
                    {tripDays} Days ({tripDays > 1 ? tripDays - 1 : 0} Nights)
                  </span>
                </div>

                {/* Preset Chips */}
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5'>
                  {DURATION_PRESETS.map((dp) => {
                    const isSelected = tripDays === dp.days
                    return (
                      <button
                        key={dp.days}
                        type='button'
                        onClick={() => applyDurationPreset(dp.days)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-black font-bold border-primary shadow-md gold-glow'
                            : 'glass border-white/10 text-gray-300 hover:border-primary/40'
                        }`}
                      >
                        <div className='text-xs font-mono font-bold'>{dp.label}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-black/80' : 'text-gray-500'}`}>
                          {dp.days} Full Days
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Calendar Date Pickers */}
                <div className='grid sm:grid-cols-2 gap-4 pt-2 border-t border-white/10'>
                  <div className='space-y-2'>
                    <Label className='text-xs font-mono text-gray-300 flex items-center gap-1.5'>
                      <span>Departure Date</span>
                    </Label>
                    <Input
                      type='date'
                      value={formData.startDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                      className='h-12 rounded-xl bg-black/50 border-white/15 text-white font-mono text-xs focus:border-primary'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label className='text-xs font-mono text-gray-300 flex items-center gap-1.5'>
                      <span>Return Date</span>
                    </Label>
                    <Input
                      type='date'
                      value={formData.endDate}
                      min={formData.startDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                      className='h-12 rounded-xl bg-black/50 border-white/15 text-white font-mono text-xs focus:border-primary'
                    />
                  </div>
                </div>

                {/* Seasonality Tip */}
                <div className='p-3 rounded-xl bg-[#2d4a3e]/30 border border-[#2d4a3e]/60 text-xs font-sans text-emerald-300 flex items-center gap-2'>
                  <CloudSun className='w-4 h-4 text-emerald-400 flex-shrink-0' />
                  <span>
                    Optimal Season: November – March offers pleasant 22°C–26°C daytime temperatures and cool palace evenings.
                  </span>
                </div>

              </div>

              {/* Travel Party Archetypes */}
              <div className='space-y-4'>
                <span className='text-xs font-mono uppercase tracking-widest text-primary font-bold block'>
                  Select Travel Party Archetype
                </span>

                <div className='grid sm:grid-cols-2 gap-4'>
                  {PARTY_TYPES.map((p) => {
                    const isSelected = selectedPartyType === p.id
                    return (
                      <div
                        key={p.id}
                        onClick={() => handlePartyTypeSelect(p.id)}
                        className={`p-5 rounded-3xl border cursor-pointer transition-all duration-300 space-y-2 ${
                          isSelected
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/40 gold-glow'
                            : 'border-white/10 glass-strong hover:border-primary/40'
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2.5'>
                            <span className='text-2xl'>{p.icon}</span>
                            <span className='font-serif font-bold text-base text-white'>
                              {p.label}
                            </span>
                          </div>
                          {isSelected && <Check className='w-4 h-4 text-primary' />}
                        </div>
                        <p className='text-xs text-gray-400 font-sans leading-relaxed'>
                          {p.desc}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Tactile Counters for Adults & Children */}
                <div className='p-6 rounded-3xl border border-white/10 glass-strong flex flex-wrap items-center justify-between gap-6'>
                  <div className='flex items-center gap-8'>
                    <div>
                      <span className='text-xs font-mono text-gray-400 block uppercase'>Adults (Age 12+)</span>
                      <div className='flex items-center gap-3 mt-2'>
                        <button
                          type='button'
                          onClick={() => setFormData((prev) => ({ ...prev, travelers: { ...prev.travelers, adults: Math.max(1, prev.travelers.adults - 1) } }))}
                          className='w-9 h-9 rounded-xl glass border border-white/20 text-white flex items-center justify-center font-bold text-lg hover:border-primary cursor-pointer'
                        >–</button>
                        <span className='font-serif font-bold text-xl w-6 text-center text-white'>
                          {formData.travelers.adults}
                        </span>
                        <button
                          type='button'
                          onClick={() => setFormData((prev) => ({ ...prev, travelers: { ...prev.travelers, adults: Math.min(10, prev.travelers.adults + 1) } }))}
                          className='w-9 h-9 rounded-xl glass border border-white/20 text-white flex items-center justify-center font-bold text-lg hover:border-primary cursor-pointer'
                        >+</button>
                      </div>
                    </div>

                    <div className='border-l border-white/10 pl-8'>
                      <span className='text-xs font-mono text-gray-400 block uppercase'>Children (Under 12)</span>
                      <div className='flex items-center gap-3 mt-2'>
                        <button
                          type='button'
                          onClick={() => setFormData((prev) => ({ ...prev, travelers: { ...prev.travelers, children: Math.max(0, prev.travelers.children - 1) } }))}
                          className='w-9 h-9 rounded-xl glass border border-white/20 text-white flex items-center justify-center font-bold text-lg hover:border-primary cursor-pointer'
                        >–</button>
                        <span className='font-serif font-bold text-xl w-6 text-center text-white'>
                          {formData.travelers.children}
                        </span>
                        <button
                          type='button'
                          onClick={() => setFormData((prev) => ({ ...prev, travelers: { ...prev.travelers, children: Math.min(8, prev.travelers.children + 1) } }))}
                          className='w-9 h-9 rounded-xl glass border border-white/20 text-white flex items-center justify-center font-bold text-lg hover:border-primary cursor-pointer'
                        >+</button>
                      </div>
                    </div>
                  </div>

                  <div className='text-right font-mono text-xs text-gray-400'>
                    <span>Total Party: </span>
                    <strong className='font-serif text-lg text-white ml-1'>
                      {formData.travelers.adults + formData.travelers.children} Travelers
                    </strong>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* STEP 3: BUDGET TIERS & DAILY RHYTHM */}
          {step === 3 && (
            <div className='space-y-8'>
              <div className='space-y-1.5'>
                <h2 className='font-serif text-2xl sm:text-3xl font-bold text-white'>
                  What is your target budget and daily pace?
                </h2>
                <p className='text-xs sm:text-sm text-gray-400'>
                  We balance activities, entry permits, dining, and private transit within your exact target.
                </p>
              </div>

              {/* Budget Tiers */}
              <div className='space-y-4'>
                <span className='text-xs font-mono uppercase tracking-widest text-primary font-bold block'>
                  Select Experience Tier (Total Ground Budget)
                </span>

                <div className='grid sm:grid-cols-2 gap-4'>
                  {BUDGET_TIERS.map((tier) => {
                    const isSelected = formData.budgetINR === tier.amount
                    return (
                      <div
                        key={tier.amount}
                        onClick={() => setFormData((prev) => ({ ...prev, budgetINR: tier.amount }))}
                        className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/40 gold-glow'
                            : 'border-white/10 glass-strong hover:border-primary/40'
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <span className='font-serif text-xl font-bold text-white'>
                            ₹{tier.amount.toLocaleString()}
                          </span>
                          <span className='px-2.5 py-0.5 rounded-full stamp-badge text-[10px] text-primary font-bold'>
                            {tier.label}
                          </span>
                        </div>
                        <p className='text-xs text-gray-400 font-sans leading-relaxed'>
                          {tier.desc}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Pacing Architecture */}
              <div className='space-y-4'>
                <span className='text-xs font-mono uppercase tracking-widest text-primary font-bold block'>
                  Daily Touring Rhythm & Pace
                </span>

                <div className='grid sm:grid-cols-3 gap-4'>
                  {PACES.map((p) => {
                    const isSelected = formData.pace === p.value
                    return (
                      <div
                        key={p.value}
                        onClick={() => setFormData((prev) => ({ ...prev, pace: p.value as any }))}
                        className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-2 ${
                          isSelected
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/40 gold-glow'
                            : 'border-white/10 glass-strong hover:border-primary/40'
                        }`}
                      >
                        <div className='font-serif font-bold text-base text-white'>
                          {p.title}
                        </div>
                        <div className='text-[11px] font-mono text-primary font-bold'>
                          {p.sights}
                        </div>
                        <p className='text-xs text-gray-400 font-sans leading-relaxed'>
                          {p.desc}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: FLAVORS, INTERESTS & REVIEW */}
          {step === 4 && (
            <div className='space-y-8'>
              <div className='space-y-1.5'>
                <h2 className='font-serif text-2xl sm:text-3xl font-bold text-white'>
                  What flavors and passions inspire this trip?
                </h2>
                <p className='text-xs sm:text-sm text-gray-400'>
                  Select the pillars that will shape your itinerary stops and dining selections.
                </p>
              </div>

              {/* Interest Chips */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {INTEREST_OPTIONS.map((opt) => {
                  const isSelected = formData.interests.includes(opt.id)
                  return (
                    <button
                      key={opt.id}
                      type='button'
                      onClick={() => toggleInterest(opt.id)}
                      className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary bg-primary/15 text-white gold-glow ring-2 ring-primary/30'
                          : 'border-white/10 glass-strong text-gray-300 hover:border-primary/40'
                      }`}
                    >
                      <span className='text-2xl'>{opt.icon}</span>
                      <span className='text-xs font-medium'>{opt.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Final Dossier Summary */}
              <div className='p-6 sm:p-8 rounded-3xl border border-primary/30 glass-strong space-y-4 gold-glow'>
                <div className='flex items-center justify-between border-b border-primary/20 pb-3'>
                  <span className='font-mono text-xs uppercase tracking-widest text-primary font-bold flex items-center gap-2'>
                    ✦ Dossier Ready for Choreography
                  </span>
                  <span className='text-xs font-mono text-emerald-400 flex items-center gap-1'>
                    <ShieldCheck className='w-4 h-4' /> Verified Pacing
                  </span>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono'>
                  <div>
                    <span className='text-gray-500 block uppercase text-[10px]'>Destination</span>
                    <span className='font-serif text-base font-bold text-white'>{formData.destination}</span>
                  </div>
                  <div>
                    <span className='text-gray-500 block uppercase text-[10px]'>Duration</span>
                    <span className='font-serif text-base font-bold text-white'>{tripDays} Days</span>
                  </div>
                  <div>
                    <span className='text-gray-500 block uppercase text-[10px]'>Party</span>
                    <span className='font-serif text-base font-bold text-white'>
                      {formData.travelers.adults} Adults, {formData.travelers.children} Kids
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-500 block uppercase text-[10px]'>Budget Cap</span>
                    <span className='font-serif text-base font-bold text-emerald-400'>
                      ₹{formData.budgetINR.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Footer */}
          <div className='flex items-center justify-between pt-6 border-t border-white/10'>
            {step > 1 ? (
              <Button
                type='button'
                variant='outline'
                onClick={() => setStep(step - 1)}
                disabled={generating}
                className='glass border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm rounded-full px-6 py-2.5 cursor-pointer flex items-center gap-1.5'
              >
                <ChevronLeft className='w-4 h-4' />
                <span>Previous</span>
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                type='button'
                onClick={() => setStep(step + 1)}
                className='bg-primary text-black font-semibold text-xs sm:text-sm px-8 py-2.5 rounded-full shadow-md gold-glow hover:bg-primary/90 flex items-center gap-2 cursor-pointer'
              >
                <span>Continue</span>
                <ChevronRight className='w-4 h-4' />
              </Button>
            ) : (
              <Button
                type='button'
                onClick={handleGenerateItinerary}
                disabled={generating}
                className='bg-primary text-black font-bold text-sm sm:text-base px-9 py-3 rounded-full shadow-2xl gold-glow-strong hover:bg-primary/90 flex items-center gap-2 cursor-pointer'
              >
                {generating ? (
                  <span className='flex items-center gap-2'>
                    <span className='w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin' />
                    <span>{loadingPhase}</span>
                  </span>
                ) : (
                  <>
                    <span>Choreograph Bespoke Itinerary</span>
                    <Sparkles className='w-4 h-4' />
                  </>
                )}
              </Button>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: STICKY LIVING DOSSIER PREVIEW */}
        <div className='lg:col-span-5 lg:sticky lg:top-28 space-y-4'>
          
          <div className='rounded-3xl border border-[rgba(212,165,116,0.25)] glass-strong overflow-hidden shadow-2xl gold-glow'>
            
            {/* Visual Destination Header */}
            <div className='relative h-60 w-full overflow-hidden bg-black/60'>
              <Image
                src={matchedDest.image}
                alt={matchedDest.name}
                fill
                className='object-cover scale-105'
                priority
              />
              <div className='absolute inset-0 bg-gradient-to-t from-[#161410] via-black/40 to-transparent' />
              
              <div className='absolute top-4 left-4 z-10'>
                <span className='px-3 py-1 rounded-full stamp-badge text-[10px] font-mono font-bold text-primary'>
                  ✦ Live Dossier Preview
                </span>
              </div>

              <div className='absolute bottom-4 left-4 right-4 z-10'>
                <div className='flex items-center gap-1.5 text-xs font-mono text-primary'>
                  <MapPin className='w-3.5 h-3.5' /> {formData.destination}
                </div>
                <h3 className='font-serif text-2xl font-bold text-white'>
                  {matchedDest.name.split(',')[0]} Exploration
                </h3>
              </div>
            </div>

            {/* Live Dossier Summary Body */}
            <div className='p-6 space-y-4 text-xs font-mono'>
              
              <div className='grid grid-cols-2 gap-3 pb-3 border-b border-white/10'>
                <div>
                  <span className='text-gray-500 block uppercase text-[10px]'>Duration</span>
                  <span className='font-serif text-base font-bold text-white mt-0.5 block'>
                    {tripDays} Days ({tripDays > 1 ? tripDays - 1 : 0} Nights)
                  </span>
                </div>
                <div>
                  <span className='text-gray-500 block uppercase text-[10px]'>Travel Dates</span>
                  <span className='text-gray-200 mt-0.5 block truncate'>
                    {formData.startDate} – {formData.endDate}
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3 pb-3 border-b border-white/10'>
                <div>
                  <span className='text-gray-500 block uppercase text-[10px]'>Party Style</span>
                  <span className='text-gray-200 mt-0.5 block'>
                    {formData.travelers.adults} Adults, {formData.travelers.children} Kids
                  </span>
                </div>
                <div>
                  <span className='text-gray-500 block uppercase text-[10px]'>Target Budget</span>
                  <span className='font-serif text-base font-bold text-emerald-400 mt-0.5 block'>
                    ₹{formData.budgetINR.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className='space-y-1.5 pb-3 border-b border-white/10'>
                <span className='text-gray-500 block uppercase text-[10px]'>Daily Rhythm</span>
                <div className='flex items-center justify-between text-gray-300'>
                  <span className='capitalize font-bold text-primary'>{formData.pace} Pace</span>
                  <span>~₹{dailyBudget.toLocaleString()}/day</span>
                </div>
              </div>

              <div className='pt-1 text-[11px] font-sans text-gray-400 flex items-center gap-2'>
                <ShieldCheck className='w-4 h-4 text-emerald-400 flex-shrink-0' />
                <span>Google Places hours and route choreography active.</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default function NewTripPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-[400px] flex items-center justify-center text-primary font-mono text-sm'>
          Loading Trip Studio...
        </div>
      }
    >
      <TripStudioContent />
    </Suspense>
  )
}
