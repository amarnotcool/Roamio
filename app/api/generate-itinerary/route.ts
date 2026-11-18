import { createClient } from '@/lib/supabase/server'
import { generateItinerary, searchPlaces } from '@/lib/ai/itinerary'
import type { TripFormData } from '@/lib/types'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    let user = null
    try {
      const supabase = await createClient()
      const authResult = await supabase.auth.getUser()
      user = authResult.data?.user ?? null
    } catch {
      // Supabase not yet configured or running in guest mode
      user = null
    }

    const body = await request.json() as TripFormData

    // Validate required fields
    if (!body.destination || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: 'Please provide destination, start date, and end date' }, { status: 400 })
    }

    // Search for places
    const places = await searchPlaces(body.destination, body.interests || [])

    // Generate itinerary
    const itinerary = await generateItinerary(body, places)

    return NextResponse.json({ 
      itinerary,
      placesCount: places.length,
      isGuest: !user
    })
  } catch (error) {
    console.error('Generate itinerary error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate itinerary' },
      { status: 500 }
    )
  }
}
