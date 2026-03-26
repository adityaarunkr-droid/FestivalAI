import fs from 'fs';
import path from 'path';

export interface SavedMedia {
  id: string;
  occasionId: string;
  occasionName: string;
  mediaType: 'image' | 'video';
  promptUsed: string;
  previewUrl: string;
  posterUrl?: string;
  downloadUrl: string;
  isFeatured: boolean;
  createdAt: string;
  orderIndex: number;
}

// Emulating a storage mechanism (e.g. Postgres DB / Prisma) securely for Local/Serverless environments
const dataDir = path.join(process.cwd(), '.data');
const dbPath = path.join(dataDir, 'daily-media.json');

export async function initDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}), 'utf-8');
  }
}

export async function getDailyMedia(occasionId: string): Promise<SavedMedia[]> {
  await initDb();
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(raw);
    return data[occasionId] || [];
  } catch (err) {
    return [];
  }
}

export async function saveDailyMedia(occasionId: string, items: SavedMedia[]): Promise<void> {
  await initDb();
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const data = JSON.parse(raw);
    data[occasionId] = items;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save daily media to DB', err);
  }
}
