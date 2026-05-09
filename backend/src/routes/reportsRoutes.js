import express from 'express';
import { getCongestionReport, getIncidentsReport, getSummary } from '../controllers/reportsController.js';

const router = express.Router();

router.get('/summary', getSummary);
router.get('/congestion', getCongestionReport);
router.get('/incidents', getIncidentsReport);

export default router;
