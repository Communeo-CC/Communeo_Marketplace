import express from 'express';
import { healthController } from '../controllers/healthController.js';


const router = express.Router();

// Health routes
router.get('/health', healthController.check);


// YouTube API proxy routes
router.get('/youtube/channel/:id', (req, res) => {
  // This would be implemented to proxy YouTube API requests
  // to avoid exposing API key on the client
  res.json({ message: 'YouTube API proxy endpoint' });
});

export { router };