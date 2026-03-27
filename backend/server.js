require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for large payloads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());

// Cloudinary initialization
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Project Schema
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  image: String,
  video: String,
  techStack: [String],
  liveUrl: String,
  type: { type: String, enum: ['video', 'photo'], default: 'video' },
  source: { type: String, enum: ['youtube', 'mp4', 'local'], default: 'mp4' },
  uploadedAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

// Multer & Cloudinary Storage Config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideoFile = file.mimetype.startsWith('video');
    const folder = isVideoFile ? 'portfolio_videos' : 'portfolio_images';
    
    return {
      folder: folder,
      resource_type: isVideoFile ? 'video' : 'image',
      public_id: file.originalname.split('.')[0] + '-' + Date.now(),
      chunk_size: 6000000,
    };
  },
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } 
});

// MongoDB connection with reliable options
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        console.log("🔄 ATTEMPTING MONGO CONNECTION...");
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 15000, // Timeout after 15s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log('✅ DATABASE LINK ESTABLISHED (MONGODB ATLAS)');
    } catch (err) {
        console.error('❌ MONGODB CONNECTION FATAL ERROR:', err.message);
        // Dont exit process, let it retry
    }
};

connectDB();

// --- AUTH LOGIC ---
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, message: 'AUTHENTICATED SUCCESS' });
  }
  return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ error: 'NO_TOKEN_PROVIDED' });
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'UNAUTHORIZED_SESSION' });
    req.user = decoded;
    next();
  });
};
// -----------------

// API: Create new Project
app.post('/api/projects', verifyToken, upload.fields([
  { name: 'file', maxCount: 1 }, 
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    // Check if DB is connected
    if (mongoose.connection.readyState !== 1) {
        throw new Error("DATABASE_DISCONNECTED: The cloud database is currently unreachable.");
    }

    const { title, category, type, source, url, description } = req.body;
    
    let mediaUrl = '';
    let thumbUrl = '';

    if (req.files) {
        if (req.files['file'] && req.files['file'][0]) {
            mediaUrl = req.files['file'][0].path;
        }
        if (req.files['thumbnail'] && req.files['thumbnail'][0]) {
            thumbUrl = req.files['thumbnail'][0].path;
        }
    }

    const finalImage = type === 'photo' ? mediaUrl : (thumbUrl || (source === 'mp4' ? mediaUrl.replace('.mp4', '.jpg') : ''));
    const finalVideo = type === 'video' ? (source === 'youtube' ? url : mediaUrl) : '';

    const newProject = await Project.create({
      title: title || 'UNTITLED PRODUCTION',
      description: description || 'No description provided.',
      category: category || 'GENERAL',
      type: type || 'video',
      source: source || 'mp4',
      image: finalImage,
      video: finalVideo,
      techStack: [category || 'GENERAL', (type || 'video').toUpperCase()],
      uploadedAt: new Date()
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error("❌ CLOUDINARY/MONGO UPLOAD ERROR:", error);
    res.status(500).json({ error: 'UPLOADING PRODUCTION FAILED.', details: error.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ uploadedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// API: Delete Project
app.delete('/api/projects/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project', details: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Backend is active', 
    dbState: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 STUDIO PRODUCTION SERVER ACTIVE ON PORT ${PORT}`);
});
