import fs from 'fs/promises';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'server', 'database.json');

const DEFAULT_DATA = {
  leads: [],
  visits: [],
  activities: []
};

// Ensure DB exists
export async function initDB() {
  try {
    await fs.access(DB_FILE);
  } catch (err) {
    console.log('📦 Creating local JSON database at', DB_FILE);
    await fs.writeFile(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf8');
  }
}

export async function readDB() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return DEFAULT_DATA;
    }
    throw err;
  }
}

export async function writeDB(data) {
  // Use a temporary file for atomic writes
  const tempFile = DB_FILE + '.tmp';
  await fs.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tempFile, DB_FILE);
}
