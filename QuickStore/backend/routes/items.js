import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate } from '../middleware/auth.js';
import Item from '../models/Item.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all items for user
router.get('/', authenticate, async (req, res) => {
  try {
    const { section, folderId, type } = req.query;
    const query = { userId: req.userId };
    
    if (section) query.section = section;
    if (folderId) query.folderId = folderId;
    if (type) query.type = type;

    const items = await Item.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single item
router.get('/:id', authenticate, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create item
router.post('/', authenticate, async (req, res) => {
  try {
    const { type, title, content, url, section, folderId, tags } = req.body;
    
    const item = new Item({
      userId: req.userId,
      type,
      title,
      content,
      url,
      section: section || 'general',
      folderId: folderId || null,
      tags: tags || []
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload file
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, section, folderId, tags } = req.body;
    
    const item = new Item({
      userId: req.userId,
      type: 'file',
      title: title || req.file.originalname,
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      section: section || 'general',
      folderId: folderId || null,
      tags: tags || []
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update item
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, content, url, section, folderId, tags } = req.body;
    
    const item = await Item.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (title) item.title = title;
    if (content !== undefined) item.content = content;
    if (url !== undefined) item.url = url;
    if (section) item.section = section;
    if (folderId !== undefined) item.folderId = folderId;
    if (tags) item.tags = tags;
    item.updatedAt = new Date();

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete item
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, userId: req.userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await Item.deleteOne({ _id: req.params.id });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

