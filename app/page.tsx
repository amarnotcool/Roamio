'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Bot,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Compass,
  MapPin,
  Calendar,
  IndianRupee,
  Clock,
  ChevronDown,
} from 'lucide-react'

const featuredLocations = [
  {
    name: 'Udaipur',
    region: 'Rajasthan',
    description: 'Serene marble palaces floating on shimmering lakes, secluded courtyards, and sunset boat rides.',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&h=1000&fit=crop&q=80',
    budget: '₹48,000 for 2',
  },
  {
    name: 'Alleppey & Marari',
    region: 'Kerala Backwaters',
    description: 'Emerald waterways under arched coconut palms, private shikara journeys, and traditional coastal feasts.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=1000&fit=crop&q=80',
    budget: '₹42,000 for 2',
  },
  {
    name: 'Old Manali',
    region: 'Himachal Pradesh',
    description: 'Whispering cedar groves, secluded boutique chalets, and crisp Himalayan mountain morning air.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=1000&fit=crop&q=80',
    budget: '₹35,000 for 2',
  },
]

const demoScenarios = [
  {
    id: 'jaipur',
    label: 'Jaipur Heritage',
    prompt: '4 days in Jaipur with family. Forts, bazaars, authentic thali. Budget: ₹50,000.',
    highlight: 'Amer Fort · Sheesh Mahal (09:00 AM)',
    status: 'Verified Open',
    estBudget: '₹38,200',
    buffer: '₹11,800 Reserve Buffer',
    destQuery: 'Jaipur, Rajasthan',
  },
  {
    id: 'alleppey',
    label: 'Kerala Backwaters',
    prompt: '3 days in Alleppey & Marari. Private houseboat, toddy shop cuisine & beach sunset. Budget: ₹45,000.',
    highlight: 'Vembanad Lake Shikara Cruise (15:30 PM)',
    status: 'Verified Pier',
    estBudget: '₹32,600',
    buffer: '₹12,400 Reserve Buffer',
    destQuery: 'Alleppey, Kerala',
  },
  {
    id: 'manali',
    label: 'Manali Solitude',
    prompt: '5 days in Old Manali & Solang. Cozy mountain cafes, cedar forests & apple orchards. Budget: ₹35,000.',
    highlight: 'Jogini Waterfalls & Vashisht Hot Springs (10:00 AM)',
    status: 'Verified Trail',
    estBudget: '₹26,800',
    buffer: '₹8,200 Reserve Buffer',
    destQuery: 'Old Manali, Himachal',
  },
]

export default function HomePage() {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('features')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDemoIndex, setActiveDemoIndex] = useState(0)

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const target = searchQuery.trim()
    if (target) {
      router.push(`/new?dest=${encodeURIComponent(target)}`)
    } else {
      router.push('/new')
    }
  }

  const activeDemo = demoScenarios[activeDemoIndex]

  return (
    <div className='flex flex-col min-h-screen bg-[#0a0a0a] text-[#f5f5f5] overflow-x-hidden selection:bg-[#d4a574]/30 selection:text-white'>
      
      {/* ==================================================================== */}
      {/* 100% VW IMMERSIVE HERO SECTION (Warm Sunset Pagoda & Editorial Type) */}
      {/* ==================================================================== */}
      <section className='relative w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[760px] flex flex-col justify-between overflow-hidden'>
        
        {/* Full-bleed Background Photograph: Kyoto Pagoda at Sunset */}
        <Image
          src='https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=2400&q=85'
          alt='Kyoto Pagoda at Sunset'
          fill
          priority
          sizes='100vw'
          className='object-cover object-[center_right] sm:object-center'
        />

        {/* Warm Golden-Hour Sunset Sky Gradient Overlay */}
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            background:
              'linear-gradient(180deg, rgba(248, 230, 210, 0.94) 0%, rgba(244, 212, 184, 0.72) 28%, rgba(220, 148, 100, 0.28) 52%, rgba(10, 10, 10, 0.94) 92%, #0a0a0a 100%)',
          }}
        />

        {/* Golden Sun Flare Glow (Left Basin) */}
        <div
          className='absolute inset-0 pointer-events-none opacity-90'
          style={{
            background:
              'radial-gradient(ellipse 70% 65% at 14% 52%, rgba(255, 230, 185, 0.85) 0%, rgba(248, 202, 150, 0.35) 45%, transparent 75%)',
          }}
        />

        {/* Top Floating Navigation Bar (Full bleed 100vw container, max-w-7xl content) */}
        <header className='w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-6 sm:pt-8 flex items-center justify-between relative z-30'>
          
          {/* Brand Wordmark */}
          <Link href='/' className='flex items-center gap-1.5 group'>
            <span className='font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#1C1917]'>
              Roamio
            </span>
            <span className='w-1.5 h-1.5 rounded-full bg-[#D97742] mb-1' />
          </Link>

          {/* Centered Translucent Pill Navigation */}
          <nav className='hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/35 backdrop-blur-md border border-white/40 shadow-sm'>
            <button
              type='button'
              onClick={() => setActiveNav('features')}
              className={`text-xs font-semibold px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeNav === 'features'
                  ? 'bg-white/95 text-[#1C1917] shadow-xs'
                  : 'text-[#3D352E] hover:text-[#1C1917]'
              }`}
            >
              Features
            </button>
            <button
              type='button'
              onClick={() => {
                setActiveNav('navigation')
                document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`text-xs font-semibold px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeNav === 'navigation'
                  ? 'bg-white/95 text-[#1C1917] shadow-xs'
                  : 'text-[#3D352E] hover:text-[#1C1917]'
              }`}
            >
              Navigation
            </button>
            <button
              type='button'
              onClick={() => {
                setActiveNav('prices')
                document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`text-xs font-semibold px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeNav === 'prices'
                  ? 'bg-white/95 text-[#1C1917] shadow-xs'
                  : 'text-[#3D352E] hover:text-[#1C1917]'
              }`}
            >
              Prices
            </button>
            <button
              type='button'
              onClick={() => {
                setActiveNav('stories')
                router.push('/trips')
              }}
              className={`text-xs font-semibold px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeNav === 'stories'
                  ? 'bg-white/95 text-[#1C1917] shadow-xs'
                  : 'text-[#3D352E] hover:text-[#1C1917]'
              }`}
            >
              Stories
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className='flex items-center gap-3 sm:gap-4'>
            <Link
              href='/login'
              className='text-xs font-semibold text-[#1C1917] hover:opacity-75 transition-opacity px-2'
            >
              Log in
            </Link>

            <Link
              href='/new'
              className='bg-gradient-to-r from-[#D97742] to-[#C25E2E] hover:from-[#E2834E] hover:to-[#CF6938] text-white text-xs font-semibold px-4 sm:px-5 py-2 rounded-full shadow-md transition-all cursor-pointer'
            >
              Sign Up
            </Link>
          </div>

        </header>

        {/* Left-Aligned Editorial Headline & Subtitle */}
        <div className='w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-20 my-auto py-12 sm:py-16'>
          <div className='max-w-2xl space-y-2'>
            
            {/* Headline matching reference image exactly */}
            <h1 className='font-serif text-4xl sm:text-5xl lg:text-[4rem] font-normal tracking-tight text-[#1C1917] leading-[1.14]'>
              <span className='block sm:whitespace-nowrap'>Every journey has a story.</span>
              <span className='block font-normal mt-0.5 sm:whitespace-nowrap'>
                Let&apos;s write yours.
              </span>
            </h1>

            {/* Subtitle */}
            <p className='text-xs sm:text-sm text-[#4A3F35] font-sans max-w-md leading-relaxed pt-2 pb-5'>
              Every journey has a story, crafted with care inside detailed editorial collection.
            </p>

            {/* Frosted Terracotta CTA Button */}
            <div>
              <Link
                href='/new'
                className='bg-gradient-to-r from-[#D97742]/90 to-[#C25E2E]/90 hover:from-[#E2834E] hover:to-[#CF6938] text-white font-medium text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg border border-white/20 transition-all cursor-pointer inline-flex items-center gap-2 backdrop-blur-xs'
              >
                <span>Landing Page</span>
              </Link>
            </div>

          </div>
        </div>

        {/* Carousel Slider Indicator Dots (Bottom Center) */}
        <div className='w-full pb-8 z-20 flex items-center justify-center gap-1.5 pointer-events-none'>
          <span className='w-1.5 h-1.5 rounded-full bg-white/40' />
          <span className='w-5 h-1.5 rounded-full bg-white/90 shadow-xs' />
          <span className='w-1.5 h-1.5 rounded-full bg-white/40' />
        </div>

      </section>

      {/* FEATURED DESTINATIONS */}
      <section id='destinations' className='py-28 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 relative z-10'>
          
          {/* Section Header */}
          <div className='text-center mb-16'>
            <div className='inline-flex items-center gap-1.5 mb-4 py-1.5 px-4 glass border border-primary/30 text-primary font-mono text-xs rounded-full'>
              ✦ Handpicked Domestic Retreats
            </div>
            <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 font-serif'>
              Featured <span className='text-gold-shine'>Locations</span>
            </h2>
            <p className='text-lg text-gray-400 max-w-xl mx-auto'>
              Grounded, verified journeys curated for Indian domestic travelers
            </p>
          </div>

          {/* Cards Grid */}
          <div className='grid gap-8 md:grid-cols-3'>
            {featuredLocations.map((location, index) => (
              <div
                key={index}
                className='group relative h-[520px] rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2'
              >
                {/* Background Image */}
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-700 group-hover:scale-110'
                />

                {/* Dark Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />

                {/* Glassmorphic Floating Card */}
                <div className='absolute inset-x-4 bottom-4 glass-strong rounded-2xl p-6 border border-white/10 transition-all duration-500 group-hover:border-primary/50 group-hover:gold-glow'>
                  <div className='flex items-center justify-between mb-2'>
                    <p className='text-primary text-xs font-mono font-bold uppercase tracking-wider'>
                      {location.region}
                    </p>
                    <span className='text-xs font-mono text-gray-300 bg-white/10 px-2.5 py-0.5 rounded-full'>
                      {location.budget}
                    </span>
                  </div>

                  <h3 className='text-2xl font-bold text-white mb-2 font-serif'>
                    {location.name}
                  </h3>

                  <p className='text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-2'>
                    {location.description}
                  </p>

                  <Link
                    href={`/new?dest=${encodeURIComponent(location.name)}`}
                    className='w-full py-3 px-6 rounded-full glass border border-primary/50 text-primary text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary hover:text-black transition-all duration-300'
                  >
                    <span>Plan This Trip</span>
                    <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* AI TRAVEL CONCIERGE HIGHLIGHT */}
      <section id='concierge' className='py-32 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a]'>
        
        {/* Ambient Gold Glow Orbs */}
        <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none' />

        <div className='max-w-7xl mx-auto px-4 sm:px-6 relative z-10'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-20 items-center'>
            
            {/* Left Content */}
            <div>
              <div className='inline-flex items-center gap-1.5 mb-6 py-2 px-4 glass border border-primary/30 text-primary font-mono text-xs rounded-full'>
                <Sparkles className='mr-2 h-3.5 w-3.5' /> Grounded AI Intelligence
              </div>

              <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white font-serif'>
                Your Personal <br />
                <span className='text-gold-shine'>Travel Concierge</span>
              </h2>

              <p className='text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed font-sans'>
                Tell Roamio where you want to go. Our engine verifies opening hours against Google Places, calculates realistic transit, and generates verified day plans — in seconds.
              </p>

              {/* Bullet Features */}
              <ul className='space-y-4 mb-10'>
                {[
                  'Verified opening hours & pricing tiers via Google Places',
                  'Strict INR (₹) daily cost limits & budget guardrails',
                  'Realistic Indian transit legs (AC cabs, Vande Bharat, autos)',
                  'Offline-ready PWA: accessible without network on the road',
                ].map((item, i) => (
                  <li key={i} className='flex items-start gap-3'>
                    <div className='h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5'>
                      <CheckCircle2 className='h-3.5 w-3.5 text-primary' strokeWidth={3} />
                    </div>
                    <span className='text-gray-200 font-medium text-sm sm:text-base'>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/new?dest=${encodeURIComponent(activeDemo.destQuery)}`}
                className='inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-black font-semibold text-base hover:bg-primary/90 transition-all duration-300 shadow-md gold-glow'
              >
                <span>Try AI Itinerary Studio</span>
                <Bot className='w-5 h-5' />
              </Link>
            </div>

            {/* Right Interactive Chat / Itinerary Simulation */}
            <div className='relative'>
              <div className='relative glass-strong rounded-3xl p-6 sm:p-8 shadow-2xl border border-primary/25 gold-glow'>
                
                {/* Header */}
                <div className='flex items-center justify-between mb-4 pb-4 border-b border-white/10'>
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xs'>
                      <Bot className='h-5 w-5 text-black' />
                    </div>
                    <div>
                      <p className='font-bold text-sm text-white'>Roamio Concierge</p>
                      <p className='text-xs text-gray-400'>Google Places Grounded AI</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-400 font-mono'>
                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' /> Verified
                  </div>
                </div>

                {/* Scenario Selectors (Clickable demo tabs) */}
                <div className='flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none'>
                  {demoScenarios.map((scenario, sIdx) => {
                    const isActive = sIdx === activeDemoIndex
                    return (
                      <button
                        key={scenario.id}
                        type='button'
                        onClick={() => setActiveDemoIndex(sIdx)}
                        className={`text-xs font-mono px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? 'bg-primary text-black font-bold shadow-md gold-glow'
                            : 'glass border border-white/10 text-gray-300 hover:border-primary/50'
                        }`}
                      >
                        {scenario.label}
                      </button>
                    )
                  })}
                </div>

                {/* Messages */}
                <div className='space-y-4'>
                  <div className='flex gap-3'>
                    <div className='h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0'>
                      <Bot className='h-4 w-4 text-primary' />
                    </div>
                    <div className='glass-dark p-4 rounded-2xl rounded-tl-md max-w-[340px]'>
                      <p className='text-xs sm:text-sm text-white'>
                        Where is your domestic escape taking you? Tell me destination, dates, and budget. ✨
                      </p>
                    </div>
                  </div>

                  <div className='flex gap-3 flex-row-reverse'>
                    <div className='h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shrink-0 text-white text-xs font-mono font-bold'>
                      YOU
                    </div>
                    <div className='bg-gradient-to-br from-primary to-accent p-4 rounded-2xl rounded-tr-md max-w-[340px] text-black font-medium text-xs sm:text-sm shadow-xs transition-all duration-300'>
                      {activeDemo.prompt}
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <div className='h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0'>
                      <Bot className='h-4 w-4 text-primary' />
                    </div>
                    <div className='glass-dark p-4 rounded-2xl rounded-tl-md flex-1 space-y-3'>
                      <div className='flex items-center gap-2 text-xs font-semibold text-white'>
                        <Sparkles className='h-4 w-4 text-primary animate-pulse' />
                        <span>Crafting verified day-by-day itinerary...</span>
                      </div>
                      <div className='p-3 glass rounded-xl border border-primary/30 flex items-center justify-between text-xs font-mono'>
                        <span className='text-gray-300'>{activeDemo.highlight}</span>
                        <span className='text-primary font-bold'>{activeDemo.status}</span>
                      </div>
                      <div className='p-3 glass rounded-xl border border-emerald-500/30 flex items-center justify-between text-xs font-mono bg-emerald-950/20'>
                        <span className='text-emerald-400'>Estimated Budget: {activeDemo.estBudget}</span>
                        <span className='text-emerald-300 font-bold'>{activeDemo.buffer}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-5 pt-3 border-t border-white/10 flex items-center justify-between'>
                  <span className='text-[11px] font-mono text-gray-400'>
                    Instant Plan for {activeDemo.destQuery}
                  </span>
                  <Link
                    href={`/new?dest=${encodeURIComponent(activeDemo.destQuery)}`}
                    className='text-xs font-mono text-primary font-bold hover:underline flex items-center gap-1'
                  >
                    Load in Studio →
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BUDGET COMPASS SECTION */}
      <section id='budget' className='py-28 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] border-t border-white/10'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6'>
          
          <div className='glass-strong rounded-3xl p-8 sm:p-12 border border-primary/25 gold-glow space-y-8'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
              <div>
                <span className='font-mono text-xs uppercase tracking-widest text-primary font-bold'>
                  Financial Precision
                </span>
                <h3 className='text-3xl sm:text-4xl font-serif font-bold text-white mt-1'>
                  The Roamio <span className='text-gold-shine'>Budget Compass</span>
                </h3>
                <p className='text-sm text-gray-400 mt-1 max-w-lg'>
                  No surprise bills. Every trip plan tracks estimated stays, local travel, dining, and activities against your set INR target.
                </p>
              </div>
              <div className='text-left md:text-right'>
                <div className='text-xs font-mono text-gray-400'>Sample 4-Day Domestic Trip</div>
                <div className='text-2xl font-mono font-bold text-white'>
                  ₹38,200 <span className='text-sm text-gray-500 font-normal'>/ ₹50,000 Target</span>
                </div>
              </div>
            </div>

            {/* Segmented Gold & Earth Bar */}
            <div className='space-y-3'>
              <div className='h-4 w-full bg-white/10 rounded-full overflow-hidden flex p-0.5 gap-1'>
                <div className='h-full rounded-l-full bg-primary' style={{ width: '45%' }} title='Heritage Stays: ₹17,000' />
                <div className='h-full bg-accent' style={{ width: '22%' }} title='Sights & Entry: ₹8,400' />
                <div className='h-full bg-[#E06D53]' style={{ width: '18%' }} title='Regional Dining: ₹6,800' />
                <div className='h-full bg-[#415A77]' style={{ width: '10%' }} title='Transit & Cabs: ₹3,800' />
                <div className='h-full rounded-r-full bg-emerald-600' style={{ width: '5%' }} title='Emergency Buffer: ₹2,200' />
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono pt-2 text-gray-300'>
                <div className='flex items-center gap-2'>
                  <span className='w-2.5 h-2.5 rounded-full bg-primary' />
                  <span>Stays (45%)</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='w-2.5 h-2.5 rounded-full bg-accent' />
                  <span>Sights (22%)</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='w-2.5 h-2.5 rounded-full bg-[#E06D53]' />
                  <span>Dining (18%)</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='w-2.5 h-2.5 rounded-full bg-[#415A77]' />
                  <span>Transit (10%)</span>
                </div>
                <div className='text-emerald-400 font-bold'>
                  ₹11,800 in Reserve
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className='py-28 relative overflow-hidden bg-gradient-to-t from-black via-gray-950 to-black border-t border-white/10'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10'>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-serif text-white'>
            Ready to Wander <span className='text-gold-shine'>Smarter?</span>
          </h2>
          <p className='text-base sm:text-lg text-gray-400 max-w-xl mx-auto'>
            Free forever. Plan complete day-by-day itineraries with verified places and install directly on your phone as an offline PWA.
          </p>
          <div className='pt-4 flex justify-center'>
            <Link
              href='/new'
              className='px-10 py-4 rounded-full bg-primary text-black font-semibold text-lg flex items-center gap-3 hover:bg-primary/90 transition-all duration-300 shadow-xl gold-glow-strong'
            >
              <span>Start Planning Free</span>
              <ArrowRight className='w-5 h-5' />
            </Link>
          </div>
        </div>
      </section>

      {/* LUXURY FOOTER */}
      <footer className='py-12 border-t border-white/10 bg-black text-xs font-mono text-gray-500'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <span className='font-serif font-bold text-base text-gold-shine'>Roamio</span>
            <span>—</span>
            <span>Wander Smarter, Not Harder · Indian Domestic Travel</span>
          </div>
          <div>
            <span>Curated Luxury Domestic Travel in India</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
