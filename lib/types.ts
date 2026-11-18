export interface TripFormData {
  title: string
  destination: string
  startDate: string
  endDate: string
  budgetINR: number
  travelers: {
    adults: number
    children: number
  }
  interests: string[]
  pace: 'relaxed' | 'moderate' | 'packed'
}

export interface Activity {
  sequence: number
  startTime: string // HH:mm
  endTime: string   // HH:mm
  title: string
  description?: string
  type: 'sightseeing' | 'dining' | 'adventure' | 'cultural' | 'shopping' | 'transit' | 'rest' | 'custom'
  placeId: string
  placeName: string
  address: string
  costEstimateINR: number
  bookingUrl?: string
  verified: boolean
  lat?: number
  lng?: number
}

export interface DayPlan {
  dayNumber: number
  date: string // YYYY-MM-DD
  activities: Activity[]
  transport: TransportLeg[]
  notes?: string
}

export interface TransportLeg {
  sequence: number
  departureTime: string
  arrivalTime: string
  mode: 'flight' | 'train' | 'bus' | 'metro' | 'taxi' | 'ev_rental' | 'walk' | 'ferry'
  fromPlaceId: string
  toPlaceId: string
  costEstimateINR: number
}

export interface ItineraryResponse {
  dayPlans: DayPlan[]
  totalEstimatedCostINR: number
  warnings: string[]
}

export interface PlaceResult {
  placeId: string
  name: string
  address: string
  lat: number
  lng: number
  rating?: number
  priceLevel?: number
  types: string[]
  openingHours?: Record<string, string>
  photos?: string[]
}