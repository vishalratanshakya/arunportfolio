import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load variables from .env.local
dotenv.config({ path: '.env.local' });

// Check for required environment variables
if (
  !process.env.VITE_CLOUDINARY_CLOUD_NAME || 
  process.env.VITE_CLOUDINARY_CLOUD_NAME === 'your_cloud_name' ||
  !process.env.VITE_CLOUDINARY_API_KEY || 
  process.env.VITE_CLOUDINARY_API_KEY === 'your_api_key' ||
  !process.env.VITE_CLOUDINARY_API_SECRET || 
  process.env.VITE_CLOUDINARY_API_SECRET === 'your_api_secret'
) {
  console.error('❌ Error: Please fill in your actual Cloudinary credentials in .env.local.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
});

const videoDir = path.join(process.cwd(), 'public', 'videos');
const projectsDataFile = path.join(process.cwd(), 'src', 'data', 'projectsData.js');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

async function uploadVideos() {
  if (!fs.existsSync(videoDir)) {
    console.error("❌ Video directory not found at: " + videoDir);
    return;
  }

  const allFiles = getAllFiles(videoDir).filter(file => file.endsWith('.mp4'));
  console.log(`🚀 Found ${allFiles.length} videos total...`);

  let projectsDataContent = fs.readFileSync(projectsDataFile, 'utf8');
  let updatedCount = 0;

  for (const filePath of allFiles) {
    // Get path relative to 'public' for matching in projectsData.js
    let relativePath = path.relative(path.join(process.cwd(), 'public'), filePath).replace(/\\/g, '/');
    if (!relativePath.startsWith('/')) relativePath = '/' + relativePath;

    // Check if this path still exists in the file (hasn't been replaced yet)
    if (!projectsDataContent.includes(relativePath)) {
      continue;
    }

    try {
      console.log(`📦 Uploading ${relativePath}... (Large file support enabled)`);
      
      // Use upload_large with a safer async wrapper to ensure we get the result
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(filePath, {
          resource_type: "video",
          folder: "portfolio/videos",
          public_id: path.parse(filePath).name.trim(),
          chunk_size: 6000000 // 6MB chunks
        }, (error, uploadResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadResult);
          }
        });
      });

      if (!result || !result.secure_url) {
        throw new Error("Upload succeeded but secure_url is missing from response.");
      }
      
      console.log(`✅ Success! Replacing path with: ${result.secure_url}`);
      
      // Update all instances of the local path with the secure URL
      const escapedPath = relativePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`"${escapedPath}"`, 'g');
      projectsDataContent = projectsDataContent.replace(regex, `"${result.secure_url}"`);
      
      const regexSingle = new RegExp(`'${escapedPath}'`, 'g');
      projectsDataContent = projectsDataContent.replace(regexSingle, `'${result.secure_url}'`);

      updatedCount++;
      
      // Save after each successful upload
      fs.writeFileSync(projectsDataFile, projectsDataContent);
      
    } catch (error) {
      console.error(`❌ Failed ${relativePath}:`, error.message);
    }
  }

  if (updatedCount > 0) {
    console.log(`\n✨ Successfully added ${updatedCount} more paths to src/data/projectsData.js!`);
  } else {
    console.log("\n⚠️ No new paths were updated.");
  }

  console.log("\n✨ Process complete!");
}

uploadVideos();
