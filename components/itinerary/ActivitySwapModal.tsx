'use client'

import { useState, useEffect } from 'react'
import { Activity } from '@/lib/types'
import {
  X,
  Sparkles,
  ArrowLeftRight,
  ShieldCheck,
  Check,
  MapPin,
  Plus,
  Coins,
  Building,
  Coffee,
  Camera,
  UtensilsCrossed,
} from 'lucide-react'

interface ActivitySwapModalProps {
  isOpen: boolean
  onClose: () => void
  destination: string
  dayNumber: number
  currentActivity: Activity | null
  onSwap: (dayNumber: number, oldActivityId: string, newActivity: Activity) => void
}

const INTENT_PRESETS = [
  { id: 'all', label: 'All Options', icon: Sparkles },
  { id: 'indoor', label: 'Indoor / Museum', icon: Building },
  { id: 'cheaper', label: 'Budget Food', icon: Coins },
  { id: 'cafe', label: 'Cozy Cafe', icon: Coffee },
  { id: 'viewpoint', label: 'Scenic View', icon: Camera },
]

export default function ActivitySwapModal({
  isOpen,
  onClose,
  destination,
  dayNumber,
  currentActivity,
  onSwap,
}: ActivitySwapModalProps) {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'custom'>('suggestions')
  const [activeIntent, setActiveIntent] = useState<string>('all')
  const [alternatives, setAlternatives] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Custom Form State
  const [customTitle, setCustomTitle] = useState('')
  const [customAddress, setCustomAddress] = useState('')
  const [customCost, setCustomCost] = useState(500)
  const [customType, setCustomType] = useState<Activity['type']>('sightseeing')

  useEffect(() => {
    if (isOpen && currentActivity) {
      fetchAlternatives(activeIntent)
    }
  }, [isOpen, currentActivity, activeIntent])

  async function fetchAlternatives(intent: string) {
    if (!currentActivity) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/swap-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          currentPlaceId: currentActivity.placeId,
          intent,
          currentTime: {
            startTime: currentActivity.startTime,
            endTime: currentActivity.endTime,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load alternative places')
      setAlternatives(data.alternatives || [])
    } catch (err: any) {
      setError(err?.message || 'Error loading suggestions')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !currentActivity) return null

  function handleSelectSwap(alt: Activity) {
    if (!currentActivity) return
    const updated: Activity = {
      ...alt,
      sequence: currentActivity.sequence,
      startTime: currentActivity.startTime,
      endTime: currentActivity.endTime,
    }
    onSwap(dayNumber, currentActivity.placeId, updated)
    onClose()
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentActivity || !customTitle.trim()) return

    const customActivity: Activity = {
      sequence: currentActivity.sequence,
      startTime: currentActivity.startTime,
      endTime: currentActivity.endTime,
      title: customTitle.trim(),
      placeId: 'custom_' + Date.now(),
      placeName: customTitle.trim(),
      address: customAddress.trim() || `${destination} Local Address`,
      costEstimateINR: customCost,
      type: customType,
      verified: true,
      description: `Custom itinerary stop created by traveler for Day ${dayNumber}.`,
    }

    onSwap(dayNumber, currentActivity.placeId, customActivity)
    onClose()
  }

  const currentCost = currentActivity.costEstimateINR || 0

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200'>

      <div className='relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-primary/30 glass-strong shadow-2xl gold-glow overflow-hidden'>

        {/* Header Ribbon */}
        <div className='bg-primary/15 px-6 py-4 border-b border-primary/20 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary'>
              <ArrowLeftRight className='w-4 h-4' />
            </div>
            <div>
              <h3 className='font-serif font-bold text-lg text-white'>
                Swap & Customize Stop
              </h3>
              <p className='text-[11px] font-mono text-gray-400'>
                Day 0{dayNumber} · Stop 0{currentActivity.sequence} ({currentActivity.startTime} – {currentActivity.endTime})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className='p-2 rounded-full glass border border-white/10 hover:border-white/30 text-gray-400 hover:text-white transition-colors cursor-pointer'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        {/* Currently Scheduled Stop Banner */}
        <div className='px-6 py-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs font-mono'>
          <div className='flex items-center gap-2 truncate'>
            <span className='text-gray-400'>Current:</span>
            <span className='font-bold text-white truncate'>{currentActivity.placeName}</span>
          </div>
          <span className='text-primary font-bold shrink-0 ml-2'>
            ₹{currentCost.toLocaleString()}
          </span>
        </div>

        {/* Tab Toggle: Smart Suggestions vs Custom Place */}
        <div className='px-6 pt-4 pb-2 flex items-center justify-between border-b border-white/10'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${activeTab === 'suggestions'
                ? 'bg-primary text-black font-bold shadow-md gold-glow'
                : 'glass text-gray-300 hover:border-primary/40'
                }`}
            >
              ✦ Verified Alternatives
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${activeTab === 'custom'
                ? 'bg-primary text-black font-bold shadow-md gold-glow'
                : 'glass text-gray-300 hover:border-primary/40'
                }`}
            >
              + Add Custom Spot
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className='flex-1 overflow-y-auto p-6 space-y-4'>

          {activeTab === 'suggestions' && (
            <>
              {/* Quick Intent Filter Chips */}
              <div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none'>
                {INTENT_PRESETS.map((preset) => {
                  const Icon = preset.icon
                  const isSelected = activeIntent === preset.id
                  return (
                    <button
                      key={preset.id}
                      type='button'
                      onClick={() => setActiveIntent(preset.id)}
                      className={`text-xs font-mono px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${isSelected
                        ? 'bg-primary/20 border border-primary text-primary font-bold gold-glow'
                        : 'glass border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                        }`}
                    >
                      <Icon className='w-3 h-3' />
                      <span>{preset.label}</span>
                    </button>
                  )
                })}
              </div>

              {loading && (
                <div className='py-12 flex flex-col items-center justify-center gap-2 text-xs font-mono text-primary'>
                  <div className='w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin' />
                  <span>Curating verified alternatives for {destination}...</span>
                </div>
              )}

              {error && (
                <div className='p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono'>
                  {error}
                </div>
              )}

              {!loading && alternatives.length === 0 && (
                <div className='py-8 text-center text-xs font-mono text-gray-400'>
                  No matching alternatives found for this filter. Try selecting "All Options".
                </div>
              )}

              {/* Suggestions Grid */}
              {!loading && (
                <div className='space-y-3'>
                  {alternatives.map((alt) => {
                    const altCost = alt.costEstimateINR || 0
                    const delta = altCost - currentCost
                    const isSaving = delta < 0
                    const isExact = delta === 0

                    return (
                      <div
                        key={alt.placeId}
                        className='p-4 rounded-2xl glass-dark border border-white/10 hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group'
                      >
                        <div className='space-y-1 max-w-md'>
                          <div className='flex items-center gap-2'>
                            <span className='px-2 py-0.5 rounded text-[10px] font-mono glass text-gray-300 uppercase'>
                              {alt.type}
                            </span>
                            <span className='text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-500/20'>
                              <ShieldCheck className='w-2.5 h-2.5' /> Verified
                            </span>
                          </div>

                          <h4 className='font-serif font-bold text-base text-white group-hover:text-primary transition-colors'>
                            {alt.placeName}
                          </h4>

                          <p className='text-xs text-gray-400 line-clamp-1'>
                            📍 {alt.address}
                          </p>

                          {alt.description && (
                            <p className='text-xs text-gray-300 font-sans line-clamp-2 pt-0.5'>
                              {alt.description}
                            </p>
                          )}
                        </div>

                        {/* Cost & Swap Action */}
                        <div className='flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10'>
                          <div className='text-right'>
                            <div className='font-mono font-bold text-sm text-white'>
                              ₹{altCost.toLocaleString()}
                            </div>
                            <div
                              className={`text-[10px] font-mono font-semibold ${isSaving
                                ? 'text-emerald-400'
                                : isExact
                                  ? 'text-gray-400'
                                  : 'text-amber-400'
                                }`}
                            >
                              {isSaving
                                ? `Save ₹${Math.abs(delta).toLocaleString()}`
                                : isExact
                                  ? 'Same Cost'
                                  : `+₹${delta.toLocaleString()}`}
                            </div>
                          </div>

                          <button
                            type='button'
                            onClick={() => handleSelectSwap(alt)}
                            className='px-4 py-2 rounded-full bg-primary text-black font-sans text-xs font-bold hover:bg-primary/90 transition-all shadow-md gold-glow cursor-pointer flex items-center gap-1.5'
                          >
                            <span>Swap Stop</span>
                            <Check className='w-3.5 h-3.5' />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'custom' && (
            <form onSubmit={handleCustomSubmit} className='space-y-4 pt-2'>
              <div className='space-y-1.5'>
                <label className='text-xs font-mono uppercase text-gray-400'>
                  Place or Activity Name *
                </label>
                <input
                  type='text'
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder='e.g., Tapri Central Cafe, Sunset Boat Pier, Meeting friends'
                  className='w-full px-4 py-3 rounded-xl glass border border-white/15 text-white text-sm focus:border-primary focus:outline-none'
                />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-mono uppercase text-gray-400'>
                  Location / Address (Optional)
                </label>
                <input
                  type='text'
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder='e.g., C-Scheme, Jaipur'
                  className='w-full px-4 py-3 rounded-xl glass border border-white/15 text-white text-sm focus:border-primary focus:outline-none'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-mono uppercase text-gray-400'>
                    Activity Type
                  </label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as any)}
                    className='w-full px-4 py-3 rounded-xl glass border border-white/15 text-white text-sm bg-[#141414] focus:border-primary focus:outline-none'
                  >
                    <option value='sightseeing'>Sightseeing</option>
                    <option value='dining'>Dining</option>
                    <option value='shopping'>Shopping</option>
                    <option value='cultural'>Cultural</option>
                    <option value='adventure'>Adventure</option>
                    <option value='wellness'>Wellness</option>
                  </select>
                </div>

                <div className='space-y-1.5'>
                  <label className='text-xs font-mono uppercase text-gray-400'>
                    Est. Cost (₹)
                  </label>
                  <input
                    type='number'
                    min={0}
                    step={100}
                    value={customCost}
                    onChange={(e) => setCustomCost(Number(e.target.value))}
                    className='w-full px-4 py-3 rounded-xl glass border border-white/15 text-white text-sm font-mono focus:border-primary focus:outline-none'
                  />
                </div>
              </div>

              <div className='pt-4'>
                <button
                  type='submit'
                  className='w-full py-3 rounded-full bg-primary text-black font-semibold text-sm hover:bg-primary/90 transition-all shadow-md gold-glow cursor-pointer flex items-center justify-center gap-2'
                >
                  <span>Insert Custom Stop into Day 0{dayNumber}</span>
                  <Plus className='w-4 h-4' />
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  )
}
