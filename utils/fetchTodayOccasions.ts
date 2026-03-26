/**
 * fetchTodayOccasions — Client-side utility
 *
 * Calls our own Next.js API route (/api/today-occasions)
 * which handles Calendarific + local DB merging server-side so the API key
 * is never exposed to the browser.
 */

export interface LiveOccasion {
  id: string;
  name: { en: string; hi?: string; te?: string };
  message: { en: string; hi?: string; te?: string };
  imageKeyword: string;
  popularityScore: number;
  source: 'local' | 'calendarific';
}

export interface TodayOccasionsResponse {
  date: string;
  year: number;
  occasions: LiveOccasion[];
}

export async function fetchTodayOccasions(): Promise<TodayOccasionsResponse | null> {
  try {
    const res = await fetch('/api/today-occasions', {
      // In the browser this is a relative URL — calls Next.js route handler
      cache: 'no-store', // Always fresh on page load
    });

    if (!res.ok) {
      console.warn('[FestivalAI] today-occasions API returned', res.status);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('[FestivalAI] Failed to fetch today occasions:', err);
    return null;
  }
}
