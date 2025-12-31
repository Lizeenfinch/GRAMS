# Backend Media Upload Integration - Implementation Summary

## What Was Implemented

### 1. **Cloudinary Configuration** (`server/src/config/cloudinary.js`)
- Cloudinary SDK initialization
- `uploadToCloudinary()` - Uploads files from memory buffer
- `deleteFromCloudinary()` - Deletes files by publicId
- Automatic image optimization (1200x1200 max, quality: auto)

### 2. **File Upload Middleware** (`server/src/middleware/upload.js`)
- Multer configuration with memory storage
- File filter (images and videos only)
- Size limit: 50MB per file
- Max 7 files total (5 photos + 2 videos)

### 3. **Updated Grievance Model** (`server/src/models/Grievance.js`)
- Enhanced `attachments` schema:
  ```javascript
  {
    url: String,        // Cloudinary secure URL
    publicId: String,   // For deletion
    type: String,       // 'image' or 'video'
    uploadedAt: Date
  }
  ```
- Updated category enum: `['water', 'waste', 'roads', 'electric', 'other']`

### 4. **Grievance Controller** (`server/src/controllers/grievanceController.js`)
- **createGrievance**: 
  - Accepts multipart/form-data
  - Uploads files to Cloudinary
  - Stores attachment metadata in database
  - Handles upload errors gracefully
  
- **deleteGrievance**:
  - Deletes all attachments from Cloudinary
  - Removes database record
  - Continues even if some deletions fail

### 5. **Routes** (`server/src/routes/grievanceRoutes.js`)
- Added `upload.array('files', 7)` middleware to POST route
- Supports up to 7 files per request

### 6. **Frontend API** (`client/src/Services/operations/grievanceAPI.js`)
- **createGrievance**:
  - Creates FormData object
  - Appends text fields and files
  - Sets correct Content-Type header
  - Sends photos and videos to backend

### 7. **Form Submission** (`client/src/pages/GrievanceFormPage.jsx`)
- Includes File objects in submission
- Validates "Other" category field
- Passes photos and videos arrays to API
- Handles custom category names

### 8. **Environment Configuration** (`server/.env`)
- Added Cloudinary credentials:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

## How It Works

### Upload Flow:
```
User selects files → FormData created → POST to /api/grievances
    ↓
Multer intercepts → Files in req.files (memory buffer)
    ↓
Controller loops through files → uploadToCloudinary()
    ↓
Cloudinary returns secure_url & public_id → Saved to database
    ↓
Response with grievance + attachments
```

### Delete Flow:
```
DELETE /api/grievances/:id
    ↓
Find grievance → Loop through attachments
    ↓
deleteFromCloudinary(publicId, type) for each
    ↓
Delete database record → Success response
```

## Features

✅ **Multiple File Upload** - Photos and videos in one request  
✅ **Cloud Storage** - Cloudinary CDN for fast delivery  
✅ **Automatic Optimization** - Images resized and compressed  
✅ **Metadata Tracking** - URLs, publicIds, upload dates  
✅ **Cleanup on Delete** - No orphaned files in cloud  
✅ **Error Handling** - Graceful failures, continues processing  
✅ **Category Validation** - Supports custom "Other" category  
✅ **Form Previews** - Local previews before upload  

## Setup Required

1. **Create Cloudinary Account** (free tier available)
2. **Get Credentials** from Cloudinary Dashboard
3. **Update .env** with your keys
4. **Restart Server** to load new config

See `CLOUDINARY_SETUP.md` for detailed instructions.

## Testing

### Test Photo Upload:
1. Go to `/grievance-form`
2. Fill required fields
3. Upload 1-5 photos
4. Submit form
5. Check Cloudinary Media Library → `grams/grievances/`

### Test Video Upload:
1. Upload 1-2 videos (max 50MB each)
2. Submit
3. Verify in Cloudinary

### Test Deletion:
1. Delete a grievance
2. Check Cloudinary - files should be removed
3. Verify database record deleted

## Dependencies Added

```json
{
  "multer": "^1.4.5-lts.1",
  "cloudinary": "^1.41.0"
}
```

## File Structure

```
server/
├── src/
│   ├── config/
│   │   └── cloudinary.js          ← Cloudinary setup
│   ├── middleware/
│   │   └── upload.js              ← Multer config
│   ├── models/
│   │   └── Grievance.js           ← Updated schema
│   ├── controllers/
│   │   └── grievanceController.js ← Upload/delete logic
│   └── routes/
│       └── grievanceRoutes.js     ← Multipart route
├── .env                           ← Cloudinary keys
└── CLOUDINARY_SETUP.md           ← Setup guide

client/
└── src/
    ├── Services/
    │   └── operations/
    │       └── grievanceAPI.js    ← FormData upload
    └── pages/
        └── GrievanceFormPage.jsx  ← File submission
```

## Next Steps

1. ✅ Set up Cloudinary account
2. ✅ Add credentials to `.env`
3. 🔲 Test file uploads
4. 🔲 Mobile responsive menu
5. 🔲 Track page API integration
6. 🔲 Admin dashboard features

## Notes

- Free Cloudinary tier: 25GB storage, 25GB bandwidth/month
- Videos are stored as-is (no optimization)
- Images automatically optimized for web
- All files stored in `grams/grievances/` folder
- Secure HTTPS URLs returned
- Files accessible via CDN globally

---

**Status**: ✅ Backend integration complete and ready for testing
