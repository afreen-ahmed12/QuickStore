import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['link', 'text', 'message', 'file'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  section: {
    type: String,
    default: 'general',
    enum: ['repos', 'github', 'useful', 'instagram', 'twitter', 'youtube', 'general', 'other']
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  filePath: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

itemSchema.index({ userId: 1, createdAt: -1 });
itemSchema.index({ userId: 1, section: 1 });

export default mongoose.model('Item', itemSchema);

