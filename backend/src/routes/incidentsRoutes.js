import express from 'express';
import { createIncident, deleteIncident, getIncidents, updateIncident } from '../controllers/incidentsController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getIncidents);
router.post('/', protect, authorize('admin'), createIncident);
router.put('/:id', protect, authorize('admin'), updateIncident);
router.delete('/:id', protect, authorize('admin'), deleteIncident);

export default router;
