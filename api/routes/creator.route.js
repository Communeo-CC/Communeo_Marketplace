import express from 'express';
import { getAllCreators, addCreator, deleteCreator, syncCreatorsFromChannels } from '../controllers/creator.controller.js';

const router = express.Router();

// Get all creators
router.get('/', getAllCreators);

// Add a new creator
router.post('/', addCreator);

// Delete a creator
router.delete('/:id', deleteCreator);

// Sync creators from channels
router.post('/sync', async (req, res) => {
  try {
    await syncCreatorsFromChannels(req.body.apiKey);
    res.status(200).json({ message: 'Creators synced successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error syncing creators', error: error.message });
  }
});

export default router; 