# FestivalAI: Pre-Generation Architecture & Implementation Plan

## 1. Best Strategy Recommendation: "Instant Hero + Lazy Video"
The most effective strategy for real product usability and speed is the **"Instant Hero + Lazy Video"** pattern. 
Pre-generating premium static images and localized text variations exactly at midnight guarantees an *instant* sub-100ms page load for the user without any AI latency bottlenecks. Attempting to pre-generate expensive AI video for *every* occasion every night will burn your budget immediately. Instead, **Videos should remain strictly On-Demand**, triggered only when a user explicitly initiates an "Animate" or "Preview Video" action.

---

## 2. Daily Midnight Generation Architecture
**Trigger**: Vercel Cron Jobs (or Upstash QStash) firing at 12:00 AM IST.
**Workflow**:
1. `GET /api/cron/daily-prep`: The cron job hits a secured API route.
2. **Detection & Ranking**: The script cross-references `festivalCalendar.ts`, fetches today's events, and runs a ranking algorithm (Weighting: `cultural_importance * 0.5 + search_trend * 0.3 + geographical_relevance * 0.2`).
3. **Featured Selection**: The highest-scoring occasion is marked as `is_featured = true`.
4. **Batch AI Generation**: The backend triggers Fal.ai / Replicate to generate 3-5 high-quality base images for the featured occasion in the background.
5. **Caching**: Uploads assets to AWS S3 / Cloudflare R2, then caches the JSON payload to Redis so the Next.js frontend has zero database reads on initial load.

---

## 3. Page Load Architecture
**Framework**: Next.js App Router utilizing **ISR (Incremental Static Regeneration)**.
**Workflow**:
- When the user hits the root `/` URL, Next.js instantly serves a statically cached HTML version of the page.
- The `HeroSection` performs a lightning-fast Redis read (`GET /api/today`) yielding the pre-generated S3 Image URLs, Featured Occasion Title, and default messages.
- The user is greeted by a premium, fully rendered visual of today's festival instantly.
- "Also Happening Today" events populate seamlessly utilizing standard non-AI metadata.

---

## 4. On-Demand Generation Architecture
**Workflow**:
- **"Generate More" / "Generate New Image"**: Fires `POST /api/generate/image`. This bypasses the Redis cache. The backend routes the request + user's personalized name to Flux.1/SDXL and returns a customized image iteration in ~2 seconds.
- **"Personalize with Name"**: Reuses the core image API but injects the `name` prompt parameter to render typography directly onto the generated aesthetic.
- **"Create with Your Photo"**: Standard Multi-part upload -> Cloudflare R2 -> Image-to-Image AI generation.

---

## 5. Video Strategy Recommendation
*Do not pre-generate videos.* It is financially unsustainable and most users simply want static graphics for WhatsApp/Instagram.
- **Strategy**: Video must be an explicit, opt-in feature.
- **Action**: When the user finds an image they love, they click "**Animate Variant**".
- **Backend Flow**: `POST /api/generate/video` securely sends the static Image URL to an Image-to-Video API (Runway Gen-3 or Luma Dream Machine). The API responds with a `Job ID`.
- **Frontend Handling**: The client falls into a polling state (`setInterval` every 5 seconds). The UI displays a "Rendering 4K Cinematic Scene..." skeleton loop over the image. 

---

## 6. Storage & Database Design
*Stack Recommendation: Supabase (PostgreSQL) + Upstash (Redis)*

**Table: `daily_occasions`**
- `id` (uuid, primary key)
- `date` (date) e.g., '2026-03-22'
- `events_json` (jsonb) [Array of mapped events and their translations]
- `featured_event_id` (varchar)
- `created_at` (timestamp)

**Table: `generated_assets`** (Your midnight cache)
- `id` (uuid)
- `occasion_id` (varchar)
- `asset_type` (enum: 'image', 'video')
- `asset_url` (varchar)
- `prompt_used` (text)
- `is_default` (boolean) -> *True if this is the midnight generated asset*

---

## 7. API and Folder Structure
```text
d:\FestivalAI\
├── app/
│   ├── api/
│   │   ├── cron/
│   │   │   └── daily-prep/route.ts      # Automated Midnight Generation
│   │   ├── content/
│   │   │   └── today/route.ts           # Redis Cache Fetcher for Fast Loads
│   │   ├── generate/
│   │   │   ├── image/route.ts           # On-Demand Image + Personalization
│   │   │   └── video/route.ts           # On-Demand Long-polling Video API
│   ├── page.tsx                         # Client/Server Component entry
├── components/
│   ├── HeroSection.tsx                  # Displays pre-generated content
│   ├── SecondaryEventsSection.tsx       # Also happening today
│   ├── PersonalizedStudioSection.tsx    # "Generate More" client component
```

---

## 8. MVP vs Future Roadmap
### Phase 1: MVP (Months 1-2)
- **Hardcode the Database**: Run `festivalCalendar.ts` array. No PostgreSQL yet.
- **Vercel Cron to Redis**: Use Vercel's free Cron feature to cache 1 premium image asset per day to a secure Vercel KV database.
- **Image-Only Pipeline**: Postpone video workflows entirely. Ensure aesthetic quality of images is 10/10.

### Phase 2: Future Premium Roadmap (Months 3+)
- **Video Subscriptions**: Lock video rendering behind an authentication wall or token system.
- **Multilingual Prompts**: Inject localized context into the LLM prompt engine to ensure AI natively generates Hindi/Tamil typography on the cards.
- **User Galleries**: Save user-specific `generated_assets` to their profile.

---

## 9. Fallback & Failure Handling
- **If generation fails / Cron crashes**: 
  - The `HeroSection` gracefully degrades to a generic fallback gradient or a static, hardcoded vector fallback (e.g., standard "Happy World Water Day" vector stored in `/public`).
- **If video is too slow**:
  - Enforce a strict 60-second polling timeout. If hit, alert the user: *"Servers at capacity! We'll email you when your video finishes rendering."* (Requires Auth). Alternatively, just cancel and keep the static image active.
- **If multiple events tie in rank**: 
  - Randomize selection per user or rotate them dynamically every hour via edge-caching.
- **If today has NO specific event**: 
  - Map to generic "Daily Motivation", "Good Morning", or "Spiritual Tuesday" concepts.

---

## 10. Final Honest Recommendation
**Start small, but start premium.** 
Do not let expensive, unpredictable video API generation bottleneck the launch of your platform. Your key differentiator is that FestivalAI looks and feels *faster and higher-quality* than generic WhatsApp forwards.
- Limit midnight pre-generation to **images only**. 
- Optimize your Prompt Engineering to yield flawless output specifically from **Flux.1 Schnell**. 
- Cache those results in Redis so that the very first pixel the user sees takes under 100ms to resolve.
- Only introduce video once you establish steady, validated traffic flow, keeping it strictly as an interactive "wow factor" upgrade.
