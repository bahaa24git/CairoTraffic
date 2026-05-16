import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';

function getDatabasePath() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl && databaseUrl.startsWith('sqlite:///')) {
    return path.resolve(process.cwd(), databaseUrl.replace('sqlite:///', ''));
  }

  const dbFile = process.env.DB_FILE || './data/cairo_traffic.sqlite';
  return path.resolve(process.cwd(), dbFile);
}

const dbPath = getDatabasePath();
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');


function seedDefaultTrafficData() {
  const roadsCount = db.prepare('SELECT COUNT(*) AS count FROM roads').get().count;
  if (roadsCount === 0) {
    const insertRoad = db.prepare(`
      INSERT INTO roads (name, area, lengthKm, status, averageSpeed, congestionPercentage)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    [
      ['طريق صلاح سالم', 'مدينة نصر / مصر الجديدة', 14.5, 'severe', 18, 88],
      ['كوبري أكتوبر', 'وسط البلد / الجيزة', 20.5, 'congested', 24, 76],
      ['كورنيش النيل', 'المعادي / وسط البلد', 18.2, 'moderate', 36, 52],
      ['محور 26 يوليو', 'الزمالك / الشيخ زايد', 23.0, 'congested', 27, 69],
      ['الدائري', 'القاهرة الكبرى', 106.0, 'moderate', 42, 48],
      ['شارع الهرم', 'الجيزة', 11.0, 'severe', 16, 91],
    ].forEach((road) => insertRoad.run(...road));
  }

  const newsCount = db.prepare('SELECT COUNT(*) AS count FROM news').get().count;
  if (newsCount === 0) {
    const insertNews = db.prepare(`
      INSERT INTO news (title, content, imageUrl, category, publishedAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    [
      ['تحديث مروري في وسط القاهرة', 'كثافات متوسطة متوقعة في محيط وسط البلد خلال ساعات الذروة.', '', 'traffic', new Date().toISOString()],
      ['أعمال صيانة على بعض المحاور', 'يرجى استخدام الطرق البديلة أثناء تنفيذ أعمال الصيانة.', '', 'maintenance', new Date(Date.now() - 86400000).toISOString()],
      ['تحسن السيولة المرورية صباحاً', 'انخفاض نسبي في زمن الرحلات على عدد من المحاور الرئيسية.', '', 'traffic', new Date(Date.now() - 172800000).toISOString()],
    ].forEach((item) => insertNews.run(...item));
  }

  const camerasCount = db.prepare('SELECT COUNT(*) AS count FROM cameras').get().count;
  if (camerasCount === 0) {
    const insertCamera = db.prepare('INSERT INTO cameras (name, location, status) VALUES (?, ?, ?)');
    [
      ['Camera 1', 'كوبري أكتوبر', 'online'],
      ['Camera 2', 'صلاح سالم', 'online'],
      ['Camera 3', 'الدائري', 'offline'],
      ['Camera 4', 'كورنيش النيل', 'online'],
    ].forEach((camera) => insertCamera.run(...camera));
  }

  const sensorsCount = db.prepare('SELECT COUNT(*) AS count FROM sensors').get().count;
  if (sensorsCount === 0) {
    const insertSensor = db.prepare('INSERT INTO sensors (name, location, status) VALUES (?, ?, ?)');
    [
      ['Radar 1', 'كوبري أكتوبر', 'online'],
      ['Radar 2', 'صلاح سالم', 'online'],
      ['Radar 3', 'الدائري', 'online'],
      ['Radar 4', 'شارع الهرم', 'maintenance'],
    ].forEach((sensor) => insertSensor.run(...sensor));
  }

  const incidentsCount = db.prepare('SELECT COUNT(*) AS count FROM incidents').get().count;
  if (incidentsCount === 0) {
    const insertIncident = db.prepare('INSERT INTO incidents (title, type, severity, status, location) VALUES (?, ?, ?, ?, ?)');
    [
      ['تعطل سيارة', 'breakdown', 'medium', 'active', 'كوبري أكتوبر'],
      ['حادث بسيط', 'accident', 'high', 'active', 'شارع الهرم'],
      ['ازدحام بسبب أعمال صيانة', 'maintenance', 'medium', 'resolved', 'الدائري'],
    ].forEach((incident) => insertIncident.run(...incident));
  }
}

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastLoginAt TEXT
    );

    CREATE TABLE IF NOT EXISTS roads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      area TEXT NOT NULL DEFAULT '',
      lengthKm REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'smooth' CHECK(status IN ('smooth', 'moderate', 'congested', 'severe')),
      averageSpeed REAL NOT NULL DEFAULT 0,
      congestionPercentage INTEGER NOT NULL DEFAULT 0 CHECK(congestionPercentage >= 0 AND congestionPercentage <= 100),
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      imageUrl TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'traffic',
      isPublished INTEGER NOT NULL DEFAULT 1,
      publishedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cameras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'online' CHECK(status IN ('online', 'offline', 'maintenance')),
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sensors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'online' CHECK(status IN ('online', 'offline', 'maintenance')),
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'traffic',
      severity TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'resolved')),
      location TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedDefaultTrafficData();

  console.log(`SQLite connected: ${dbPath}`);
}

export async function connectDB() {
  initDB();
}

initDB();
