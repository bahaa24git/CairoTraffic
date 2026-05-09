import News from '../models/News.js';

export const getNews = async (req, res, next) => {
  try {
    const news = await News.findAll();
    res.json({ news });
  } catch (error) {
    next(error);
  }
};

export const createNews = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const newsItem = await News.create(req.body);
    res.status(201).json({ news: newsItem });
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (req, res, next) => {
  try {
    const newsItem = await News.update(req.params.id, req.body);
    if (!newsItem) return res.status(404).json({ message: 'News item not found.' });
    res.json({ news: newsItem });
  } catch (error) {
    next(error);
  }
};

export const deleteNews = async (req, res, next) => {
  try {
    const deleted = await News.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'News item not found.' });
    res.json({ message: 'News item deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
