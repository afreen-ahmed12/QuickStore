import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Folder from '../models/Folder.js';

const router = express.Router();

// Get all folders for user
router.get('/', authenticate, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single folder
router.get('/:id', authenticate, async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create folder
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    const folder = new Folder({
      userId: req.userId,
      name,
      description: description || '',
      color: color || '#6366f1'
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update folder
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    if (name) folder.name = name;
    if (description !== undefined) folder.description = description;
    if (color) folder.color = color;
    folder.updatedAt = new Date();

    await folder.save();
    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete folder
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.userId });
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    await Folder.deleteOne({ _id: req.params.id });
    res.json({ message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

