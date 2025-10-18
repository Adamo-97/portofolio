# CV Download Setup Guide

## How It Works

Your portfolio downloads the CV directly from Supabase Storage (`cv-icons` bucket, inside the `cv` folder). This means you can update your CV without redeploying your website!

## Current Setup

- **Bucket:** `cv-icons`
- **Folder:** `cv`
- **File:** `CV.pdf`
- **Full path:** `cv-icons/cv/CV.pdf`

## Update Your CV (Anytime)

When you update your CV on Overleaf:

1. Download the new PDF from Overleaf
2. Go to Supabase Storage → `cv-icons` bucket → `cv` folder
3. **Delete** the old `CV.pdf` file
4. **Upload** the new file with the same name: `CV.pdf`
5. Your portfolio will automatically serve the new version!

## How the API Works

The `/api/cv` endpoint:
- Downloads the file from `cv-icons/cv/CV.pdf`
- Serves it with proper download headers
- No caching (always serves the latest version)

## Troubleshooting

### CV doesn't download

- Check browser console for errors
- Verify the file exists at `cv-icons/cv/CV.pdf` in Supabase
- Make sure the bucket is public or properly configured

### File not found (404)

- Make sure the file is named exactly `CV.pdf` (case-sensitive)
- Verify it's inside the `cv` folder within the `cv-icons` bucket

### Wrong path?

If you move the file, update `/api/cv/route.ts`:
```typescript
const bucketName = "cv-icons"; // Your bucket name
const filePath = "cv/CV.pdf";   // Path within the bucket
```

## Benefits

✅ Update CV without code changes  
✅ No need to redeploy the website  
✅ Always serves the latest version  
✅ No caching issues (always fresh)  
✅ Professional workflow integration  

## Recommended Workflow

1. Update CV on Overleaf
2. Download PDF from Overleaf
3. Upload to Supabase `cv-icons/cv/` (replace old file)
4. Done! ✨

Your portfolio immediately serves the new CV to all visitors.
