import { db } from '../config/db.js';

const tables = {
  cameras: 'cameras',
  sensors: 'sensors',
};

const assertTable = (table) => {
  if (!tables[table]) {
    const error = new Error('Invalid device table.');
    error.statusCode = 400;
    throw error;
  }

  return tables[table];
};

const mapDevice = (device) => device ? {
  ...device,
  id: String(device.id),
  _id: String(device.id),
} : null;

const Device = {
  async findAll(table) {
    const safeTable = assertTable(table);
    return db.prepare(`SELECT * FROM ${safeTable} ORDER BY createdAt DESC, id DESC`).all().map(mapDevice);
  },

  async findById(table, id) {
    const safeTable = assertTable(table);
    return mapDevice(db.prepare(`SELECT * FROM ${safeTable} WHERE id = ?`).get(id));
  },

  async create(table, data) {
    const safeTable = assertTable(table);
    const result = db.prepare(`
      INSERT INTO ${safeTable} (name, location, status)
      VALUES (?, ?, ?)
    `).run(
      data.name,
      data.location || '',
      data.status || 'online'
    );

    return this.findById(table, result.lastInsertRowid);
  },

  async update(table, id, data) {
    const safeTable = assertTable(table);
    const current = await this.findById(table, id);
    if (!current) return null;

    db.prepare(`
      UPDATE ${safeTable}
      SET name = ?, location = ?, status = ?
      WHERE id = ?
    `).run(
      data.name ?? current.name,
      data.location ?? current.location,
      data.status ?? current.status,
      id
    );

    return this.findById(table, id);
  },

  async delete(table, id) {
    const safeTable = assertTable(table);
    return db.prepare(`DELETE FROM ${safeTable} WHERE id = ?`).run(id).changes > 0;
  },
};

export default Device;
