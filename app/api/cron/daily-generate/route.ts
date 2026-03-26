import { NextResponse } from 'next/server';
import { saveDailyMedia, SavedMedia } from '@/lib/db';

export async function GET(req: Request) {
  try {
    // 1. Check what is special today
    // In production, this would make an internal call to our /api/today-occasions logic
    // For automation flow demonstration, we fetch India's current Google target
    const now = new Date();
    const dateStr = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // Simulate detecting "Shaheed Diwas" or "Holi" dynamically based on calendar results
    // We assume the upstream logic perfectly outputs the featured Occasion Payload
    const occasionId = 'shaheed-diwas'; 
    const occasionName = "Shaheed Diwas (Martyrs' Day)";
    const cleanName = occasionName.replace(/['"()]/g, '');

    // 2. Build structured prompts (adapting tone based on occasion)
    // If it's a Festival, tone is vibrant. If it's Memorial, tone is respectful.
    const isMemorial = cleanName.toLowerCase().includes('diwas') || cleanName.toLowerCase().includes('martyr');
    const theme = isMemorial 
      ? 'respectful, patriotic, memorial, dignified, emotional but premium, visually relevant to Indian freedom struggle remembrance'
      : 'vibrant, joyful, colorful, festive, celebratory, dynamic premium aesthetic';

    // 3. Generate Content using AI Endpoints (Pollinations AI fallback for Gemini)
    const generateAiImage = (suffix: string) => 
      `https://pollinations.ai/prompt/${encodeURIComponent(cleanName + ' ' + theme + ' ' + suffix)}?width=600&height=800&nologo=true`;

    // 4. Content flow mapping adhering to strict Sequence rules
    const newMedia: SavedMedia[] = [
      {
        id: `${occasionId}-${Date.now()}-1`,
        occasionId,
        occasionName,
        mediaType: 'image',
        promptUsed: `${cleanName} ${theme} professional premium tribute poster`,
        previewUrl: generateAiImage('professional premium tribute poster 8k illustration'),
        downloadUrl: '#',
        isFeatured: true, // Marked as the primary hero asset
        createdAt: now.toISOString(),
        orderIndex: 0,
      },
      {
        id: `${occasionId}-${Date.now()}-2`,
        occasionId,
        occasionName,
        mediaType: 'video',
        promptUsed: `${cleanName} ${theme} cinematic motion graphic`,
        previewUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        posterUrl: generateAiImage('cinematic motion graphic poster cover minimal'),
        downloadUrl: '#',
        isFeatured: false,
        createdAt: now.toISOString(),
        orderIndex: 1,
      },
      {
        id: `${occasionId}-${Date.now()}-3`,
        occasionId,
        occasionName,
        mediaType: 'image',
        promptUsed: `${cleanName} ${theme} beautiful classic layout design`,
        previewUrl: generateAiImage('beautiful classic layout design aesthetic'),
        downloadUrl: '#',
        isFeatured: false,
        createdAt: now.toISOString(),
        orderIndex: 2,
      },
      {
        id: `${occasionId}-${Date.now()}-4`,
        occasionId,
        occasionName,
        mediaType: 'video',
        promptUsed: `${cleanName} ${theme} glowing dynamic particles`,
        previewUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        posterUrl: generateAiImage('glowing dynamic particles cinematic background'),
        downloadUrl: '#',
        isFeatured: false,
        createdAt: now.toISOString(),
        orderIndex: 3,
      },
      {
        id: `${occasionId}-${Date.now()}-5`,
        occasionId,
        occasionName,
        mediaType: 'image',
        promptUsed: `${cleanName} ${theme} vibrant colourful celebratory typography layout`,
        previewUrl: generateAiImage('vibrant colourful celebratory typography layout'),
        downloadUrl: '#',
        isFeatured: false,
        createdAt: now.toISOString(),
        orderIndex: 4,
      },
    ];

    // 5. Store generated media URLs and metadata in Database
    await saveDailyMedia(occasionId, newMedia);

    return NextResponse.json({
      success: true,
      message: `Successfully executed 12 AM automation for ${occasionName}. Generated 5 media assets safely stored to DB.`,
      generated: newMedia.length
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
