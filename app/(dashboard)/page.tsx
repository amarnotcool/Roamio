'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Calendar, MapPin, Users, IndianRupee, Trash2, Edit, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

export default function MyTripsPage() {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadTrips()
  }, [])

  async function loadTrips() {
    const { data, error } = await supabase
      .from('trips')
      .select('*, itineraries(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading trips:', error)
      return
    }
    setTrips(data || [])
    setLoading(false)
  }

  async function deleteTrip(id: string) {
    if (!confirm('Delete this trip?')) return
    const { error } = await supabase.from('trips').delete().eq('id', id)
    if (!error) setTrips(trips.filter(t => t.id !== id))
  }

  if (loading) return <div className='flex items-center justify-center h-64'><div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' /></div>

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>My Trips</h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
        </div>
        <Link href='/dashboard/new'>
          <Button className='gap-2'>
            <Plus className='w-5 h-5' />
            Plan New Trip
          </Button>
        </Link>
      </div>

      {trips.length === 0 ? (
        <Card className='text-center py-16'>
          <CardContent>
            <MapPin className='w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4' />
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>No trips yet</h3>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>Plan your first trip with AI</p>
            <Link href='/dashboard/new'>
              <Button className='gap-2'>
                <Plus className='w-5 h-5' />
                Create Your First Trip
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {trips.map((trip) => (
            <Card key={trip.id} className='overflow-hidden transition-shadow hover:shadow-lg'>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div>
                    <CardTitle className='text-lg'>{trip.title}</CardTitle>
                    <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1'>
                      <span className='flex items-center gap-1'><MapPin className='w-4 h-4' />{trip.destination}</span>
                      <span className='flex items-center gap-1'><Calendar className='w-4 h-4' />{format(new Date(trip.start_date), 'MMM d')} – {format(new Date(trip.end_date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                  <span className='flex items-center gap-1'><Users className='w-4 h-4' />{trip.travelers?.adults || 1} adult{trip.travelers?.adults > 1 ? 's' : ''}{trip.travelers?.children ? `, ${trip.travelers.children} child${trip.travelers.children > 1 ? 'ren' : ''}` : ''}</span>
                  <span className='flex items-center gap-1'><IndianRupee className='w-4 h-4' />₹{trip.budget_inr?.toLocaleString() || 'Not set'}</span>
                </div>
                <div className='flex items-center gap-2 flex-wrap'>
                  {trip.interests?.slice(0, 3).map((interest: string) => (
                    <span key={interest} className='px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full'>{interest}</span>
                  ))}
                  {trip.interests?.length > 3 && <span className='px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full'>+{trip.interests.length - 3} more</span>}
                </div>
                <div className='flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800'>
                  <Link href={`/dashboard/trips/${trip.id}`}>
                    <Button variant='outline' className='flex-1 gap-1'>
                      <ExternalLink className='w-4 h-4' />
                      View Itinerary
                    </Button>
                  </Link>
                  <Link href={`/dashboard/trips/${trip.id}/edit`}>
                    <Button variant='ghost' size='icon'><Edit className='w-4 h-4' /></Button>
                  </Link>
                  <Button variant='ghost' size='icon' onClick={() => deleteTrip(trip.id)} className='text-red-600 hover:text-red-700 hover:bg-red-50'>
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}