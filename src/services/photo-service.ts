// Photo service that integrates with Google Drive and Supabase
// Uses environment variables for configuration

import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

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
  // Check if Supabase is configured
  private isSupabaseAvailable = isSupabaseConfigured();

  // Get all media items from Supabase or mock data
  async getMediaItems(): Promise<MediaItem[]> {
    if (!this.isSupabaseAvailable || !supabase) {
      console.warn("Supabase not configured, using mock data");
      return this.getMockMediaItems();
    }

    try {
      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .order("uploadDate", { ascending: false });

      if (error) {
        console.error("Error fetching media items:", error);
        return this.getMockMediaItems();
      }

      return data as MediaItem[];
    } catch (error) {
      console.error("Error fetching media items:", error);
      return this.getMockMediaItems();
    }
  }

  // Get media item by ID from Supabase or mock data
  async getMediaItemById(id: string): Promise<MediaItem | undefined> {
    if (!this.isSupabaseAvailable || !supabase) {
      console.warn("Supabase not configured, using mock data");
      // Find in mock data
      const mockItems = this.getMockMediaItems();
      return mockItems.find((item) => item.id === id);
    }

    try {
      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching media item:", error);
        return undefined;
      }

      return data as MediaItem;
    } catch (error) {
      console.error("Error fetching media item:", error);
      return undefined;
    }
  }

  // Upload a new media item
  async uploadMedia(mediaData: MediaUploadData): Promise<MediaItem | null> {
    // In a real implementation, this would:
    // 1. Upload the file to Google Drive
    // 2. Save media metadata to Supabase
    // 3. Return the created media object

    try {
      // Import the Google Drive service
      const { googleDriveService } = await import("./google-drive-service");

      // Upload to Google Drive
      const uploadResult = await googleDriveService.uploadFile(
        mediaData.file,
        "Wedding Media"
      );

      if (
        uploadResult.success &&
        uploadResult.fileId &&
        uploadResult.driveId &&
        uploadResult.mimeType
      ) {
        // Create media object
        const newMedia: MediaItem = {
          id: `media-${Date.now()}`,
          name: mediaData.name,
          type: mediaData.type,
          category: mediaData.category,
          description: mediaData.description,
          uploadDate: new Date().toISOString().split("T")[0],
          status: "Draft",
          driveId: uploadResult.driveId,
          fileId: uploadResult.fileId,
          url: `https://drive.google.com/file/d/${uploadResult.fileId}/view`,
          thumbnailUrl: `https://drive.google.com/thumbnail?id=${uploadResult.fileId}`,
          mimeType: uploadResult.mimeType,
          size: mediaData.file.size,
        };

        // Save to Supabase if available
        if (this.isSupabaseAvailable && supabase) {
          const { error } = await supabase
            .from("media_items")
            .insert([newMedia]);

          if (error) {
            console.error("Error saving media to Supabase:", error);
            // In a real app, we might want to delete the Google Drive file if Supabase save fails
          }
        }

        return newMedia;
      } else {
        throw new Error(uploadResult.error || "Failed to upload media");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
      return null;
    }
  }

  // Update media metadata in Supabase
  async updateMedia(id: string, updates: Partial<MediaItem>): Promise<boolean> {
    if (!this.isSupabaseAvailable || !supabase) {
      console.warn("Supabase not configured, skipping update");
      return true; // Return true to indicate success in mock mode
    }

    try {
      const { error } = await supabase
        .from("media_items")
        .update(updates)
        .eq("id", id);

      if (error) {
        console.error("Error updating media:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating media:", error);
      return false;
    }
  }

  // Delete a media item from Supabase and Google Drive
  async deleteMedia(id: string): Promise<boolean> {
    // In a real implementation, this would:
    // 1. Delete the file from Google Drive
    // 2. Remove the media from Supabase

    try {
      // First, get the media item to get the driveId and fileId
      const media = await this.getMediaItemById(id);

      if (media) {
        // Import the Google Drive service
        const { googleDriveService } = await import("./google-drive-service");

        // Delete from Google Drive
        const deleted = await googleDriveService.deleteFile(
          media.fileId,
          media.driveId
        );

        if (deleted) {
          // Delete from Supabase if available
          if (this.isSupabaseAvailable && supabase) {
            const { error } = await supabase
              .from("media_items")
              .delete()
              .eq("id", id);

            if (error) {
              console.error("Error deleting media from Supabase:", error);
              return false;
            }
          }

          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting media:", error);
      return false;
    }
  }

  // Get media items by category from Supabase or mock data
  async getMediaByCategory(category: string): Promise<MediaItem[]> {
    if (!this.isSupabaseAvailable || !supabase) {
      console.warn("Supabase not configured, using mock data");
      const mockItems = this.getMockMediaItems();
      return mockItems.filter((item) => item.category === category);
    }

    try {
      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("category", category)
        .order("uploadDate", { ascending: false });

      if (error) {
        console.error("Error fetching media by category:", error);
        return [];
      }

      return data as MediaItem[];
    } catch (error) {
      console.error("Error fetching media by category:", error);
      return [];
    }
  }

  // Get media items by type from Supabase or mock data
  async getMediaByType(type: "image" | "video"): Promise<MediaItem[]> {
    if (!this.isSupabaseAvailable || !supabase) {
      console.warn("Supabase not configured, using mock data");
      const mockItems = this.getMockMediaItems();
      return mockItems.filter((item) => item.type === type);
    }

    try {
      const { data, error } = await supabase
        .from("media_items")
        .select("*")
        .eq("type", type)
        .order("uploadDate", { ascending: false });

      if (error) {
        console.error("Error fetching media by type:", error);
        return [];
      }

      return data as MediaItem[];
    } catch (error) {
      console.error("Error fetching media by type:", error);
      return [];
    }
  }

  // Get unique categories from Supabase or mock data
  async getCategories(): Promise<string[]> {
    if (!this.isSupabaseAvailable || !supabase) {
      console.warn("Supabase not configured, using mock data");
      return this.getMockCategories();
    }

    try {
      const { data, error } = await supabase
        .from("media_items")
        .select("category");

      if (error) {
        console.error("Error fetching categories:", error);
        return this.getMockCategories();
      }

      // Extract unique categories
      const categories = Array.from(
        new Set(data?.map((item) => item.category) || [])
      );

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return this.getMockCategories();
    }
  }

  // Get unique types from Supabase or mock data
  async getTypes(): Promise<("image" | "video")[]> {
    if (!this.isSupabaseAvailable || !supabase) {
      console.warn("Supabase not configured, using mock data");
      return this.getMockTypes();
    }

    try {
      const { data, error } = await supabase.from("media_items").select("type");

      if (error) {
        console.error("Error fetching types:", error);
        return this.getMockTypes();
      }

      // Extract unique types
      const types = Array.from(
        new Set(data?.map((item) => item.type) || [])
      ) as ("image" | "video")[];

      return types;
    } catch (error) {
      console.error("Error fetching types:", error);
      return this.getMockTypes();
    }
  }

  // Mock data for when Supabase is not configured
  private getMockMediaItems(): MediaItem[] {
    return [
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
        size: 2048576, // 2MB
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
        size: 3048576, // 3MB
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
        size: 50485760, // 50MB
      },
    ];
  }

  // Mock categories for when Supabase is not configured
  private getMockCategories(): string[] {
    return ["Engagement", "Pre-Wedding", "Ceremony", "Reception"];
  }

  // Mock types for when Supabase is not configured
  private getMockTypes(): ("image" | "video")[] {
    return ["image", "video"];
  }
}

// Export a singleton instance
export const photoService = new PhotoService();
