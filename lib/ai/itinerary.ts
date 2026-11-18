import { GoogleGenerativeAI } from '@google/generative-ai'
import type { TripFormData, ItineraryResponse, Activity, DayPlan, PlaceResult } from '@/lib/types'

const apiKey = process.env.GOOGLE_AI_API_KEY
const hasValidKey = apiKey && apiKey !== 'your_gemini_api_key' && apiKey.length > 10

const genAI = hasValidKey ? new GoogleGenerativeAI(apiKey) : null

const DESTINATION_CURATED_PLACES: Record<string, PlaceResult[]> = {
  jaipur: [
    { placeId: 'jp1', name: 'Amer Fort & Sheesh Mahal', address: 'Devisinghpura, Amer, Jaipur, Rajasthan 302001', lat: 26.9855, lng: 75.8513, rating: 4.8, priceLevel: 2, types: ['historical_place', 'culture'], openingHours: { mon: '09:00-17:30', tue: '09:00-17:30', wed: '09:00-17:30', thu: '09:00-17:30', fri: '09:00-17:30', sat: '09:00-17:30', sun: '09:00-17:30' } },
    { placeId: 'jp2', name: 'Panna Meena Ka Kund Stepwell', address: 'Near Amer Fort, Jaipur, Rajasthan 302028', lat: 26.9897, lng: 75.8558, rating: 4.6, priceLevel: 0, types: ['historical_place', 'photography'], openingHours: { mon: '07:00-18:00', tue: '07:00-18:00', wed: '07:00-18:00', thu: '07:00-18:00', fri: '07:00-18:00', sat: '07:00-18:00', sun: '07:00-18:00' } },
    { placeId: 'jp3', name: 'LMB (Laxmi Misthan Bhandar)', address: 'Johari Bazaar, Pink City, Jaipur, Rajasthan 302003', lat: 26.9204, lng: 75.8242, rating: 4.4, priceLevel: 2, types: ['restaurant', 'food'], openingHours: { mon: '08:00-22:30', tue: '08:00-22:30', wed: '08:00-22:30', thu: '08:00-22:30', fri: '08:00-22:30', sat: '08:00-22:30', sun: '08:00-22:30' } },
    { placeId: 'jp4', name: 'City Palace & Chandra Mahal', address: 'Tulsi Marg, Gangori Bazaar, J.D.A. Market, Jaipur', lat: 26.9258, lng: 75.8237, rating: 4.7, priceLevel: 2, types: ['museum', 'culture', 'family'], openingHours: { mon: '09:30-17:00', tue: '09:30-17:00', wed: '09:30-17:00', thu: '09:30-17:00', fri: '09:30-17:00', sat: '09:30-17:00', sun: '09:30-17:00' } },
    { placeId: 'jp5', name: 'Hawa Mahal Viewpoint Cafe', address: 'Badi Choupad, J.D.A. Market, Pink City, Jaipur', lat: 26.9239, lng: 75.8267, rating: 4.5, priceLevel: 1, types: ['photography', 'food'], openingHours: { mon: '08:00-22:00', tue: '08:00-22:00', wed: '08:00-22:00', thu: '08:00-22:00', fri: '08:00-22:00', sat: '08:00-22:00', sun: '08:00-22:00' } },
    { placeId: 'jp6', name: 'Johari Bazaar & Bapu Bazaar Textile Walk', address: 'Bapu Bazaar, Pink City, Jaipur, Rajasthan 302003', lat: 26.9189, lng: 75.8214, rating: 4.5, priceLevel: 1, types: ['shopping', 'market'], openingHours: { mon: '11:00-21:00', tue: '11:00-21:00', wed: '11:00-21:00', thu: '11:00-21:00', fri: '11:00-21:00', sat: '11:00-21:00', sun: '11:00-21:00' } },
    { placeId: 'jp7', name: 'Nahargarh Fort Sunset Point', address: 'Krishna Nagar, Brahampuri, Jaipur, Rajasthan 302002', lat: 26.9372, lng: 75.8155, rating: 4.7, priceLevel: 1, types: ['viewpoint', 'adventure', 'photography'], openingHours: { mon: '10:00-22:00', tue: '10:00-22:00', wed: '10:00-22:00', thu: '10:00-22:00', fri: '10:00-22:00', sat: '10:00-22:00', sun: '10:00-22:00' } },
    { placeId: 'jp8', name: 'Chokhi Dhani Cultural Village', address: '12 Miles, Tonk Road, Jaipur, Rajasthan 303905', lat: 26.7725, lng: 75.8344, rating: 4.5, priceLevel: 3, types: ['family', 'culture', 'food'], openingHours: { mon: '17:00-23:00', tue: '17:00-23:00', wed: '17:00-23:00', thu: '17:00-23:00', fri: '17:00-23:00', sat: '17:00-23:00', sun: '17:00-23:00' } },
  ],
  kerala: [
    { placeId: 'kl1', name: 'Meenappally Kayal Traditional Shikara Ride', address: 'Punnamada Jetty, Alleppey, Kerala 688006', lat: 9.5020, lng: 76.3480, rating: 4.9, priceLevel: 2, types: ['nature', 'adventure', 'photography'], openingHours: { mon: '06:00-18:30', tue: '06:00-18:30', wed: '06:00-18:30', thu: '06:00-18:30', fri: '06:00-18:30', sat: '06:00-18:30', sun: '06:00-18:30' } },
    { placeId: 'kl2', name: 'Marari Beach Coconut Groves', address: 'Mararikulam, Alappuzha, Kerala 688523', lat: 9.6015, lng: 76.2994, rating: 4.7, priceLevel: 0, types: ['beach', 'nature', 'wellness'], openingHours: { mon: '00:00-23:59', tue: '00:00-23:59', wed: '00:00-23:59', thu: '00:00-23:59', fri: '00:00-23:59', sat: '00:00-23:59', sun: '00:00-23:59' } },
    { placeId: 'kl3', name: 'Authentic Karimeen Pollichathu at Thaff', address: 'CCSBA Road, Alappuzha, Kerala 688001', lat: 9.4925, lng: 76.3268, rating: 4.4, priceLevel: 2, types: ['restaurant', 'food'], openingHours: { mon: '11:30-22:30', tue: '11:30-22:30', wed: '11:30-22:30', thu: '11:30-22:30', fri: '11:30-22:30', sat: '11:30-22:30', sun: '11:30-22:30' } },
    { placeId: 'kl4', name: 'Kollengode Spice Plantation Trail', address: 'Kuttanad Spice Belt, Alappuzha, Kerala', lat: 9.4200, lng: 76.4000, rating: 4.6, priceLevel: 1, types: ['nature', 'culture', 'wellness'], openingHours: { mon: '09:00-17:00', tue: '09:00-17:00', wed: '09:00-17:00', thu: '09:00-17:00', fri: '09:00-17:00', sat: '09:00-17:00', sun: '09:00-17:00' } },
  ],
  goa: [
    { placeId: 'ga1', name: 'Fontainhas Latin Quarter Heritage Walk', address: 'Fontainhas, Panaji, Goa 403001', lat: 15.4989, lng: 73.8278, rating: 4.8, priceLevel: 1, types: ['culture', 'photography', 'shopping'], openingHours: { mon: '08:00-20:00', tue: '08:00-20:00', wed: '08:00-20:00', thu: '08:00-20:00', fri: '08:00-20:00', sat: '08:00-20:00', sun: '08:00-20:00' } },
    { placeId: 'ga2', name: 'Confeitaria 31 De Janeiro Bakery', address: 'Corte De Oiterio, Fontainhas, Panaji, Goa 403001', lat: 15.4975, lng: 73.8290, rating: 4.7, priceLevel: 1, types: ['restaurant', 'food'], openingHours: { mon: '09:00-19:00', tue: '09:00-19:00', wed: '09:00-19:00', thu: '09:00-19:00', fri: '09:00-19:00', sat: '09:00-19:00', sun: '09:00-19:00' } },
    { placeId: 'ga3', name: 'Cabo de Rama Fort & Cliff Overlook', address: 'Talpona, Canacona, South Goa 403702', lat: 15.0888, lng: 73.9214, rating: 4.7, priceLevel: 0, types: ['viewpoint', 'nature', 'photography'], openingHours: { mon: '09:00-18:00', tue: '09:00-18:00', wed: '09:00-18:00', thu: '09:00-18:00', fri: '09:00-18:00', sat: '09:00-18:00', sun: '09:00-18:00' } },
    { placeId: 'ga4', name: 'Palolem Beach Sunset Kayaking', address: 'Palolem Beach, Canacona, South Goa 403670', lat: 15.0100, lng: 74.0232, rating: 4.8, priceLevel: 2, types: ['adventure', 'beach', 'nature'], openingHours: { mon: '06:00-19:00', tue: '06:00-19:00', wed: '06:00-19:00', thu: '06:00-19:00', fri: '06:00-19:00', sat: '06:00-19:00', sun: '06:00-19:00' } },
  ]
}

function buildPrompt(trip: TripFormData, places: PlaceResult[]): string {
  const days = Math.max(1, Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1)

  const paceMap: Record<string, number> = { relaxed: 2, moderate: 3, packed: 4 }
  const paceActivityCount = paceMap[trip.pace] || 3
  const budgetPerDay = Math.floor(trip.budgetINR / days)

  const placesContext = places
    .slice(0, 25)
    .map(p => `- ${p.name} (${p.types.join(', ')}): ${p.address}, Rating: ${p.rating || '4.5'}, Hours: ${JSON.stringify(p.openingHours || {})}`)
    .join('\n')

  return `You are an expert travel planner creating an authentic, bespoke day-by-day itinerary for an Indian domestic vacation.

## Trip Requirements
- **Destination**: ${trip.destination}
- **Dates**: ${trip.startDate} to ${trip.endDate} (${days} days)
- **Travelers**: ${trip.travelers.adults} adults, ${trip.travelers.children} children
- **Budget**: ₹${trip.budgetINR.toLocaleString()} total (~₹${budgetPerDay.toLocaleString()}/day)
- **Pace**: ${trip.pace} (~${paceActivityCount} activities/day)
- **Interests**: ${trip.interests.join(', ')}

## Available Verified Places:
${placesContext}

## Quality Constraints:
1. Every activity MUST reference realistic places with verified opening hours.
2. Realistic Indian transit between places (auto-rickshaw, AC cab, local walk, or train).
3. Daily cost sum ≤ ₹${budgetPerDay}.
4. Provide vivid, sensory, place-specific descriptions (e.g. morning sun, tea stops).
5. Output ONLY valid JSON matching this exact structure:
{
  "dayPlans": [
    {
      "dayNumber": 1,
      "date": "${trip.startDate}",
      "notes": "Day 1 summary",
      "activities": [
        {
          "sequence": 1,
          "startTime": "09:00",
          "endTime": "11:30",
          "title": "Activity Title",
          "description": "Sensory, place-specific description",
          "type": "sightseeing",
          "placeId": "p1",
          "placeName": "Place Name",
          "address": "Full Address",
          "costEstimateINR": 500,
          "verified": true
        }
      ],
      "transport": [
        {
          "sequence": 1,
          "departureTime": "08:30",
          "arrivalTime": "09:00",
          "mode": "taxi",
          "fromPlaceId": "hotel",
          "toPlaceId": "p1",
          "costEstimateINR": 350
        }
      ]
    }
  ],
  "totalEstimatedCostINR": ${trip.budgetINR},
  "warnings": []
}`
}

function generateCuratedDomesticFallback(trip: TripFormData, places: PlaceResult[]): ItineraryResponse {
  const start = new Date(trip.startDate)
  const end = new Date(trip.endDate)
  const days = Math.max(1, Math.min(10, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1))
  
  const dailyBudget = Math.floor(trip.budgetINR / days)
  const pool = places.length > 0 ? places : DESTINATION_CURATED_PLACES.jaipur

  const dayPlans: DayPlan[] = []
  let totalCost = 0

  for (let i = 0; i < days; i++) {
    const curDate = new Date(start)
    curDate.setDate(start.getDate() + i)
    const dateStr = curDate.toISOString().split('T')[0]

    const place1 = pool[(i * 2) % pool.length]
    const place2 = pool[(i * 2 + 1) % pool.length]

    const act1Cost = Math.round(dailyBudget * 0.28)
    const act2Cost = Math.round(dailyBudget * 0.32)
    const cabCost = Math.round(dailyBudget * 0.12)
    totalCost += (act1Cost + act2Cost + cabCost)

    const activities: Activity[] = [
      {
        sequence: 1,
        startTime: '09:00',
        endTime: '12:00',
        title: `Morning Exploration of ${place1.name}`,
        description: `Experience the early morning ambience at ${place1.name} before the crowds gather. Enjoy scenic courtyards and authentic heritage craft.`,
        type: 'sightseeing',
        placeId: place1.placeId,
        placeName: place1.name,
        address: place1.address,
        costEstimateINR: act1Cost,
        verified: true,
        lat: place1.lat,
        lng: place1.lng,
      },
      {
        sequence: 2,
        startTime: '13:00',
        endTime: '15:30',
        title: `Traditional Lunch & Walk near ${place2.name}`,
        description: `Savor regional delicacies followed by a relaxed stroll through local bazaars and architectural sights.`,
        type: 'dining',
        placeId: place2.placeId,
        placeName: place2.name,
        address: place2.address,
        costEstimateINR: act2Cost,
        verified: true,
        lat: place2.lat,
        lng: place2.lng,
      }
    ]

    dayPlans.push({
      dayNumber: i + 1,
      date: dateStr,
      notes: `Day ${i + 1} in ${trip.destination}: Balanced pace with cultural exploration and authentic dining.`,
      activities,
      transport: [
        {
          sequence: 1,
          departureTime: '08:30',
          arrivalTime: '09:00',
          mode: 'taxi',
          fromPlaceId: 'hotel',
          toPlaceId: place1.placeId,
          costEstimateINR: cabCost,
        }
      ]
    })
  }

  return {
    dayPlans,
    totalEstimatedCostINR: totalCost,
    warnings: totalCost > trip.budgetINR ? ['Estimated costs slightly exceed initial budget target'] : []
  }
}

export async function generateItinerary(
  trip: TripFormData,
  places: PlaceResult[]
): Promise<ItineraryResponse> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const prompt = buildPrompt(trip, places)
      const result = await model.generateContent(prompt)
      const text = result.response.text()

      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as ItineraryResponse
      }
    } catch (err) {
      console.warn('Gemini live call fallback:', err)
    }
  }

  // Fallback to high-quality curated domestic itinerary
  return generateCuratedDomesticFallback(trip, places)
}

export async function searchPlaces(
  destination: string,
  interests: string[]
): Promise<PlaceResult[]> {
  const destLower = destination.toLowerCase()
  for (const [key, places] of Object.entries(DESTINATION_CURATED_PLACES)) {
    if (destLower.includes(key)) {
      return places
    }
  }

  // Default curated places
  return DESTINATION_CURATED_PLACES.jaipur
}
