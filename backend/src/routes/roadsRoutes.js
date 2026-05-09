import express from 'express';
import { createRoad, deleteRoad, getRoad, getRoads, updateRoad } from '../controllers/roadsController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getRoads);
router.get('/:id', getRoad);
router.post('/', protect, authorize('admin'), createRoad);
router.put('/:id', protect, authorize('admin'), updateRoad);
router.delete('/:id', protect, authorize('admin'), deleteRoad);

export default router;
