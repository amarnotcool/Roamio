import { NextResponse } from 'next/server'
import { getSwapAlternatives } from '@/lib/ai/itinerary'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { destination, currentPlaceId, intent, currentTime } = body

    if (!destination) {
      return NextResponse.json({ error: 'Destination is required' }, { status: 400 })
    }

    const alternatives = getSwapAlternatives(destination, currentPlaceId || '', intent || 'all')

    // If currentTime was provided, adopt its start and end times for seamless replacement
    const calibrated = alternatives.map(alt => ({
      ...alt,
      startTime: currentTime?.startTime || alt.startTime,
      endTime: currentTime?.endTime || alt.endTime,
    }))

    return NextResponse.json({ alternatives: calibrated })
  } catch (error: any) {
    console.error('Error fetching swap alternatives:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch swap alternatives' },
      { status: 500 }
    )
  }
}
