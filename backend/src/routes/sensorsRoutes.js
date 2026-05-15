import express from 'express';
import { sensorsController } from '../controllers/devicesController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', sensorsController.getAll);
router.post('/', protect, authorize('admin'), sensorsController.create);
router.put('/:id', protect, authorize('admin'), sensorsController.update);
router.delete('/:id', protect, authorize('admin'), sensorsController.delete);

export default router;
