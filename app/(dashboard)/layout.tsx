'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, LogOut, Compass, Sparkles, MapPin } from 'lucide-react'

type User = {
  id: string
  email?: string
  user_metadata?: { avatar_url?: string }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    try {
      supabase.auth.getUser()
        .then(({ data }: any) => {
          setUser(data?.user ?? null)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })

      const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setUser(session?.user ?? null)
      })

      return () => {
        authListener?.subscription?.unsubscribe()
      }
    } catch {
      setLoading(false)
    }
  }, [supabase])

  const navItems = [
    { href: '/', label: 'Explore', icon: Compass },
    { href: '/trips', label: 'My Trips', icon: MapPin },
    { href: '/new', label: 'Plan Trip', icon: Plus },
  ]

  return (
    <div className='min-h-screen bg-[#0D1119] text-[#f5f5f5] flex flex-col selection:bg-[#D97742]/30 selection:text-white'>
      
      {/* Luxury Nocturnal Header */}
      <header className='sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0D1119]/80 backdrop-blur-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-8'>
          <div className='flex h-20 items-center justify-between'>
            
            {/* Brand Identity / Bespoke Luxury Logo */}
            <Link href='/' className='flex items-center gap-3 group'>
              <div className='relative w-9 h-9 rounded-xl bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-sm flex items-center justify-center group-hover:scale-105 group-hover:border-[#D97742]/40 transition-all duration-300'>
                <svg viewBox='0 0 32 32' className='w-5 h-5' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <defs>
                    <linearGradient id='roamio-gold-dash' x1='0%' y1='0%' x2='100%' y2='100%'>
                      <stop offset='0%' stopColor='#F8E6D2' />
                      <stop offset='45%' stopColor='#D97742' />
                      <stop offset='100%' stopColor='#A84E25' />
                    </linearGradient>
                  </defs>
                  <circle cx='16' cy='16' r='13' stroke='url(#roamio-gold-dash)' strokeWidth='1.2' strokeDasharray='2 2' opacity='0.75' />
                  <circle cx='16' cy='16' r='9.5' stroke='#FFFFFF' strokeWidth='0.8' opacity='0.3' />
                  <path d='M16 3 L18 13 L28 16 L18 19 L16 29 L14 19 L4 16 L14 13 Z' fill='url(#roamio-gold-dash)' />
                  <circle cx='16' cy='16' r='2' fill='#FFFFFF' stroke='#151B26' strokeWidth='0.8' />
                </svg>
              </div>
              <div className='flex flex-col'>
                <div className='flex items-baseline gap-1'>
                  <span className='font-cormorant text-2xl sm:text-3xl font-semibold tracking-tight text-white hover:opacity-90 transition-opacity'>
                    Roamio
                  </span>
                  <span className='w-1.5 h-1.5 rounded-full bg-[#D97742] mb-0.5' />
                </div>
                <span className='text-[8px] font-mono tracking-[0.25em] text-[#E5A882] uppercase font-semibold leading-none'>
                  Travel Atelier
                </span>
              </div>
            </Link>

            {/* Nav Items */}
            <nav className='flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md'>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D97742] to-[#C25E2E] text-white shadow-[0_2px_12px_rgba(217,119,66,0.35)]'
                        : 'text-stone-300 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <item.icon className='w-4 h-4' />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* User / Guest Indicator */}
            <div className='flex items-center gap-3'>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant='ghost' className='relative h-9 w-9 rounded-full p-0 border border-[#D97742]/40 shadow-xs'>
                      <Avatar className='h-9 w-9'>
                        <AvatarImage src={user.user_metadata?.avatar_url || ''} alt={user.email || ''} />
                        <AvatarFallback className='bg-gradient-to-br from-[#D97742] to-[#C25E2E] text-white font-mono text-xs font-bold'>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-52 bg-[#151B26] border-white/10 text-white shadow-2xl' align='end'>
                    <div className='px-3 py-2 text-xs font-mono text-stone-400 border-b border-white/10'>
                      {user.email}
                    </div>
                    <DropdownMenuItem>
                      <Link href='/new' className='flex items-center gap-2 w-full text-xs font-medium text-stone-200 hover:text-[#E5A882]'>
                        <Plus className='w-4 h-4 text-[#D97742]' />
                        Plan New Trip
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='flex items-center gap-2 text-red-400 text-xs font-medium cursor-pointer'
                      onClick={async () => {
                        await supabase.auth.signOut()
                        router.push('/')
                      }}
                    >
                      <LogOut className='w-4 h-4' />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href='/login'
                  className='px-5 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#D97742] to-[#C25E2E] hover:from-[#E2834E] hover:to-[#CF6938] rounded-full transition-all shadow-[0_2px_12px_rgba(217,119,66,0.35)] inline-flex items-center justify-center'
                >
                  Sign In
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className='flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12'>
        {children}
      </main>

    </div>
  )
}
