import express from 'express';
import { getAllChannels, getChannelById } from '../controllers/channel.controller.js';

const router = express.Router();

// Get all channels
router.get('/', getAllChannels);

// Get channel by ID
router.get('/:channelId', getChannelById);

export default router; 