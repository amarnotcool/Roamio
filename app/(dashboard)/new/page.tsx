'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  Bot,
} from 'lucide-react'
import { TripFormData } from '@/lib/types'

const CURATED_DESTINATIONS = [
  {
    name: 'Jaipur, Rajasthan',
    tag: 'Pink City, Forts & Royal Bazaars',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    typicalBudget: 45000,
  },
  {
    name: 'Alleppey, Kerala',
    tag: 'Monsoon Backwaters & Shikaras',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
    typicalBudget: 50000,
  },
  {
    name: 'Old Manali, Himachal',
    tag: 'Cedar Forests & Mountain Solitude',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
    typicalBudget: 38000,
  },
  {
    name: 'South Goa & Fontainhas',
    tag: 'Latin Quarters, Cafes & Coast',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
    typicalBudget: 55000,
  },
  {
    name: 'Udaipur, Rajasthan',
    tag: 'Lake Palaces & Sunset Ghats',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80',
    typicalBudget: 60000,
  },
  {
    name: 'Rishikesh, Uttarakhand',
    tag: 'Ganga Aarti, Yoga & River Trails',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
    typicalBudget: 32000,
  },
]

const PARTY_TYPES = [
  { id: 'family', label: 'Family Vacation', desc: 'Child-friendly pacing & leisurely stops', defaultAdults: 2, defaultKids: 1 },
  { id: 'couple', label: 'Couple Escapade', desc: 'Romantic sunsets, heritage stays & fine dining', defaultAdults: 2, defaultKids: 0 },
  { id: 'friends', label: 'Friends Group', desc: 'Active explorations, cafes & shared transit', defaultAdults: 4, defaultKids: 0 },
  { id: 'solo', label: 'Solo Wanderer', desc: 'Contemplative walks, flexibility & deep culture', defaultAdults: 1, defaultKids: 0 },
]

const PACES = [
  {
    value: 'relaxed',
    title: 'Unhurried & Slow',
    sights: '2 key sights/day',
    desc: 'Late morning starts, long relaxed meals, afternoon rest, zero rush.',
  },
  {
    value: 'moderate',
    title: 'Balanced',
    sights: '3–4 sights/day',
    desc: 'The golden mean. Iconic landmarks in morning, vibrant bazaars by dusk.',
  },
  {
    value: 'packed',
    title: 'Immersive & Active',
    sights: '4–5 sights/day',
    desc: 'Sunrise-to-sunset exploration for travelers wanting to see it all.',
  },
]

const INTEREST_OPTIONS = [
  { id: 'culture', label: 'Forts & Royal Heritage', icon: '🏰' },
  { id: 'food', label: 'Regional Street Food & Thalis', icon: '🍲' },
  { id: 'nature', label: 'Backwaters, Lakes & Flora', icon: '🌴' },
  { id: 'adventure', label: 'Himalayan Trails & Kayaking', icon: '🏔️' },
  { id: 'shopping', label: 'Bazaars, Handlooms & Spices', icon: '🛍️' },
  { id: 'wellness', label: 'Ayurveda, Yoga & Ghats', icon: '🧘' },
  { id: 'photography', label: 'Golden Hour Viewpoints', icon: '📸' },
  { id: 'family', label: 'Kid-Friendly Activities', icon: '👨‍👩‍👧' },
]

const BUDGET_PRESETS = [30000, 50000, 85000, 150000, 250000]

const DURATION_PRESETS = [
  { label: 'Weekend', days: 2 },
  { label: 'Long Weekend', days: 3 },
  { label: 'Extended Escape', days: 5 },
  { label: 'Full Week', days: 7 },
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
    startDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    budgetINR: 50000,
    travelers: { adults: 2, children: 1 },
    interests: ['culture', 'food', 'photography'],
    pace: 'moderate',
  })

  const [selectedPartyType, setSelectedPartyType] = useState('family')
  const [generating, setGenerating] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState('Consulting Google Places database...')
  const [error, setError] = useState('')

  // Pre-fill destination from query param if available
  useEffect(() => {
    const destParam = searchParams.get('dest')
    if (destParam) {
      const decoded = decodeURIComponent(destParam).trim()
      if (decoded) {
        setFormData((prev) => ({
          ...prev,
          destination: decoded,
          title: `${decoded.split(',')[0]} Vacation`,
        }))
      }
    }
  }, [searchParams])

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

  return (
    <div className='max-w-4xl mx-auto space-y-8 pb-16'>
      
      {/* Step Header & Progress */}
      <div className='space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4'>
          <div>
            <span className='font-mono text-xs uppercase tracking-widest text-primary font-bold'>
              Trip Planning Studio
            </span>
            <h1 className='font-serif text-3xl sm:text-4xl font-bold text-white mt-1'>
              Design Your <span className='text-gold-shine'>Journey</span>
            </h1>
          </div>
          <div className='flex items-center gap-2 font-mono text-xs text-gray-400'>
            <span>Step 0{step} of 0{totalSteps}</span>
            <span className='text-gray-600'>•</span>
            <span className='text-primary font-bold'>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
        </div>

        {/* Golden Progress Bar */}
        <div className='grid grid-cols-4 gap-2'>
          {[
            { num: 1, title: 'Destination' },
            { num: 2, title: 'Dates & Party' },
            { num: 3, title: 'Budget & Pace' },
            { num: 4, title: 'Flavors & Review' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`h-2 rounded-full transition-all duration-300 ${
                s.num <= step
                  ? 'bg-primary gold-glow'
                  : 'bg-white/10'
              } ${s.num < step ? 'cursor-pointer hover:opacity-80' : ''}`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className='p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-sm font-sans flex items-center gap-2'>
          <span>✕</span>
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: DESTINATION */}
      {step === 1 && (
        <div className='space-y-6'>
          <div className='space-y-2'>
            <h2 className='font-serif text-2xl font-bold text-white'>
              Where would you like to explore?
            </h2>
            <p className='text-sm text-gray-400'>
              Select from curated luxury domestic retreats or type any destination across India.
            </p>
          </div>

          {/* Search Input */}
          <div className='relative'>
            <MapPin className='w-5 h-5 absolute left-4 top-4 text-primary' />
            <Input
              value={formData.destination}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  destination: e.target.value,
                  title: `${e.target.value.split(',')[0]} Vacation`,
                }))
                setError('')
              }}
              placeholder='e.g., Jaipur, Munnar, Goa, Udaipur, Coorg, Hampi'
              className='pl-12 h-14 text-base glass-strong border-white/15 focus:border-primary/60 text-white rounded-2xl'
            />
          </div>

          {/* Destination Cards */}
          <div className='space-y-3 pt-2'>
            <label className='text-xs font-mono uppercase tracking-wider text-gray-400'>
              ✦ Handpicked Domestic Retreats
            </label>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {CURATED_DESTINATIONS.map((d) => {
                const isSelected = formData.destination.toLowerCase().includes(d.name.split(',')[0].toLowerCase())
                return (
                  <div
                    key={d.name}
                    onClick={() => handleDestinationSelect(d.name, d.typicalBudget)}
                    className={`group relative rounded-2xl overflow-hidden border p-3 cursor-pointer transition-all duration-300 glass-dark ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30 gold-glow scale-[1.02]'
                        : 'border-white/10 hover:border-primary/40'
                    }`}
                  >
                    <div className='aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-black relative'>
                      <img
                        src={d.image}
                        alt={d.name}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                      />
                      {isSelected && (
                        <div className='absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center text-xs shadow-md'>
                          <Check className='w-3.5 h-3.5 stroke-[3]' />
                        </div>
                      )}
                    </div>
                    <div className='font-serif font-bold text-base text-white'>
                      {d.name}
                    </div>
                    <p className='text-xs text-gray-400 mt-0.5 line-clamp-1'>
                      {d.tag}
                    </p>
                    <div className='mt-2 text-xs font-mono text-primary font-semibold'>
                      From ₹{(d.typicalBudget).toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: DATES & PARTY */}
      {step === 2 && (
        <div className='space-y-8'>
          <div className='space-y-2'>
            <h2 className='font-serif text-2xl font-bold text-white'>
              When are you traveling, and who is joining?
            </h2>
            <p className='text-sm text-gray-400'>
              We calibrate opening hours, dining ambiance, and pacing for your exact party.
            </p>
          </div>

          {/* Dates Card */}
          <div className='p-6 rounded-3xl border border-white/10 glass-strong space-y-4'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <span className='font-mono text-xs uppercase tracking-wider text-gray-400'>
                Trip Duration
              </span>
              <span className='font-mono text-xs px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold'>
                {tripDays} Days ({tripDays > 1 ? tripDays - 1 : 0} Nights)
              </span>
            </div>

            {/* Quick Duration Presets */}
            <div className='flex flex-wrap gap-2 pt-1'>
              <span className='text-xs font-mono text-gray-400 self-center mr-1'>Presets:</span>
              {DURATION_PRESETS.map((dp) => (
                <button
                  key={dp.days}
                  type='button'
                  onClick={() => applyDurationPreset(dp.days)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    tripDays === dp.days
                      ? 'bg-primary text-black font-bold border-primary shadow-sm gold-glow'
                      : 'glass border-white/10 text-gray-300 hover:border-primary/40'
                  }`}
                >
                  {dp.label} ({dp.days}D)
                </button>
              ))}
            </div>

            <div className='grid sm:grid-cols-2 gap-4 pt-2'>
              <div className='space-y-2'>
                <Label className='text-xs font-mono text-gray-400'>Start Date</Label>
                <Input
                  type='date'
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  className='h-12 rounded-xl glass border-white/15 text-white'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-xs font-mono text-gray-400'>End Date</Label>
                <Input
                  type='date'
                  value={formData.endDate}
                  min={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  className='h-12 rounded-xl glass border-white/15 text-white'
                />
              </div>
            </div>
          </div>

          {/* Travel Party Archetypes */}
          <div className='space-y-4'>
            <Label className='text-xs font-mono uppercase tracking-wider text-gray-400'>
              Travel Party Type
            </Label>
            <div className='grid sm:grid-cols-2 gap-4'>
              {PARTY_TYPES.map((p) => {
                const isSelected = selectedPartyType === p.id
                return (
                  <div
                    key={p.id}
                    onClick={() => handlePartyTypeSelect(p.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 gold-glow'
                        : 'border-white/10 glass-dark hover:border-white/20'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='font-serif font-bold text-base text-white'>
                        {p.label}
                      </div>
                      {isSelected && <Check className='w-4 h-4 text-primary' />}
                    </div>
                    <p className='text-xs text-gray-400 mt-1 font-sans'>
                      {p.desc}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Custom Counters */}
            <div className='p-5 rounded-2xl border border-white/10 glass-dark flex flex-wrap items-center justify-between gap-4'>
              <div className='flex items-center gap-6'>
                <div>
                  <span className='text-xs font-mono text-gray-400 block'>Adults</span>
                  <div className='flex items-center gap-3 mt-1'>
                    <button
                      type='button'
                      onClick={() => setFormData(prev => ({ ...prev, travelers: { ...prev.travelers, adults: Math.max(1, prev.travelers.adults - 1) } }))}
                      className='w-8 h-8 rounded-lg glass border border-white/15 text-white flex items-center justify-center font-bold hover:bg-white/10 cursor-pointer'
                    >-</button>
                    <span className='font-mono font-bold text-base w-6 text-center text-white'>{formData.travelers.adults}</span>
                    <button
                      type='button'
                      onClick={() => setFormData(prev => ({ ...prev, travelers: { ...prev.travelers, adults: Math.min(10, prev.travelers.adults + 1) } }))}
                      className='w-8 h-8 rounded-lg glass border border-white/15 text-white flex items-center justify-center font-bold hover:bg-white/10 cursor-pointer'
                    >+</button>
                  </div>
                </div>

                <div>
                  <span className='text-xs font-mono text-gray-400 block'>Children</span>
                  <div className='flex items-center gap-3 mt-1'>
                    <button
                      type='button'
                      onClick={() => setFormData(prev => ({ ...prev, travelers: { ...prev.travelers, children: Math.max(0, prev.travelers.children - 1) } }))}
                      className='w-8 h-8 rounded-lg glass border border-white/15 text-white flex items-center justify-center font-bold hover:bg-white/10 cursor-pointer'
                    >-</button>
                    <span className='font-mono font-bold text-base w-6 text-center text-white'>{formData.travelers.children}</span>
                    <button
                      type='button'
                      onClick={() => setFormData(prev => ({ ...prev, travelers: { ...prev.travelers, children: Math.min(8, prev.travelers.children + 1) } }))}
                      className='w-8 h-8 rounded-lg glass border border-white/15 text-white flex items-center justify-center font-bold hover:bg-white/10 cursor-pointer'
                    >+</button>
                  </div>
                </div>
              </div>

              <div className='text-xs font-mono text-gray-400'>
                Total Party: <strong className='text-white'>{formData.travelers.adults + formData.travelers.children} Travelers</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: BUDGET & PACE */}
      {step === 3 && (
        <div className='space-y-8'>
          <div className='space-y-2'>
            <h2 className='font-serif text-2xl font-bold text-white'>
              Set Your Budget Guardrails & Travel Pace
            </h2>
            <p className='text-sm text-gray-400'>
              Every rupee is strictly accounted for. No surprise costs or unrealistic itineraries.
            </p>
          </div>

          {/* Budget Card */}
          <div className='p-6 sm:p-8 rounded-3xl border border-white/10 glass-strong space-y-6'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <div>
                <span className='font-mono text-xs uppercase tracking-wider text-primary font-bold'>
                  Total Trip Budget (INR)
                </span>
                <div className='font-mono text-3xl sm:text-4xl font-bold text-white mt-1'>
                  ₹{formData.budgetINR.toLocaleString()}
                </div>
              </div>
              <div className='text-right'>
                <span className='font-mono text-xs text-gray-400 block'>Daily Allowance</span>
                <span className='font-mono text-lg font-bold text-emerald-400'>
                  ~₹{dailyBudget.toLocaleString()}/day
                </span>
              </div>
            </div>

            {/* Tactile Range Slider */}
            <div className='space-y-2 pt-2'>
              <div className='flex items-center justify-between text-xs font-mono text-gray-400'>
                <span>₹15,000</span>
                <span className='text-primary font-bold'>Drag to Adjust</span>
                <span>₹3,00,000</span>
              </div>
              <input
                type='range'
                min={15000}
                max={300000}
                step={5000}
                value={formData.budgetINR}
                onChange={(e) => setFormData((prev) => ({ ...prev, budgetINR: Number(e.target.value) }))}
                className='w-full h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#d4a574]'
              />
            </div>

            {/* Quick Presets */}
            <div className='space-y-2 pt-2'>
              <span className='text-xs font-mono text-gray-400'>Quick Presets:</span>
              <div className='flex flex-wrap gap-2'>
                {BUDGET_PRESETS.map((amt) => (
                  <button
                    key={amt}
                    type='button'
                    onClick={() => setFormData((prev) => ({ ...prev, budgetINR: amt }))}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                      formData.budgetINR === amt
                        ? 'bg-primary text-black font-bold shadow-md gold-glow'
                        : 'glass border border-white/15 text-gray-300 hover:border-primary/50'
                    }`}
                  >
                    ₹{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className='space-y-2 pt-2'>
              <Label className='text-xs font-mono text-gray-400'>Exact Budget (₹)</Label>
              <Input
                type='number'
                min={5000}
                step={2000}
                value={formData.budgetINR}
                onChange={(e) => setFormData((prev) => ({ ...prev, budgetINR: Math.max(1000, parseInt(e.target.value) || 0) }))}
                className='h-12 rounded-xl glass border-white/15 text-white font-mono text-base'
              />
            </div>
          </div>

          {/* Travel Pace */}
          <div className='space-y-3'>
            <Label className='text-xs font-mono uppercase tracking-wider text-gray-400'>
              Desired Daily Pace
            </Label>
            <div className='grid sm:grid-cols-3 gap-4'>
              {PACES.map((p) => {
                const isSelected = formData.pace === p.value
                return (
                  <div
                    key={p.value}
                    onClick={() => setFormData((prev) => ({ ...prev, pace: p.value as any }))}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 gold-glow'
                        : 'border-white/10 glass-dark hover:border-white/20'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='font-serif font-bold text-base text-white'>
                        {p.title}
                      </div>
                      {isSelected && <Check className='w-4 h-4 text-primary' />}
                    </div>
                    <div className='font-mono text-xs font-bold text-primary mt-1'>
                      {p.sights}
                    </div>
                    <p className='text-xs text-gray-400 mt-2 font-sans leading-relaxed'>
                      {p.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: FLAVORS & REVIEW */}
      {step === 4 && (
        <div className='space-y-8'>
          <div className='space-y-2'>
            <h2 className='font-serif text-2xl font-bold text-white'>
              Select Your Travel Flavors & Review Plan
            </h2>
            <p className='text-sm text-gray-400'>
              Tailor the AI prompt to focus on what your party loves most.
            </p>
          </div>

          {/* Interest Chips */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label className='text-xs font-mono uppercase tracking-wider text-gray-400'>
                Interests & Experiences (Select all that apply)
              </Label>
              <button
                type='button'
                onClick={() => setFormData(prev => ({ ...prev, interests: INTEREST_OPTIONS.map(i => i.id) }))}
                className='text-xs font-mono text-primary hover:underline cursor-pointer'
              >
                Select All
              </button>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              {INTEREST_OPTIONS.map((opt) => {
                const isSelected = formData.interests.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    type='button'
                    onClick={() => toggleInterest(opt.id)}
                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/15 text-white gold-glow'
                        : 'border-white/10 glass-dark text-gray-300 hover:border-primary/40'
                    }`}
                  >
                    <span className='text-xl'>{opt.icon}</span>
                    <span className='text-xs font-medium'>{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Luxury Review Ticket */}
          <div className='rounded-3xl border border-primary/30 glass-strong overflow-hidden gold-glow'>
            <div className='bg-primary/15 px-6 py-3.5 border-b border-primary/20 flex items-center justify-between'>
              <span className='font-mono text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-2'>
                ✦ Confirmed Itinerary Dossier
              </span>
              <span className='font-mono text-xs text-gray-400'>Ready to Generate</span>
            </div>

            <div className='p-6 space-y-4'>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono'>
                <div>
                  <span className='text-gray-500 block'>Destination</span>
                  <span className='font-bold text-white'>{formData.destination}</span>
                </div>
                <div>
                  <span className='text-gray-500 block'>Duration</span>
                  <span className='font-bold text-white'>{tripDays} Days</span>
                </div>
                <div>
                  <span className='text-gray-500 block'>Party</span>
                  <span className='font-bold text-white'>
                    {formData.travelers.adults} Adults, {formData.travelers.children} Kids
                  </span>
                </div>
                <div>
                  <span className='text-gray-500 block'>Target Budget</span>
                  <span className='font-bold text-emerald-400'>
                    ₹{formData.budgetINR.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className='pt-3 border-t border-white/10 text-xs font-sans text-gray-400 flex flex-wrap items-center justify-between gap-2'>
                <span className='flex items-center gap-1.5'>
                  <ShieldCheck className='w-4 h-4 text-emerald-400' /> Google Places opening hours verified
                </span>
                <span className='font-mono text-primary'>
                  Pace: {formData.pace.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className='flex items-center justify-between pt-6 border-t border-white/10'>
        {step > 1 ? (
          <Button
            type='button'
            variant='outline'
            onClick={() => setStep(step - 1)}
            disabled={generating}
            className='glass border-white/20 text-white hover:bg-white/10 text-sm gap-1.5 rounded-full px-6 py-2.5 cursor-pointer'
          >
            <ChevronLeft className='w-4 h-4' />
            Previous
          </Button>
        ) : (
          <div />
        )}

        {step < totalSteps ? (
          <Button
            type='button'
            onClick={() => setStep(step + 1)}
            className='bg-primary text-black font-semibold text-sm px-7 py-2.5 rounded-full shadow-md gold-glow hover:bg-primary/90 gap-1.5 cursor-pointer'
          >
            Next Step
            <ChevronRight className='w-4 h-4' />
          </Button>
        ) : (
          <Button
            type='button'
            onClick={handleGenerateItinerary}
            disabled={generating}
            className='bg-primary text-black font-bold text-base px-8 py-3 rounded-full shadow-xl gold-glow-strong hover:bg-primary/90 gap-2 cursor-pointer'
          >
            {generating ? (
              <span className='flex items-center gap-2'>
                <span className='w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin' />
                {loadingPhase}
              </span>
            ) : (
              <>
                Generate Itinerary with AI
                <ArrowRight className='w-5 h-5' />
              </>
            )}
          </Button>
        )}
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
