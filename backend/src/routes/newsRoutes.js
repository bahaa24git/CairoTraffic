import express from 'express';
import { createNews, deleteNews, getNews, updateNews } from '../controllers/newsController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getNews);
router.post('/', protect, authorize('admin'), createNews);
router.put('/:id', protect, authorize('admin'), updateNews);
router.delete('/:id', protect, authorize('admin'), deleteNews);

export default router;
