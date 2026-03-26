import { NextResponse } from 'next/server';
import { getDailyMedia } from '@/lib/db';
import { getContentForOccasion } from '@/utils/festivalCalendar';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing occasion ID' }, { status: 400 });
  }

  try {
    // 1. Check automation database first (Stored results from 12:00 AM Cron)
    const storedMedia = await getDailyMedia(id);
    
    if (storedMedia && storedMedia.length > 0) {
      // Map stored DB schema back into ContentItem expected by Frontend
      const mapped = storedMedia.map(m => ({
        id: m.id,
        occasionId: m.occasionId,
        mediaType: m.mediaType,
        previewUrl: m.previewUrl,
        posterUrl: m.posterUrl,
        downloadUrl: m.downloadUrl,
        title: m.occasionName + ' Generated Asset'
      }));
      return NextResponse.json({ items: mapped, source: 'cron-db' });
    }

    // 2. Fallback instantly to the original hybrid generator
    const fallback = getContentForOccasion(id);
    return NextResponse.json({ items: fallback, source: 'fallback-generator' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
