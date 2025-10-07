// Photo service that integrates with Google Drive
// Uses environment variables for configuration

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video";
  category: string;
  description: string;
  uploadDate: string;
  status: "Draft" | "Published";
  driveId: string;
  fileId: string;
  url: string;
  thumbnailUrl: string;
  mimeType: string;
  size: number;
}

interface MediaUploadData {
  name: string;
  type: "image" | "video";
  category: string;
  description: string;
  file: File;
}

class PhotoService {
  private mediaItems: MediaItem[] = [
    {
      id: "media1",
      name: "Engagement Photo 1",
      type: "image",
      category: "Engagement",
      description: "Beautiful moment from engagement ceremony",
      uploadDate: "2025-10-01",
      status: "Published",
      driveId: "drive1",
      fileId: "file-12345",
      url: "https://drive.google.com/file/d/file-12345/view",
      thumbnailUrl: "https://drive.google.com/thumbnail?id=file-12345",
      mimeType: "image/jpeg",
      size: 2048576 // 2MB
    },
    {
      id: "media2",
      name: "Engagement Photo 2",
      type: "image",
      category: "Engagement",
      description: "Couple portrait",
      uploadDate: "2025-10-01",
      status: "Published",
      driveId: "drive1",
      fileId: "file-12346",
      url: "https://drive.google.com/file/d/file-12346/view",
      thumbnailUrl: "https://drive.google.com/thumbnail?id=file-12346",
      mimeType: "image/png",
      size: 3048576 // 3MB
    },
    {
      id: "media3",
      name: "Pre-Wedding Video",
      type: "video",
      category: "Pre-Wedding",
      description: "Pre-wedding video shoot",
      uploadDate: "2025-10-05",
      status: "Draft",
      driveId: "drive2",
      fileId: "file-12347",
      url: "https://drive.google.com/file/d/file-12347/view",
      thumbnailUrl: "https://drive.google.com/thumbnail?id=file-12347",
      mimeType: "video/mp4",
      size: 50485760 // 50MB
    }
  ];

  // Database configuration from environment variables
  private dbConfig = {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    name: process.env.DATABASE_NAME || "wedding_db",
    user: process.env.DATABASE_USER || "username",
    password: process.env.DATABASE_PASSWORD || "password"
  };

  // Get all media items
  async getMediaItems(): Promise<MediaItem[]> {
    // In a real implementation, this would fetch from a database
    // For demo, we return the mock data
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mediaItems), 300);
    });
  }

  // Get media item by ID
  async getMediaItemById(id: string): Promise<MediaItem | undefined> {
    return new Promise(resolve => {
      setTimeout(() => {
        const media = this.mediaItems.find(p => p.id === id);
        resolve(media);
      }, 200);
    });
  }

  // Upload a new media item
  async uploadMedia(mediaData: MediaUploadData): Promise<MediaItem | null> {
    // In a real implementation, this would:
    // 1. Upload the file to Google Drive
    // 2. Save media metadata to database
    // 3. Return the created media object
    
    try {
      // Import the Google Drive service
      const { googleDriveService } = await import('./google-drive-service');
      
      // Upload to Google Drive
      const uploadResult = await googleDriveService.uploadFile(
        mediaData.file, 
        "Wedding Media"
      );
      
      if (uploadResult.success && uploadResult.fileId && uploadResult.driveId && uploadResult.mimeType) {
        // Create media object
        const newMedia: MediaItem = {
          id: `media-${Date.now()}`,
          name: mediaData.name,
          type: mediaData.type,
          category: mediaData.category,
          description: mediaData.description,
          uploadDate: new Date().toISOString().split('T')[0],
          status: "Draft",
          driveId: uploadResult.driveId,
          fileId: uploadResult.fileId,
          url: `https://drive.google.com/file/d/${uploadResult.fileId}/view`,
          thumbnailUrl: `https://drive.google.com/thumbnail?id=${uploadResult.fileId}`,
          mimeType: uploadResult.mimeType,
          size: mediaData.file.size
        };
        
        // Add to our collection (in a real app, this would save to a database)
        this.mediaItems.push(newMedia);
        
        return newMedia;
      } else {
        throw new Error(uploadResult.error || "Failed to upload media");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      return null;
    }
  }

  // Update media metadata
  async updateMedia(id: string, updates: Partial<MediaItem>): Promise<boolean> {
    // In a real implementation, this would update the database
    const mediaIndex = this.mediaItems.findIndex(p => p.id === id);
    
    if (mediaIndex !== -1) {
      this.mediaItems[mediaIndex] = { ...this.mediaItems[mediaIndex], ...updates };
      return new Promise(resolve => setTimeout(() => resolve(true), 300));
    }
    
    return false;
  }

  // Delete a media item
  async deleteMedia(id: string): Promise<boolean> {
    // In a real implementation, this would:
    // 1. Delete the file from Google Drive
    // 2. Remove the media from the database
    
    try {
      const media = this.mediaItems.find(p => p.id === id);
      
      if (media) {
        // Import the Google Drive service
        const { googleDriveService } = await import('./google-drive-service');
        
        // Delete from Google Drive
        const deleted = await googleDriveService.deleteFile(
          media.fileId, 
          media.driveId
        );
        
        if (deleted) {
          // Remove from our collection (in a real app, this would update the database)
          this.mediaItems = this.mediaItems.filter(p => p.id !== id);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting media:", error);
      return false;
    }
  }

  // Get media items by category
  async getMediaByCategory(category: string): Promise<MediaItem[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const filtered = this.mediaItems.filter(p => p.category === category);
        resolve(filtered);
      }, 300);
    });
  }

  // Get media items by type
  async getMediaByType(type: "image" | "video"): Promise<MediaItem[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const filtered = this.mediaItems.filter(p => p.type === type);
        resolve(filtered);
      }, 300);
    });
  }

  // Get unique categories
  async getCategories(): Promise<string[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const categories = Array.from(
          new Set(this.mediaItems.map(p => p.category))
        );
        resolve(categories);
      }, 200);
    });
  }

  // Get unique types
  async getTypes(): Promise<("image" | "video")[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const types = Array.from(
          new Set(this.mediaItems.map(p => p.type))
        ) as ("image" | "video")[];
        resolve(types);
      }, 200);
    });
  }
}

// Export a singleton instance
export const photoService = new PhotoService();