'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

function LoginContent() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const nextUrl = searchParams.get('next') || '/trips'
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      if (data?.user) {
        router.replace(nextUrl)
      }
    }).catch(() => {})
  }, [supabase, router, nextUrl])

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatusMessage(null)

    if (password.length < 6) {
      setStatusMessage({
        type: 'error',
        text: 'Password must be at least 6 characters in length.',
      })
      setLoading(false)
      return
    }

    try {
      if (authMode === 'signin') {
        // Sign in with Email + Password
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setStatusMessage({
            type: 'error',
            text: error.message.includes('Invalid login credentials')
              ? 'Invalid email or password. Please check your credentials or create a new account.'
              : error.message,
          })
          setLoading(false)
          return
        }

        if (data?.user) {
          setStatusMessage({
            type: 'success',
            text: '✓ Signed in successfully! Taking you to your trips...',
          })
          setTimeout(() => {
            router.push(nextUrl)
            router.refresh()
          }, 600)
        }
      } else {
        // Sign up with Email + Password
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
          },
        })

        if (error) {
          setStatusMessage({ type: 'error', text: error.message })
          setLoading(false)
          return
        }

        if (data?.session) {
          setStatusMessage({
            type: 'success',
            text: '✓ Account created successfully! Taking you to your trips...',
          })
          setTimeout(() => {
            router.push(nextUrl)
            router.refresh()
          }, 600)
        } else if (data?.user) {
          setStatusMessage({
            type: 'success',
            text: '✦ Account created! Please check your email inbox to confirm your account.',
          })
          setLoading(false)
        }
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Authentication encountered an unexpected error.',
      })
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`,
        },
      })
      if (error) {
        setStatusMessage({ type: 'error', text: error.message })
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Google sign-in is currently unavailable.' })
    }
  }

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden'>
      {/* Background soft ambient gold glow */}
      <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[340px] bg-primary/10 rounded-full blur-[130px] pointer-events-none' />

      <div className='w-full max-w-md relative z-10 space-y-6'>
        
        {/* Logo / Header */}
        <div className='text-center space-y-1.5'>
          <Link href='/' className='inline-block group'>
            <span className='font-serif text-4xl font-bold tracking-wide text-gold-shine group-hover:opacity-90 transition-opacity'>
              Roamio
            </span>
          </Link>
          <p className='text-xs font-mono uppercase tracking-widest text-primary/80'>
            Luxury Domestic Travel
          </p>
        </div>

        {/* Main Card */}
        <div className='rounded-3xl border border-white/10 glass-strong p-8 shadow-2xl gold-glow space-y-6'>
          
          {/* Sign In vs Sign Up Tabs */}
          <div className='flex items-center p-1 rounded-2xl bg-black/60 border border-white/10'>
            <button
              type='button'
              onClick={() => {
                setAuthMode('signin')
                setStatusMessage(null)
              }}
              className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer font-bold ${
                authMode === 'signin'
                  ? 'bg-primary text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type='button'
              onClick={() => {
                setAuthMode('signup')
                setStatusMessage(null)
              }}
              className={`flex-1 py-2 text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer font-bold ${
                authMode === 'signup'
                  ? 'bg-primary text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className='space-y-1'>
            <h2 className='text-xl font-serif font-bold text-white'>
              {authMode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className='text-xs text-gray-400'>
              {authMode === 'signin'
                ? 'Sign in to access your saved trips and personalized itineraries.'
                : 'Sign up to plan, customize, and save your travel itineraries.'}
            </p>
          </div>

          {/* Feedback messages */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                statusMessage.type === 'error'
                  ? 'border-red-500/30 bg-red-500/10 text-red-300'
                  : statusMessage.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-primary/30 bg-primary/10 text-[#d4a574]'
              }`}
            >
              {statusMessage.type === 'error' ? (
                <AlertCircle className='w-4 h-4 flex-shrink-0 text-red-400 mt-0.5' />
              ) : (
                <CheckCircle2 className='w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5' />
              )}
              <span className='leading-relaxed'>{statusMessage.text}</span>
            </div>
          )}

          {/* Email + Password Form */}
          <form onSubmit={handleEmailAuth} className='space-y-4'>
            
            {/* Email Field */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-xs font-medium text-gray-300'>
                Email Address
              </Label>
              <div className='relative'>
                <Mail className='w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
                <Input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className='pl-10 h-11 bg-black/50 border-white/15 text-white placeholder:text-gray-600 focus:border-primary rounded-xl text-sm'
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password' className='text-xs font-medium text-gray-300'>
                  Password
                </Label>
                {authMode === 'signup' && (
                  <span className='text-[10px] font-mono text-gray-500'>Min 6 characters</span>
                )}
              </div>
              <div className='relative'>
                <Lock className='w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className='pl-10 pr-10 h-11 bg-black/50 border-white/15 text-white placeholder:text-gray-600 focus:border-primary rounded-xl text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer'
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={loading}
              className='w-full h-11 bg-primary text-black font-semibold text-sm rounded-xl gold-glow hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2'
            >
              {loading ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin' />
                  <span>Please wait...</span>
                </div>
              ) : (
                <>
                  <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className='w-4 h-4' />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className='relative flex items-center justify-center'>
            <div className='border-t border-white/10 w-full' />
            <span className='bg-[#121212] px-3 font-mono text-[10px] uppercase text-gray-500 tracking-wider absolute'>
              or
            </span>
          </div>

          {/* Google OAuth Button */}
          <button
            type='button'
            onClick={handleGoogleLogin}
            className='w-full h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer'
          >
            <svg className='w-4 h-4' viewBox='0 0 24 24'>
              <path
                fill='#EA4335'
                d='M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z'
              />
              <path
                fill='#4285F4'
                d='M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z'
              />
              <path
                fill='#FBBC05'
                d='M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z'
              />
              <path
                fill='#34A853'
                d='M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z'
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Guest Mode Direct Access */}
          <div className='pt-2 text-center'>
            <Link
              href={nextUrl}
              className='text-xs text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1.5'
            >
              <span>Continue as Guest</span>
              <ArrowRight className='w-3.5 h-3.5' />
            </Link>
          </div>

        </div>

        {/* Footer info */}
        <div className='text-center space-y-2'>
          <p className='text-[11px] text-gray-500 font-sans flex items-center justify-center gap-1.5'>
            <ShieldCheck className='w-3.5 h-3.5 text-primary/70' />
            Your travel preferences and account details are securely encrypted.
          </p>
          <div className='flex items-center justify-center gap-4 text-xs font-mono text-gray-400'>
            <Link href='/' className='hover:text-primary transition-colors'>
              ← Return to Explore
            </Link>
            <span>•</span>
            <Link href='/trips' className='hover:text-primary transition-colors'>
              My Saved Trips
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center text-primary font-mono text-sm'>
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
