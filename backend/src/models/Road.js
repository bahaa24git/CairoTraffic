import { db } from '../config/db.js';

const mapRoad = (road) => road ? {
  ...road,
  id: String(road.id),
  _id: String(road.id),
  lengthKm: Number(road.lengthKm),
  averageSpeed: Number(road.averageSpeed),
  congestionPercentage: Number(road.congestionPercentage),
  isActive: Boolean(road.isActive),
} : null;

const Road = {
  async findAll() {
    return db.prepare('SELECT * FROM roads ORDER BY congestionPercentage DESC, name ASC').all().map(mapRoad);
  },

  async findById(id) {
    return mapRoad(db.prepare('SELECT * FROM roads WHERE id = ?').get(id));
  },

  async create(data) {
    const result = db.prepare(`
      INSERT INTO roads (name, area, lengthKm, status, averageSpeed, congestionPercentage)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      data.name,
      data.area || '',
      Number(data.lengthKm ?? data.length ?? 0),
      data.status || 'smooth',
      Number(data.averageSpeed ?? data.avgSpeed ?? 0),
      Number(data.congestionPercentage || 0)
    );

    return this.findById(result.lastInsertRowid);
  },

  async update(id, data) {
    const current = await this.findById(id);
    if (!current) return null;

    db.prepare(`
      UPDATE roads
      SET name = ?, area = ?, lengthKm = ?, status = ?, averageSpeed = ?, congestionPercentage = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.name ?? current.name,
      data.area ?? current.area,
      Number(data.lengthKm ?? data.length ?? current.lengthKm),
      data.status ?? current.status,
      Number(data.averageSpeed ?? data.avgSpeed ?? current.averageSpeed),
      Number(data.congestionPercentage ?? current.congestionPercentage),
      id
    );

    return this.findById(id);
  },

  async delete(id) {
    return db.prepare('DELETE FROM roads WHERE id = ?').run(id).changes > 0;
  },
};

export default Road;
