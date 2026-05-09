import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import roadsRoutes from './routes/roadsRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'cairo-traffic-backend', database: 'sqlite' });
});

app.use('/api/auth', authRoutes);
app.use('/api/roads', roadsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/reports', reportsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ message: 'Email is already registered.' });
  }

  if (error.code === 'SQLITE_CONSTRAINT_CHECK') {
    return res.status(400).json({ message: 'Invalid value provided.' });
  }

  return res.status(500).json({ message: 'Server error.' });
});

export default app;
