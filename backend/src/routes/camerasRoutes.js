import express from 'express';
import { camerasController } from '../controllers/devicesController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', camerasController.getAll);
router.post('/', protect, authorize('admin'), camerasController.create);
router.put('/:id', protect, authorize('admin'), camerasController.update);
router.delete('/:id', protect, authorize('admin'), camerasController.delete);

export default router;
