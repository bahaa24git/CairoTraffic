import { db } from '../config/db.js';

const mapNews = (item) => item ? {
  ...item,
  id: String(item.id),
  _id: String(item.id),
  isPublished: Boolean(item.isPublished),
} : null;

const News = {
  async findAll() {
    return db.prepare('SELECT * FROM news ORDER BY publishedAt DESC, id DESC').all().map(mapNews);
  },

  async findById(id) {
    return mapNews(db.prepare('SELECT * FROM news WHERE id = ?').get(id));
  },

  async create(data) {
    const result = db.prepare(`
      INSERT INTO news (title, content, imageUrl, category, publishedAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      data.title,
      data.content,
      data.imageUrl || '',
      data.category || 'traffic',
      data.publishedAt || new Date().toISOString()
    );

    return this.findById(result.lastInsertRowid);
  },

  async update(id, data) {
    const current = await this.findById(id);
    if (!current) return null;

    db.prepare(`
      UPDATE news
      SET title = ?, content = ?, imageUrl = ?, category = ?, publishedAt = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.title ?? current.title,
      data.content ?? current.content,
      data.imageUrl ?? current.imageUrl,
      data.category ?? current.category,
      data.publishedAt ?? current.publishedAt,
      id
    );

    return this.findById(id);
  },

  async delete(id) {
    return db.prepare('DELETE FROM news WHERE id = ?').run(id).changes > 0;
  },
};

export default News;
