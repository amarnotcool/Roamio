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
    <div className='min-h-screen bg-[#0a0a0a] text-[#f5f5f5] flex flex-col selection:bg-[#d4a574]/30 selection:text-white'>
      
      {/* Luxury Dark Header */}
      <header className='sticky top-0 z-50 w-full border-b border-white/10 bg-black/75 backdrop-blur-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-8'>
          <div className='flex h-20 items-center justify-between'>
            
            {/* Brand */}
            <Link href='/' className='flex items-center gap-2 group'>
              <span className='font-serif text-3xl font-bold tracking-wide text-gold-shine hover:opacity-90 transition-opacity'>
                Roamio
              </span>
            </Link>

            {/* Nav Items */}
            <nav className='flex items-center gap-2 sm:gap-4'>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-black font-semibold shadow-md gold-glow'
                        : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
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
                    <Button variant='ghost' className='relative h-9 w-9 rounded-full p-0 border border-primary/40 gold-glow'>
                      <Avatar className='h-9 w-9'>
                        <AvatarImage src={user.user_metadata?.avatar_url || ''} alt={user.email || ''} />
                        <AvatarFallback className='bg-primary text-black font-mono text-xs font-bold'>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-52 bg-[#141414] border-white/10 text-white shadow-2xl' align='end'>
                    <div className='px-3 py-2 text-xs font-mono text-gray-400 border-b border-white/10'>
                      {user.email}
                    </div>
                    <DropdownMenuItem>
                      <Link href='/new' className='flex items-center gap-2 w-full text-xs font-medium text-gray-200 hover:text-primary'>
                        <Plus className='w-4 h-4 text-primary' />
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
                <div className='flex items-center gap-2'>
                  <span className='hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono glass border-primary/30 text-primary'>
                    <Sparkles className='w-3 h-3 text-primary' /> Guest Studio
                  </span>
                  <Link
                    href='/login'
                    className='px-4 py-2 text-xs font-medium text-white border border-white/20 rounded-full hover:bg-white/10 hover:border-primary/50 transition-colors inline-flex items-center justify-center'
                  >
                    Sign In
                  </Link>
                </div>
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
