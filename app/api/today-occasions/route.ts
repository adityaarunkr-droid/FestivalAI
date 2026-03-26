import { NextResponse } from 'next/server';

/**
 * FestivalAI — Today's Occasions API Route
 *
 * Strategy: Hybrid approach
 *  1. Fetch from Google Calendar Public Holidays feed (100% free, no API key needed!)
 *  2. Merge with our curated local database (richer imageKeywords, Hindi/Telugu names)
 *  3. Fallback to local-only if Google API is unreachable
 */

interface OccasionPayload {
  id: string;
  name: { en: string; hi?: string; te?: string };
  message: { en: string; hi?: string; te?: string };
  imageKeyword: string;
  popularityScore: number;
  source: 'local' | 'google-calendar';
}

// ── Curated local database — richest data we control ───────────────
const localDatabase: Record<string, OccasionPayload[]> = {
  '03-23': [
    {
      id: 'shaheed-diwas',
      name: { en: 'Shaheed Diwas (Martyrs\' Day)', hi: 'शहीद दिवस', te: 'షహీద్ దివస్' },
      message: {
        en: 'Commemorating the legacy and sacrifice of Indian freedom fighters Bhagat Singh, Sukhdev, and Rajguru.',
        hi: 'भारतीय स्वतंत्रता सेनानियों भगत सिंह, सुखदेव और राजगुरु की विरासत और बलिदान का स्मरण।',
        te: 'భారత స్వాతంత్ర్య సమరయోధులు భగత్ సింగ్, సుఖ్‌దేవ్ మరియు రాజ్‌గురుల త్యాగాలను స్మరించుకోవడం.',
      },
      imageKeyword: 'india+freedom+heroes',
      popularityScore: 95,
      source: 'local',
    },
    {
      id: 'world-meteorological-day',
      name: { en: 'World Meteorological Day', hi: 'विश्व मौसम विज्ञान दिवस', te: 'ప్రపంచ వాతావరణ దినోత్సవం' },
      message: { en: 'Celebrating the contribution of meteorology to safety and society.', hi: 'सुरक्षा और समाज में मौसम विज्ञान के योगदान का जश्न।', te: 'భద్రత మరియు సమాజానికి వాతావరణ శాస్త్రం యొక్క కృషిని జరుపుకోవడం.' },
      imageKeyword: 'weather+nature+clouds',
      popularityScore: 85,
      source: 'local',
    },
    {
      id: 'national-puppy-day',
      name: { en: 'National Puppy Day', hi: 'राष्ट्रीय पिल्ला दिवस', te: 'జాతీయ కుక్కపిల్లల దినోత్సవం' },
      message: { en: 'A day to celebrate the magic puppies bring to our lives.', hi: 'हमारे जीवन में पिल्लों के जादू का जश्न मनाने का दिन।', te: 'కుక్కపిల్లలు మన జీవితంలోకి తెచ్చే ఆనందాన్ని జరుపుకునే రోజు.' },
      imageKeyword: 'cute+puppy+dog',
      popularityScore: 80,
      source: 'local',
    },
    {
      id: 'navratri-special',
      name: { en: 'Navratri Special', hi: 'नवरात्रि विशेष', te: 'నవరాత్రి స్పెషల్' },
      message: { en: 'A day for introspection and focus during the auspicious Navratri period.', hi: 'शुभ नवरात्रि अवधि के दौरान आत्मनिरीक्षण और ध्यान का दिन।', te: 'పవిత్రమైన నవరాత్రి సమయంలో ఆత్మపరిశీలన మరియు ధ్యానానికి ఒక రోజు.' },
      imageKeyword: 'navratri+devi+puja',
      popularityScore: 75,
      source: 'local',
    },
    {
      id: 'world-bear-day',
      name: { en: 'World Bear Day', hi: 'विश्व भालू दिवस', te: 'ప్రపంచ ఎలుగుబంటి దినోత్సవం' },
      message: { en: 'Focusing on bear conservation and protecting their natural habitats.', hi: 'भालू संरक्षण और उनके प्राकृतिक आवासों की रक्षा पर ध्यान देना।', te: 'ఎలుగుబంట్ల సంరక్షణ మరియు వాటి సహజ ఆవాసాల రక్షణపై దృష్టి సారించడం.' },
      imageKeyword: 'bear+wildlife+nature',
      popularityScore: 65,
      source: 'local',
    },
  ],
  '03-24': [
    {
      id: 'world-tb-day',
      name: { en: 'World Tuberculosis Day', hi: 'विश्व तपेदिक (TB) दिवस', te: 'ప్రపంచ క్షయవ్యాధి (TB) దినోత్సవం' },
      message: { 
        en: 'Raising public awareness about the devastating health, social and economic consequences of TB.', 
        hi: 'टीबी के विनाशकारी स्वास्थ्य, सामाजिक और आर्थिक परिणामों के बारे में जन जागरूकता बढ़ाना।', 
        te: 'క్షయవ్యాధి యొక్క వినాశకరమైన ఆరోగ్య, సామాజిక మరియు ఆర్థిక పరిణామాల గురించి ప్రజలకు అవగాహన పెంచడం.' 
      },
      imageKeyword: 'health+awareness+care',
      popularityScore: 90,
      source: 'local'
    },
    {
      id: 'right-to-truth-day',
      name: { en: 'International Day for Right to the Truth', hi: 'सत्य के अधिकार के लिए अंतर्राष्ट्रीय दिवस', te: 'సత్యం తెలుసుకునే హక్కు కోసం అంతర్జాతీయ దినోత్సవం' },
      message: { en: 'Honoring victims of gross human rights violations and promoting the importance of truth and justice.', hi: 'मानवाधिकार उल्लंघनों के पीड़ितों का सम्मान और सत्य और न्याय के महत्व को बढ़ावा देना।', te: 'మానవ హక్కుల ఉల్లంఘనల బాధితులను సత్కరించడం మరియు సత్యం మరియు న్యాయం యొక్క ప్రాముఖ్యతను ప్రోత్సహించడం.' },
      imageKeyword: 'justice+peace+truth',
      popularityScore: 80,
      source: 'local'
    }
  ]
};

const fallbackOccasion: OccasionPayload = {
  id: 'beautiful-day',
  name: { en: 'Beautiful Day', hi: 'खूबसूरत दिन', te: 'అందమైన రోజు' },
  message: { en: 'Every day is a gift. Make today amazingly special.', hi: 'हर दिन एक उपहार है। आज को बेहद खास बनाएं।', te: 'ప్రతి రోజు ఒక బహుమతి. ఈ రోజుని ప్రత్యేకంగా మార్చుకోండి.' },
  imageKeyword: 'sunshine+happy+celebration',
  popularityScore: 50,
  source: 'local',
};

// ── Google Calendar ICS Fetcher ─────────────────────────────────────
async function fetchFromGoogleCalendar(year: number, month: number, day: number): Promise<OccasionPayload[]> {
  try {
    const targetDateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    // Public official holidays ICS feed for India
    const url = 'https://calendar.google.com/calendar/ical/en.indian%23holiday%40group.v.calendar.google.com/public/basic.ics';
    
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1 hour
    if (!res.ok) return [];
    
    const text = await res.text();
    const liveOccasions: OccasionPayload[] = [];
    
    // Parse the ICS file manually looking for today's date
    const lines = text.split('\n');
    let insideEvent = false;
    let eventDate = '';
    let eventSummary = '';
    
    for (const line of lines) {
      if (line.trim() === 'BEGIN:VEVENT') {
        insideEvent = true;
        eventDate = '';
        eventSummary = '';
      } else if (line.trim() === 'END:VEVENT') {
        insideEvent = false;
        if (eventDate.includes(targetDateStr) && eventSummary) {
          liveOccasions.push({
            id: eventSummary.toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-z0-9-]/g, ''),
            name: { en: eventSummary },
            message: { en: `Celebrating ${eventSummary} today. A special day to mark with joy.` },
            imageKeyword: eventSummary.toLowerCase().replace(/\s/g, '+'),
            popularityScore: 75,
            source: 'google-calendar',
          });
        }
      } else if (insideEvent) {
        if (line.startsWith('DTSTART')) {
          eventDate = line.split(':')[1]?.trim() || '';
        } else if (line.startsWith('SUMMARY:')) {
          eventSummary = line.substring(8).trim();
        }
      }
    }
    
    return liveOccasions;
  } catch (err) {
    console.error('[FestivalAI] Google Calendar fetch failed:', err);
    return [];
  }
}

// ── Merge & deduplicate ─────────────────────────────────────────────
function mergeOccasions(local: OccasionPayload[], live: OccasionPayload[]): OccasionPayload[] {
  const seen = new Set<string>(local.map(o => o.id));
  const merged = [...local];

  for (const liveOcc of live) {
    if (!seen.has(liveOcc.id)) {
      seen.add(liveOcc.id);
      merged.push(liveOcc);
    }
  }

  return merged.sort((a, b) => b.popularityScore - a.popularityScore);
}

// ── Route handler ───────────────────────────────────────────────────
export async function GET() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();
  const dateKey = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const localOccasions = localDatabase[dateKey] ?? [];
  const liveOccasions = await fetchFromGoogleCalendar(year, month, day);
  const merged = mergeOccasions(localOccasions, liveOccasions);
  const occasions = merged.length > 0 ? merged : [fallbackOccasion];

  return NextResponse.json({ date: dateKey, year, occasions });
}
