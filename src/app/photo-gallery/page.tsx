"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { photoService } from "@/services/photo-service";
import { Lock, Loader2, Image as ImageIcon, Video, Play } from "lucide-react";

// Define media item type
type MediaItem = {
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
};

export default function PhotoGalleryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All", "Engagement", "Pre-Wedding", "Ceremony", "Reception"]);
  const [types, setTypes] = useState<("image" | "video")[]>(["image", "video"]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState<"All" | "image" | "video">(
    "All"
  );

  // Fetch media items and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Only fetch data if we're in the browser (not during build)
        if (typeof window !== 'undefined') {
          const [fetchedMedia, fetchedCategories, fetchedTypes] =
            await Promise.all([
              photoService.getMediaItems(),
              photoService.getCategories(),
              photoService.getTypes(),
            ]);

          // Filter only published media for the gallery
          const publishedMedia = fetchedMedia.filter(
            (media) => media.status === "Published"
          );

          setMediaItems(publishedMedia);
          setCategories(["All", ...fetchedCategories]);
          setTypes(fetchedTypes);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter media based on selected category and type
  const filteredMedia = mediaItems.filter((media) => {
    const categoryMatch =
      selectedCategory === "All" || media.category === selectedCategory;
    const typeMatch = selectedType === "All" || media.type === selectedType;
    return categoryMatch && typeMatch;
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Media Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cherish the beautiful moments from our special day
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-6"
        >
          {/* Category Filter */}
          <div>
            <h3 className="text-lg font-medium mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "secondary"
                  }
                  className="cursor-pointer px-4 py-2 text-base"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <h3 className="text-lg font-medium mb-3">Media Types</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedType === "All" ? "default" : "secondary"}
                className="cursor-pointer px-4 py-2 text-base"
                onClick={() => setSelectedType("All")}
              >
                All Media
              </Badge>
              <Badge
                variant={selectedType === "image" ? "default" : "secondary"}
                className="cursor-pointer px-4 py-2 text-base"
                onClick={() => setSelectedType("image")}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Images
              </Badge>
              <Badge
                variant={selectedType === "video" ? "default" : "secondary"}
                className="cursor-pointer px-4 py-2 text-base"
                onClick={() => setSelectedType("video")}
              >
                <Video className="w-4 h-4 mr-2" />
                Videos
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Media Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredMedia.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMedia.map((media) => (
                <Card
                  key={media.id}
                  className="border-0 shadow-lg bg-background/50 backdrop-blur-sm overflow-hidden group"
                >
                  <CardContent className="p-0 relative">
                    {/* Media placeholder */}
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                      {media.type === "image" ? (
                        <ImageIcon className="text-primary/30 w-12 h-12" />
                      ) : (
                        <>
                          <Video className="text-primary/30 w-12 h-12" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-primary/20 rounded-full p-3">
                              <Play className="text-primary w-6 h-6 ml-1" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Media info overlay */}
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center p-4">
                        <p className="text-white font-medium">{media.name}</p>
                        <div className="flex gap-2 justify-center mt-2">
                          <Badge variant="secondary">{media.category}</Badge>
                          <Badge
                            variant={
                              media.type === "image" ? "default" : "destructive"
                            }
                          >
                            {media.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-medium text-foreground mb-2">
                No Media Available
              </h3>
              <p className="text-muted-foreground mb-6">
                {selectedCategory === "All" && selectedType === "All"
                  ? "Media will be added after the wedding."
                  : `No ${selectedType === "All" ? "" : selectedType + " "}${
                      selectedCategory === "All" ? "" : "in " + selectedCategory
                    } available.`}
              </p>
            </div>
          )}
        </motion.div>

        {/* Admin Access Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Admin Access
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Wedding organizers can upload and manage photos and videos
                through the admin dashboard.
              </p>
              <Button asChild>
                <Link href="/admin">Go to Admin Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        {/* Back to Details Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80"
            asChild
          >
            <Link href="/wedding-details">← Back to Wedding Details</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}