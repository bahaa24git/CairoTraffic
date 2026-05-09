import { db } from '../config/db.js';

const count = (sql) => db.prepare(sql).get().value;

export const getSummary = async (req, res, next) => {
  try {
    const totalRoads = count('SELECT COUNT(*) AS value FROM roads');
    const congestedRoads = count("SELECT COUNT(*) AS value FROM roads WHERE status IN ('congested', 'severe')");

    const speedRow = db.prepare('SELECT AVG(averageSpeed) AS value FROM roads').get();
    const camerasRow = db.prepare('SELECT COUNT(*) AS total, SUM(CASE WHEN status = \'online\' THEN 1 ELSE 0 END) AS online FROM cameras').get();
    const sensorsRow = db.prepare('SELECT COUNT(*) AS total, SUM(CASE WHEN status = \'online\' THEN 1 ELSE 0 END) AS online FROM sensors').get();

    res.json({
      totalRoads,
      congestedRoads,
      activeIncidents: count("SELECT COUNT(*) AS value FROM incidents WHERE status = 'active'"),
      avgSpeed: Math.round(Number(speedRow.value || 0)),
      totalCameras: Number(camerasRow.total || 0),
      camerasOnline: Number(camerasRow.online || 0),
      totalSensors: Number(sensorsRow.total || 0),
      sensorsOnline: Number(sensorsRow.online || 0),
    });
  } catch (error) {
    next(error);
  }
};

export const getCongestionReport = async (req, res, next) => {
  try {
    const roads = db.prepare(`
      SELECT name, area, status, congestionPercentage, averageSpeed
      FROM roads
      ORDER BY congestionPercentage DESC
    `).all();

    res.json({ roads });
  } catch (error) {
    next(error);
  }
};

export const getIncidentsReport = async (req, res, next) => {
  try {
    const incidents = db.prepare(`
      SELECT type, status, severity, COUNT(*) AS count
      FROM incidents
      GROUP BY type, status, severity
      ORDER BY count DESC
    `).all();

    res.json({ incidents });
  } catch (error) {
    next(error);
  }
};
