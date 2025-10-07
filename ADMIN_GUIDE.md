# Wedding Website Admin Guide

This guide explains how to use the admin features of the wedding website.

## Environment Variables

Before running the application, you need to set up the required environment variables. Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

### Required Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `DATABASE_HOST`: Database host (default: localhost)
- `DATABASE_PORT`: Database port (default: 5432)
- `DATABASE_NAME`: Database name (default: wedding_db)
- `DATABASE_USER`: Database username
- `DATABASE_PASSWORD`: Database password
- `GOOGLE_DRIVE_CLIENT_ID`: Google Drive OAuth2 client ID
- `GOOGLE_DRIVE_CLIENT_SECRET`: Google Drive OAuth2 client secret
- `GOOGLE_DRIVE_REDIRECT_URI`: OAuth2 redirect URI
- `GOOGLE_DRIVE_REFRESH_TOKEN`: Google Drive refresh token
- `ADMIN_USERNAME`: Admin username for login
- `ADMIN_PASSWORD`: Admin password for login (should be hashed)
- `ENCRYPTION_SECRET`: Secret key for encryption
- `SESSION_SECRET`: Secret key for session management
- `SESSION_EXPIRY`: Session expiry time in milliseconds
- `GOOGLE_DRIVE_API_KEY`: Google Drive API key

## Admin Dashboard Access

To access the admin dashboard:
1. Navigate to `/admin/login`
2. Use the admin credentials set in your environment variables

For demo purposes, the default credentials are:
- Username: `admin`
- Password: `wedding2025`

## Features

### Media Management
- Upload new photos and videos with categories and descriptions
- Edit existing media details (name, category, description, publish status)
- Delete media from the gallery
- View all media in a list format
- Filter media by type (images or videos)

### Category Management
- Create and manage custom categories for organizing media
- Assign media to specific categories
- Filter media by category in the public gallery

### Google Drive Integration
- Media files are automatically stored in Google Drive
- Multiple drive accounts supported for redundancy
- Automatic selection of drive account with most available space
- Storage usage monitoring across all accounts
- Support for both image and video file types

### Authentication
- Secure login system
- Session management
- Logout functionality

## How It Works

### Media Upload Process
1. Admin selects "Add Media" from the dashboard
2. Fills in media details (name, type, category, description)
3. Selects a media file to upload (images or videos)
4. System automatically selects the Google Drive account with the most available space
5. Media is uploaded to Google Drive
6. Media metadata is stored in the system
7. Media appears in the admin dashboard (initially as "Draft")

### Publishing Media
1. Media items are initially saved as "Draft" status
2. Admin can edit any media item to change its status to "Published"
3. Only "Published" media appears in the public media gallery

### Storage Management
- The system monitors storage usage across all connected Google Drive accounts
- Visual indicators show storage usage for each account
- When one drive is full, the system automatically uses another account

## Supported File Types

### Images
- JPEG/JPG
- PNG
- GIF
- WebP

### Videos
- MP4
- MOV
- AVI
- WebM

## Technical Implementation

### Services
- `photo-service.ts`: Handles media operations (CRUD)
- `google-drive-service.ts`: Manages Google Drive integration

### Authentication
- `auth-context.tsx`: Provides authentication context throughout the app

### Components
- Admin dashboard with responsive design
- Modal dialogs for media upload and editing
- Visual storage indicators
- Loading states for async operations
- Category management system

## Security Notes
- In a production environment, proper OAuth2 authentication with Google Drive would be required
- Passwords should be properly hashed and stored
- API endpoints should be secured with proper authentication tokens
- Environment variables should never be committed to version control