# Roamio — Product Requirements Document (PRD)

## 1. Product Vision
**AI-first travel planner for Indian domestic travelers that generates verified, budget-aware, day-by-day itineraries in seconds — monetized via affiliate commissions from day one.**

---

## 2. Target User (Wedge Segment)
**Primary:** Indian families (2–4 people) planning 3–7 day domestic vacations  
**Pain points:** Decision paralysis, fragmented research (Google + blogs + booking sites), unrealistic itineraries, budget overruns, closed venues/wrong hours  
**Current alternatives:** MakeMyTrip/ixigo (transactional, no planning), Google Travel (generic), manual spreadsheets

---

## 3. Core Value Proposition
| User Need | Roamio Solution |
|---|---|
| "Where should I go?" | AI suggests destinations matching vibe/budget |
| "Plan my trip" | Full day-by-day itinerary in <30 seconds |
| "Is this real?" | Every place verified via Google Places (hours, prices, ratings) |
| "Stay in budget" | Daily cost tracking, warnings, budget guardrails |
| "Book it" | One-click affiliate redirects (Booking.com, MMT, Skyscanner, Viator) |
| "Access on the road" | PWA — works offline, installable on phone |

---

## 4. MVP Scope (8-Week Build)

### Must Have (Launch)
- [ ] **Auth**: Email magic-link (Supabase)
- [ ] **Trip Form**: Destination, dates, budget (₹), travelers, interests, pace
- [ ] **AI Generation**: Gemini 1.5 Flash → structured JSON (day plans, activities, transport, costs)
- [ ] **Place Verification**: Google Places API (hours, pricing, ratings, photos)
- [ ] **Itinerary View**: Day tabs, timeline cards, budget bar, transport legs
- [ ] **Affiliate Redirects**: Hotel/flight/experience "Book" buttons → partner sites
- [ ] **Trip Dashboard**: Save, list, view, edit, delete trips
- [ ] **PWA**: Manifest, offline-ready, install prompt

### Should Have (Post-Launch)
- [ ] **Cross-trip Memory**: Preference learning (pace, diet, hotel type, interests)
- [ ] **Destination Discovery**: "Where to go" quiz + AI recommendations
- [ ] **Share/Export**: Read-only link, PDF export
- [ ] **Collaboration**: Invite co-planners (view/edit)

### Won't Build (Until Traction)
- Direct supplier booking / IRCTC integration
- Real-time during-trip companion / replanning
- Marketplace for local operators
- B2B/white-label

---

## 5. Technical Architecture (Production)

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui | Vercel-native, fast, PWA-ready |
| **Auth/DB/Realtime** | Supabase (PostgreSQL + Auth + Row-Level Security) | Free tier, scales, built-in auth |
| **AI** | Google Gemini 1.5 Flash (structured output via JSON schema) | Low cost ($0.15/1M in), fast, reliable JSON |
| **Places Data** | Google Places API (New) | $200/mo free credit, verified hours/prices |
| **Deployment** | Vercel (free tier → Pro) | Zero-config, global CDN, preview deploys |
| **Affiliate** | Booking.com, MakeMyTrip, Skyscanner, Viator APIs | Immediate revenue, zero contract risk |

### Database Schema (Core)
```sql
trips: id, user_id, title, destination, start_date, end_date, 
       budget_inr, travelers(jsonb), interests(text[]), pace
itineraries: id, trip_id, day_number, date, activities(jsonb), transport(jsonb)
```

---

## 6. AI System Design

### Single Prompt → Structured Output
```typescript
// Input: TripFormData
// Tools: search_places (Google Places), verify_hours
// Output: ItineraryResponse { dayPlans[], totalEstimatedCostINR, warnings[] }

// Constraints enforced:
// - Every activity references verified place_id
// - Opening hours respected
// - Travel time realistic (30-60 min between nearby)
// - Daily cost ≤ budget/day
// - No overlapping activities
// - ≥1 dining/day
// - Geographic flow minimizes backtracking
```

### Cost Control
- **Model**: Gemini 1.5 Flash only (~$0.15/1M input tokens)
- **Hard cap**: 50k tokens/user/day
- **Caching**: Exact prompt match → Supabase cache
- **Estimated cost**: <$50/mo at 10K MAU

---

## 7. Business Model

| Channel | Commission | Volume Target (Mo 6) | Revenue |
|---|---|---|---|
| **Hotels** (Booking.com, MMT) | 3–5% | 500 bookings | ₹7.5–12.5L |
| **Flights** (Skyscanner, MMT) | 1–2% | 300 bookings | ₹3–6L |
| **Experiences** (Viator, Klook) | 8–10% | 200 bookings | ₹4–5L |
| **Total** | — | — | **₹15–23L/mo** |

**Unit Economics**: CAC <₹200 (organic/referral), LTV >₹2,000 (repeat trips + referrals)

---

## 8. Go-to-Market

| Phase | Timeline | Focus |
|---|---|---|
| **Alpha** | Weeks 1–4 | 20 beta users (friends/family), iterate AI quality |
| **Beta** | Weeks 5–8 | 200 users (waitlist + referrals), fix bugs, add memory |
| **Launch** | Week 9 | Product Hunt, Twitter, travel communities, SEO content |
| **Growth** | Month 3+ | Referral program, destination guides, influencer trips |

---

## 9. Success Metrics (North Stars)

| Metric | Target (Month 3) | Target (Month 6) |
|---|---|---|
| **MAU** | 5,000 | 50,000 |
| **Trip Completion Rate** | >40% | >55% |
| **Affiliate Conversion** | >3% | >5% |
| **Monthly Revenue** | ₹2L | ₹20L |
| **NPS** | >40 | >50 |

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **LLM hallucination (wrong hours/prices)** | High | Critical | Google Places verification mandatory; "verified" badges; user correction loop |
| **API cost overrun** | Medium | High | Hard token caps, caching, Flash model only |
| **Affiliate rejection/delay** | Medium | Medium | Apply to 5+ programs in parallel; redirect-only MVP |
| **Supabase scaling limits** | Low | Medium | Monitor; migrate to dedicated PG if needed |
| **Competitor copies features** | High | Medium | Speed + memory moat; affiliate revenue funds speed |

---

## 11. Team & Budget (Pre-Seed)

| Role | Month 1–3 | Month 4–6 |
|---|---|---|
| **Founder (You)** | Product, AI prompts, fundraising | Strategy, hiring, partnerships |
| **Engineer #1** | Frontend + Supabase + AI integration | Features, optimization |
| **Designer (contract)** | UI system, mobile polish | — |
| **Marketing (you + contractor)** | Beta community, content, SEO | Referral, influencers |

**Monthly Burn**: ₹3–5L (salaries + infra + API)  
**Raise**: ₹50–75L for 18-month runway

---

## 12. Definition of Done (MVP Launch)
- [ ] Deployed on Vercel with custom domain
- [ ] Supabase project live with RLS policies
- [ ] 3+ affiliate programs approved
- [ ] 50 beta users completed ≥1 trip
- [ ] AI hallucination rate <2% (manual audit)
- [ ] PWA installable on iOS/Android
- [ ] Analytics: Mixpanel/PostHog + revenue tracking
- [ ] Terms/Privacy/DPDP consent flow

---

## 13. Appendix: Current Prototype Status
**Location:** `C:/Users/Devpratap/roamio-demo`

### Built & Working
- [x] Next.js 14 + TypeScript + Tailwind + shadcn/ui
- [x] Landing page (hero, features, how-it-works, CTA)
- [x] Email magic-link auth (`/login`, `/auth/callback`)
- [x] Trip creation form (destination, dates, budget, travelers, interests, pace)
- [x] AI itinerary generation endpoint (`/api/generate-itinerary`) using Gemini 1.5 Flash
- [x] Itinerary display with day tabs, timeline activities, costs, transport
- [x] Trip dashboard (list, view, edit, delete)
- [x] PWA manifest + offline-ready
- [x] Responsive design with dark mode
- [x] Build passes, dev server runs

### To Connect (Requires API Keys)
- [ ] Supabase project + run `supabase/schema.sql`
- [ ] Google AI Studio API key (Gemini)
- [ ] Google Places API key
- [ ] Affiliate program applications (Booking.com, MMT, Skyscanner, Viator)

### Deploy Commands
```bash
cd C:/Users/Devpratap/roamio-demo
npm run dev          # Local development
npm run build        # Production build
npx vercel --prod    # Deploy to Vercel
```