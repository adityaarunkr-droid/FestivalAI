import { Language } from './translations';

export type LocalizedString = Partial<Record<Language, string>> & { en: string };

export interface Occasion {
  id: string;
  name: LocalizedString;
  message: LocalizedString;
  imageKeyword: string;
  popularityScore: number;
}

// A straightforward database structured around Month-Day strings
const occasionDatabase: Record<string, Occasion[]> = {
  // March 23 — today's primary occasion is Holi + concurrent days
  '03-23': [
    {
      id: 'holi',
      name: {
        en: "Holi",
        hi: "होली",
        te: "హోళీ"
      },
      message: {
        en: "Celebrate the festival of colors with AI-crafted greeting cards, short motion reels, and premium share-ready downloads.",
        hi: "रंगों के त्योहार को AI-निर्मित ग्रीटिंग कार्ड, मोशन रील्स और शेयर-रेडी डाउनलोड के साथ मनाएं।",
        te: "రంగుల పండుగను AI-రూపొందించిన గ్రీటింగ్ కార్డులు, మోషన్ రీల్స్‌తో జరుపుకోండి."
      },
      imageKeyword: "holi+colors+festival",
      popularityScore: 98
    },
    {
      id: 'world-poetry-day',
      name: {
        en: "World Poetry Day",
        hi: "विश्व कविता दिवस",
        te: "ప్రపంచ కవిత్వ దినోత్సవం"
      },
      message: {
        en: "Words can change the world.",
        hi: "शब्द दुनिया बदल सकते हैं।",
        te: "పదాలు ప్రపంచాన్ని మార్చగలవు."
      },
      imageKeyword: "poetry+writing",
      popularityScore: 80
    },
    {
      id: 'intl-forests-day',
      name: {
        en: "International Day of Forests",
        hi: "अंतर्राष्ट्रीय वन दिवस",
        te: "అంతర్జాతీయ అటవీ దినోత్సవం"
      },
      message: {
        en: "Protecting our green planet for future generations.",
        hi: "भविष्य की पीढ़ियों के लिए हमारे हरे ग्रह की रक्षा करना।",
        te: "భవిష్యత్ తరాల కోసం మన పచ్చటి గ్రహాన్ని రక్షించడం."
      },
      imageKeyword: "forest+nature",
      popularityScore: 75
    },
    {
      id: 'world-puppetry-day',
      name: {
        en: "World Puppetry Day",
        hi: "विश्व कठपुतली दिवस",
        te: "తోలుబొమ్మల దినోత్సవం"
      },
      message: {
        en: "Celebrating the ancient art of storytelling.",
        hi: "कहानी कहने की प्राचीन कला का जश्न।",
        te: "ప్రాచీన కథలు చెప్పే కళను జరుపుకోవడం."
      },
      imageKeyword: "puppet+theatre",
      popularityScore: 65
    }
  ],
  // March 22 — kept for reference / demo
  '03-22': [
    {
      id: 'world-poetry-day',
      name: {
        en: "World Poetry Day",
        hi: "विश्व कविता दिवस",
        te: "ప్రపంచ కవిత్వ దినోత్సవం"
      },
      message: {
        en: "Words can change the world.",
        hi: "शब्द दुनिया बदल सकते हैं।",
        te: "పదాలు ప్రపంచాన్ని మార్చగలవు."
      },
      imageKeyword: "poetry+writing",
      popularityScore: 90
    },
    {
      id: 'world-puppetry-day',
      name: {
        en: "World Puppetry Day",
        hi: "विश्व कठपुतली दिवस",
        te: "తోలుబొమ్మల దినోత్సవం"
      },
      message: {
        en: "Celebrating the ancient art of storytelling.",
        hi: "कहानी कहने की प्राचीन कला का जश्न।",
        te: "ప్రాచీన కథలు చెప్పే కళను జరుపుకోవడం."
      },
      imageKeyword: "puppet+theatre",
      popularityScore: 70
    },
    {
      id: 'world-water-day',
      name: {
        en: "World Water Day",
        hi: "विश्व जल दिवस",
        te: "ప్రపంచ జల దినోత్సవం"
      },
      message: {
        en: "Valuing every drop. Celebrate the essence of life and nature.",
        hi: "हर बूंद की कीमत। जीवन और प्रकृति के सार का जश्न मनाएं।",
        te: "ప్రతి నీటి బొట్టుకు విలువ ఇవ్వండి. అద్భుతమైన పర్యావరణాన్ని కాపాడుకోండి."
      },
      imageKeyword: "pure+water+nature",
      popularityScore: 85
    },
    {
      id: 'intl-forests-day',
      name: {
        en: "Intl. Day of Forests",
        hi: "अंतर्राष्ट्रीय वन दिवस",
        te: "అంతర్జాతీయ అటవీ దినోత్సవం"
      },
      message: {
        en: "Protecting our green planet for future generations.",
        hi: "भविष्य की पीढ़ियों के लिए हमारे हरे ग्रह की रक्षा करना।",
        te: "భవిష్యత్ తరాల కోసం మన పచ్చటి గ్రహాన్ని రక్షించడం."
      },
      imageKeyword: "forest+nature",
      popularityScore: 80
    }
  ]
};

const fallbackOccasions: Occasion[] = [
  {
    id: 'beautiful-day',
    name: {
      en: "Beautiful Day",
      hi: "खूबसूरत दिन",
      te: "అందమైన రోజు"
    },
    message: {
      en: "Every day is a gift. Make today amazingly special.",
      hi: "हर दिन एक उपहार है। आज को बेहद खास बनाएं।",
      te: "ప్రతి రోజు ఒక బహుమతి. ఈ రోజుని ప్రత్యేకంగా మార్చుకోండి."
    },
    imageKeyword: "sunshine+happy",
    popularityScore: 50
  }
];

export function getTodayOccasions(): Occasion[] {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${month}-${day}`;

  const occasions = occasionDatabase[dateKey] || fallbackOccasions;
  // Always sort descending by popularity score so the highest is featured first
  return [...occasions].sort((a, b) => b.popularityScore - a.popularityScore);
}

export interface ContentItem {
  id: string;
  occasionId: string;
  mediaType: 'image' | 'video';
  previewUrl: string;
  posterUrl?: string;
  downloadUrl: string;
  title: string;
}

export function getContentForOccasion(
  occasionId: string,
  overrides?: { name?: string; imageKeyword?: string }
): ContentItem[] {
  const occasionsFlat = [...Object.values(occasionDatabase).flat(), ...fallbackOccasions];
  const occ = occasionsFlat.find(o => o.id === occasionId);

  // Use local DB data if found, else use overrides (from Calendarific), else use the id itself
  const keyword = occ ? occ.imageKeyword : (overrides?.imageKeyword ?? occasionId.replace(/-/g, '+'));
  const label = occ?.name.en ?? overrides?.name ?? 'Special';

  // Sanitize label to prevent URL breakage (e.g., removing apostrophes, brackets)
  const safeLabel = label.replace(/['"()\[\]]/g, '');

  // Using Pollinations AI's active endpoint to instantly generate images perfectly matching the occasion
  const getAiImage = (suffix: string) =>
    `https://pollinations.ai/prompt/${encodeURIComponent(safeLabel + ' ' + suffix)}?width=600&height=800&nologo=true`;

  return [
    {
      id: `${occasionId}-1`,
      occasionId,
      mediaType: 'image',
      previewUrl: getAiImage('beautiful professional poster high quality 8k'),
      downloadUrl: '#',
      title: `${label} Greetings Card`
    },
    {
      id: `${occasionId}-2`,
      occasionId,
      mediaType: 'video',
      previewUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      posterUrl: getAiImage('cinematic motion graphic background 4k'),
      downloadUrl: '#',
      title: `${label} Celebration Video`
    },
    {
      id: `${occasionId}-3`,
      occasionId,
      mediaType: 'image',
      previewUrl: getAiImage('elegant aesthetic minimal design portrait'),
      downloadUrl: '#',
      title: `${label} Artistic Design`
    },
    {
      id: `${occasionId}-4`,
      occasionId,
      mediaType: 'video',
      previewUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      posterUrl: getAiImage('dynamic glowing particle abstract theme'),
      downloadUrl: '#',
      title: `${label} Festival Reel`
    },
    {
      id: `${occasionId}-5`,
      occasionId,
      mediaType: 'video',
      previewUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      posterUrl: getAiImage('heroic inspirational powerful scene 4k'),
      downloadUrl: '#',
      title: `${label} Motion Card`
    },
    {
      id: `${occasionId}-6`,
      occasionId,
      mediaType: 'image',
      previewUrl: getAiImage('vibrant colourful celebratory typography layout'),
      downloadUrl: '#',
      title: `${label} Classic Greeting`
    },
  ];
}
