const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// MongoDB Setup
const AssetSchema = new mongoose.Schema({
  name: String,
  url: String,
  resourceType: String,
  category: String,
  uploadedAt: { type: Date, default: Date.now }
});
const Asset = mongoose.model('Asset', AssetSchema);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const assetsDir = path.join(__dirname, '..', 'frontend', 'assets');

async function uploadFiles(dir) {
  const files = fs.readdirSync(dir);
  const currentDirName = path.basename(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await uploadFiles(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      let resourceType = 'image';
      
      if (['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext)) {
        resourceType = 'video';
      } else if (!['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico'].includes(ext)) {
        continue;
      }

      try {
        // Check if already in DB
        const existing = await Asset.findOne({ name: file });
        if (existing) {
          console.log(`Skipping ${file} (already in DB)`);
          continue;
        }

        console.log(`Uploading ${file}...`);
        const result = await cloudinary.uploader.upload(fullPath, {
          folder: 'portfolio_assets',
          resource_type: resourceType,
          use_filename: true,
          unique_filename: false
        });

        // Save to MongoDB
        await Asset.create({
          name: file,
          url: result.secure_url,
          resourceType: resourceType,
          category: currentDirName
        });

        console.log(`Success & Saved: ${result.secure_url}`);
      } catch (error) {
        console.error(`Error uploading ${file}:`, error.message);
      }
    }
  }
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Starting upload...');
    await uploadFiles(assetsDir);
    console.log('All uploads and database sync complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

