# Wedding Website Admin Guide

This guide explains how to use the admin features of the wedding website.

## Environment Variables

Before running the application, you need to set up the required environment variables. Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

### Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `GOOGLE_DRIVE_CLIENT_ID`: Google Drive OAuth2 client ID
- `GOOGLE_DRIVE_CLIENT_SECRET`: Google Drive OAuth2 client secret
- `GOOGLE_DRIVE_REDIRECT_URI`: OAuth2 redirect URI
- `GOOGLE_DRIVE_ACCESS_TOKEN_1`: Google Drive account 1 access token
- `GOOGLE_DRIVE_REFRESH_TOKEN_1`: Google Drive account 1 refresh token
- `GOOGLE_DRIVE_ACCESS_TOKEN_2`: Google Drive account 2 access token
- `GOOGLE_DRIVE_REFRESH_TOKEN_2`: Google Drive account 2 refresh token
- `GOOGLE_DRIVE_ACCESS_TOKEN_3`: Google Drive account 3 access token
- `GOOGLE_DRIVE_REFRESH_TOKEN_3`: Google Drive account 3 refresh token
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
- Three drive accounts supported for redundancy
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
6. Media metadata is stored in Supabase database
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

- `photo-service.ts`: Handles media operations (CRUD) with Supabase integration
- `google-drive-service.ts`: Manages Google Drive integration across 3 accounts
- `supabaseClient.ts`: Supabase client configuration

### Authentication

- `auth-context.tsx`: Provides authentication context throughout the app

### Components

- Admin dashboard with responsive design
- Modal dialogs for media upload and editing
- Visual storage indicators
- Loading states for async operations
- Category management system

## Database Schema

The application uses Supabase with the following table structure:

### media_items table

- `id` (string): Unique identifier
- `name` (string): Media name
- `type` (string): Media type ("image" or "video")
- `category` (string): Media category
- `description` (string): Media description
- `uploadDate` (string): Upload date
- `status` (string): Media status ("Draft" or "Published")
- `driveId` (string): Google Drive account ID
- `fileId` (string): Google Drive file ID
- `url` (string): Direct link to media
- `thumbnailUrl` (string): Thumbnail URL
- `mimeType` (string): File MIME type
- `size` (number): File size in bytes

## Security Notes

- In a production environment, proper OAuth2 authentication with Google Drive would be required
- Passwords should be properly hashed and stored
- API endpoints should be secured with proper authentication tokens
- Environment variables should never be committed to version control
- Supabase keys should be properly secured and rotated regularly
