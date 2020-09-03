import fs from "fs";
import Database, { Statement } from "better-sqlite3";
import structure from './db/structure.sql';
import path from 'path';

const db = new Database(path.join(__dirname, 'cleargrass.db'), {
  verbose: console.log,
});

console.log(structure);

const migration = fs.readFileSync(path.join(__dirname, structure), "utf8");
db.exec(migration);

export const saveReading = db.prepare(
  "INSERT INTO readings(timestamp, temperature, humidity) VALUES(datetime('now', 'localtime'), :temperature, :humidity)",
);

export const lastTimestamp = db.prepare(
  "SELECT timestamp FROM readings ORDER BY id DESC LIMIT 1",
);

export const reading = db.prepare("SELECT * FROM readings WHERE id = ?");

export const allReadings = db.prepare("SELECT DISTINCT * FROM readings");
