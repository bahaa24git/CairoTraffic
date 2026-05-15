import { db } from '../config/db.js';

const mapIncident = (incident) => incident ? {
  ...incident,
  id: String(incident.id),
  _id: String(incident.id),
} : null;

const Incident = {
  async findAll(filters = {}) {
    const where = [];
    const params = [];

    if (filters.status) {
      where.push('status = ?');
      params.push(filters.status);
    }

    if (filters.type) {
      where.push('type = ?');
      params.push(filters.type);
    }

    const sql = `
      SELECT *
      FROM incidents
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY status ASC, createdAt DESC
    `;

    return db.prepare(sql).all(...params).map(mapIncident);
  },

  async findById(id) {
    return mapIncident(db.prepare('SELECT * FROM incidents WHERE id = ?').get(id));
  },

  async create(data) {
    const result = db.prepare(`
      INSERT INTO incidents (title, type, severity, status, location)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      data.title,
      data.type || 'traffic',
      data.severity || 'medium',
      data.status || 'active',
      data.location || ''
    );

    return this.findById(result.lastInsertRowid);
  },

  async update(id, data) {
    const current = await this.findById(id);
    if (!current) return null;

    db.prepare(`
      UPDATE incidents
      SET title = ?, type = ?, severity = ?, status = ?, location = ?
      WHERE id = ?
    `).run(
      data.title ?? current.title,
      data.type ?? current.type,
      data.severity ?? current.severity,
      data.status ?? current.status,
      data.location ?? current.location,
      id
    );

    return this.findById(id);
  },

  async delete(id) {
    return db.prepare('DELETE FROM incidents WHERE id = ?').run(id).changes > 0;
  },
};

export default Incident;
