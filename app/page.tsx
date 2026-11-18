'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  MapPin,
  Calendar,
  Compass,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
} from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('features')

  return (
    <div className='min-h-screen bg-[#0B0E14] text-[#F5EFE6] p-3 sm:p-6 lg:p-8 flex flex-col justify-center items-center selection:bg-[#D97742]/30 selection:text-white'>
      
      {/* ==================================================================== */}
      {/* OUTER DEVICE / VIEWPORT FRAME (As seen in the reference design) */}
      {/* ==================================================================== */}
      <div className='w-full max-w-[1400px] rounded-[2rem] sm:rounded-[2.5rem] bg-[#0D1119] border border-white/10 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col relative'>
        
        {/* ==================================================================== */}
        {/* TOP FLOATING NAVIGATION BAR */}
        {/* ==================================================================== */}
        <header className='absolute top-0 inset-x-0 z-30 pt-6 px-6 sm:px-10 lg:px-12 flex items-center justify-between pointer-events-auto'>
          
          {/* Left: Serif Wordmark */}
          <Link href='/' className='flex items-center gap-1.5 group'>
            <span className='font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#1C1917]'>
              Roamio
            </span>
            <span className='w-1.5 h-1.5 rounded-full bg-[#D97742] mb-1' />
          </Link>

          {/* Center: Frosted Translucent Pill Navigation */}
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
              onClick={() => setActiveNav('navigation')}
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
              onClick={() => setActiveNav('prices')}
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
              onClick={() => setActiveNav('stories')}
              className={`text-xs font-semibold px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                activeNav === 'stories'
                  ? 'bg-white/95 text-[#1C1917] shadow-xs'
                  : 'text-[#3D352E] hover:text-[#1C1917]'
              }`}
            >
              Stories
            </button>
          </nav>

          {/* Right: Log in & Terracotta Sign Up CTA */}
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

        {/* ==================================================================== */}
        {/* HERO SECTION (Kyoto Sunset Pagoda & Editorial Typography) */}
        {/* ==================================================================== */}
        <section className='relative min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex flex-col justify-center px-6 sm:px-12 lg:px-16 pt-24 pb-16 overflow-hidden'>
          
          {/* Background Photography: Pagoda Overlooking Kyoto Sunset Basin */}
          <Image
            src='https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=2000&q=85'
            alt='Kyoto Pagoda at Sunset'
            fill
            priority
            className='object-cover object-[center_right] sm:object-center'
          />

          {/* Warm Golden-Hour Sunset Sky Gradient Overlay */}
          <div
            className='absolute inset-0 pointer-events-none'
            style={{
              background:
                'linear-gradient(180deg, rgba(248, 230, 210, 0.94) 0%, rgba(244, 212, 184, 0.72) 28%, rgba(220, 148, 100, 0.28) 52%, rgba(13, 17, 25, 0.94) 92%, #0D1119 100%)',
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

          {/* Left-Aligned Editorial Content */}
          <div className='relative z-20 max-w-2xl space-y-2 mt-8 sm:mt-12'>
            
            {/* Headline */}
            <h1 className='font-serif text-3xl sm:text-4xl lg:text-[3.35rem] font-normal tracking-tight text-[#1C1917] leading-[1.16]'>
              <span className='block sm:whitespace-nowrap'>Every journey has a story.</span>
              <span className='block font-normal mt-1 sm:whitespace-nowrap'>
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

          {/* Carousel Slider Indicator Dots (Bottom Center) */}
          <div className='absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-none'>
            <span className='w-1.5 h-1.5 rounded-full bg-white/40' />
            <span className='w-5 h-1.5 rounded-full bg-white/90 shadow-xs' />
            <span className='w-1.5 h-1.5 rounded-full bg-white/40' />
          </div>

        </section>

        {/* ==================================================================== */}
        {/* BENTO SHOWCASE SECTION (#0D1119 Twilight Obsidian) */}
        {/* ==================================================================== */}
        <section className='relative bg-[#0D1119] text-[#F5EFE6] px-6 sm:px-12 lg:px-16 pt-6 pb-16 space-y-8'>
          
          {/* Header Row */}
          <div className='flex items-end justify-between border-b border-white/10 pb-5'>
            <div className='space-y-1'>
              <h2 className='font-serif text-2xl sm:text-3xl font-bold text-white'>
                Bento Showcase
              </h2>
              <p className='text-xs text-gray-400 font-sans'>
                Perspiciatis unde omnis iste natus innovation conic.
              </p>
            </div>

            {/* Carousel Arrows */}
            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer text-xs'
                aria-label='Previous'
              >
                <ChevronLeft className='w-4 h-4' />
              </button>
              <button
                type='button'
                className='w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors cursor-pointer text-xs'
                aria-label='Next'
              >
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* 3-Column Bento Grid */}
          <div className='grid md:grid-cols-3 gap-6 items-stretch'>
            
            {/* Card 1: Nocturnal Route Map Card */}
            <div className='rounded-3xl p-5 bg-[#151B26] border border-white/10 flex flex-col justify-between relative overflow-hidden min-h-[320px]'>
              
              {/* Glowing SVG Map Polyline */}
              <div className='absolute inset-0 opacity-40 pointer-events-none'>
                <svg className='w-full h-full' xmlns='http://www.w3.org/2000/svg'>
                  <defs>
                    <pattern id='bento-grid-mini' width='32' height='32' patternUnits='userSpaceOnUse'>
                      <path d='M 32 0 L 0 0 0 32' fill='none' stroke='rgba(255,255,255,0.06)' strokeWidth='1' />
                    </pattern>
                  </defs>
                  <rect width='100%' height='100%' fill='url(#bento-grid-mini)' />
                  
                  <path
                    d='M 30 240 C 90 200, 140 260, 200 170 S 260 90, 310 60'
                    fill='none'
                    stroke='#F28C38'
                    strokeWidth='3'
                    strokeDasharray='5 5'
                    filter='drop-shadow(0 0 6px rgba(242, 140, 56, 0.8))'
                  />
                  <circle cx='30' cy='240' r='4' fill='#F28C38' />
                  <circle cx='200' cy='170' r='4' fill='#F28C38' />
                  <circle cx='310' cy='60' r='5' fill='#FFFFFF' stroke='#F28C38' strokeWidth='2.5' />
                </svg>
              </div>

              {/* Card Header Telemetry */}
              <div className='relative z-10 flex items-center justify-between text-xs font-mono text-gray-400'>
                <span className='px-2.5 py-0.5 rounded-full bg-white/10 text-[#F28C38] border border-[#F28C38]/30 text-[10px] font-bold'>
                  LIVE ROUTE
                </span>
                <span className='text-[11px]'>32.04 | ~ 400 m</span>
              </div>

              {/* Title & Route Pins */}
              <div className='relative z-10 space-y-2.5 mt-auto pt-12'>
                <h3 className='font-serif text-xl font-bold text-white'>
                  Kyoto Dusk & Dawn
                </h3>
                <p className='text-xs text-gray-400 font-sans'>
                  Bamboo groves & lantern-lit temples
                </p>

                <div className='flex items-center gap-1.5 flex-wrap pt-1'>
                  <span className='inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-amber-200 border border-white/10'>
                    <MapPin className='w-3 h-3 text-[#D97742]' /> Arashiyama
                  </span>
                  <span className='inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-amber-200 border border-white/10'>
                    <MapPin className='w-3 h-3 text-[#D97742]' /> Gion Quarter
                  </span>
                </div>

                <div className='pt-2 flex items-center justify-between border-t border-white/10'>
                  <div className='flex -space-x-1.5'>
                    <div className='w-6 h-6 rounded-full bg-amber-600 border border-[#151B26] flex items-center justify-center text-[9px] font-bold'>
                      EV
                    </div>
                    <div className='w-6 h-6 rounded-full bg-orange-600 border border-[#151B26] flex items-center justify-center text-[9px] font-bold'>
                      JT
                    </div>
                    <div className='w-6 h-6 rounded-full bg-stone-700 border border-[#151B26] flex items-center justify-center text-[9px] text-gray-300 font-bold'>
                      +2
                    </div>
                  </div>
                  <span className='text-[10px] font-mono text-gray-400'>Verified Pace</span>
                </div>
              </div>

            </div>

            {/* Card 2: Interactive Travel Timeline Card */}
            <div className='rounded-3xl p-5 bg-[#151B26] border border-white/10 flex flex-col justify-between min-h-[320px]'>
              
              <div className='flex items-center justify-between pb-2 border-b border-white/10'>
                <span className='text-xs font-mono text-gray-300 font-semibold'>
                  Travel Timeline
                </span>
                <span className='text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D97742]/20 text-[#D97742] border border-[#D97742]/30'>
                  Active
                </span>
              </div>

              {/* Vertical Time Nodes */}
              <div className='relative pl-5 space-y-4 my-auto py-2'>
                <div className='absolute left-1.5 top-1.5 bottom-1.5 w-0.5 bg-gradient-to-b from-[#D97742] to-white/20' />

                <div className='relative'>
                  <div className='absolute -left-5 top-1 w-3.5 h-3.5 rounded-full bg-[#151B26] border-2 border-[#D97742] flex items-center justify-center'>
                    <div className='w-1 h-1 rounded-full bg-[#D97742]' />
                  </div>
                  <div className='text-[11px] font-mono text-[#D97742] font-bold'>
                    08:30 AM · Kyoto
                  </div>
                  <div className='text-xs font-sans text-gray-300'>
                    Morning Bamboo Grove walk
                  </div>
                </div>

                <div className='relative'>
                  <div className='absolute -left-5 top-1 w-3.5 h-3.5 rounded-full bg-[#151B26] border-2 border-white/30 flex items-center justify-center'>
                    <div className='w-1 h-1 rounded-full bg-gray-400' />
                  </div>
                  <div className='text-[11px] font-mono text-gray-400'>
                    11:15 AM · Tenryu-ji
                  </div>
                  <div className='text-xs font-sans text-gray-400'>
                    Zen tea ceremony & gardens
                  </div>
                </div>
              </div>

              <div className='pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400 font-mono'>
                <span>Daylight Window</span>
                <span className='text-white font-semibold'>Verified</span>
              </div>

            </div>

            {/* Card 3: Scenic Destination Preview Card */}
            <div className='rounded-3xl overflow-hidden relative min-h-[320px] border border-white/10 shadow-xl group'>
              <Image
                src='https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80'
                alt='Kiyomizu Pagoda Kyoto'
                fill
                className='object-cover group-hover:scale-105 transition-transform duration-700'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-[#0D1119] via-black/25 to-transparent' />

              <div className='absolute top-3.5 left-3.5 z-10'>
                <span className='px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/60 text-white border border-white/20 backdrop-blur-xs'>
                  ATMOSPHERIC DUSK
                </span>
              </div>

              <div className='absolute bottom-4 left-4 right-4 z-10 space-y-1.5'>
                <h4 className='font-serif text-lg font-bold text-white'>
                  Kyoto Golden Hour
                </h4>
                <p className='text-xs text-gray-300 font-sans line-clamp-2'>
                  Grounded with authentic daylight progression for panoramic twilight views.
                </p>

                <div className='pt-1'>
                  <Link
                    href='/new'
                    className='inline-flex items-center gap-1 text-xs font-mono text-[#F28C38] hover:text-white transition-colors'
                  >
                    <span>Explore journey</span>
                    <ArrowRight className='w-3 h-3' />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  )
}
