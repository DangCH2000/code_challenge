import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const connectDB = async () => {
  // Use `sqlite` to connect database
  const db = await open({
    filename: './database.sqlite', // File SQLite
    driver: sqlite3.Database,     // Driver SQLite3
  });

  // Create table if not is exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
};
