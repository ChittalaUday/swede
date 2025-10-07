"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/auth-context";
import { photoService } from "@/services/photo-service";
import { googleDriveService } from "@/services/google-drive-service";
import {
  Upload,
  Edit,
  Trash2,
  Eye,
  Plus,
  LogOut,
  Image as ImageIcon,
  Video,
  Users,
  HardDrive,
  Loader2,
  Play,
  FileImage,
} from "lucide-react";

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

// Define drive account type
type DriveAccount = {
  id: string;
  name: string;
  used: number;
  limit: number;
  percentage: number;
};

export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // All useState hooks must be at the top level
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Engagement",
    "Pre-Wedding",
    "Ceremony",
    "Reception",
  ]);
  const [driveAccounts, setDriveAccounts] = useState<DriveAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // State for form inputs
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [newMedia, setNewMedia] = useState({
    name: "",
    type: "image" as "image" | "video",
    category: "",
    description: "",
    file: null as File | null,
  });

  // Fetch media items and drive accounts on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const [fetchedMedia, driveStats, fetchedCategories] =
            await Promise.all([
              photoService.getMediaItems(),
              googleDriveService.getUsageStats(),
              photoService.getCategories(),
            ]);
          setMediaItems(fetchedMedia);
          setDriveAccounts(driveStats);
          if (fetchedCategories.length > 0) {
            setCategories(fetchedCategories);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  // Handle media upload
  const handleUpload = async () => {
    if (newMedia.name && newMedia.category && newMedia.file) {
      try {
        setUploading(true);
        const mediaData = {
          name: newMedia.name,
          type: newMedia.type,
          category: newMedia.category,
          description: newMedia.description,
          file: newMedia.file,
        };

        const uploadedMedia = await photoService.uploadMedia(mediaData);

        if (uploadedMedia) {
          setMediaItems([uploadedMedia, ...mediaItems]);
          setNewMedia({
            name: "",
            type: "image",
            category: "",
            description: "",
            file: null,
          });
          setIsUploadModalOpen(false);

          // Refresh drive stats
          const updatedDriveStats = googleDriveService.getUsageStats();
          setDriveAccounts(updatedDriveStats);
        }
      } catch (error) {
        console.error("Error uploading media:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle media edit
  const handleEdit = async () => {
    if (editingMedia) {
      try {
        const success = await photoService.updateMedia(
          editingMedia.id,
          editingMedia
        );
        if (success) {
          setMediaItems(
            mediaItems.map((media) =>
              media.id === editingMedia.id ? editingMedia : media
            )
          );
          setIsEditModalOpen(false);
          setEditingMedia(null);
        }
      } catch (error) {
        console.error("Error updating media:", error);
      }
    }
  };

  // Handle media delete
  const handleDelete = async (id: string) => {
    try {
      const success = await photoService.deleteMedia(id);
      if (success) {
        setMediaItems(mediaItems.filter((media) => media.id !== id));

        // Refresh drive stats
        const updatedDriveStats = googleDriveService.getUsageStats();
        setDriveAccounts(updatedDriveStats);
      }
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  // Open edit modal with media data
  const openEditModal = (media: MediaItem) => {
    setEditingMedia(media);
    setIsEditModalOpen(true);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewMedia({ ...newMedia, file });

      // Auto-detect media type based on file
      if (file.type.startsWith("image/")) {
        setNewMedia((prev) => ({ ...prev, type: "image" }));
      } else if (file.type.startsWith("video/")) {
        setNewMedia((prev) => ({ ...prev, type: "video" }));
      }
    }
  };

  // Add new category
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setIsCategoryModalOpen(false);
    }
  };

  // If not authenticated, don't render the dashboard
  if (!isAuthenticated) {
    return null;
  }

  // Format bytes to human readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage wedding media (photos & videos)
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/wedding-details">
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  <FileImage className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Media</p>
                  <p className="text-2xl font-bold">{mediaItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Images</p>
                  <p className="text-2xl font-bold">
                    {mediaItems.filter((m) => m.type === "image").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Videos</p>
                  <p className="text-2xl font-bold">
                    {mediaItems.filter((m) => m.type === "video").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold">
                    {mediaItems.filter((m) => m.status === "Published").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Drive Accounts Status */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Drive Accounts</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {formatBytes(
                    driveAccounts.reduce((sum, acc) => sum + acc.used, 0)
                  )}
                  /
                  {formatBytes(
                    driveAccounts.reduce((sum, acc) => sum + acc.limit, 0)
                  )}{" "}
                  used
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driveAccounts.map((account) => (
                  <div key={account.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{account.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatBytes(account.used)} /{" "}
                        {formatBytes(account.limit)}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${account.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Upload Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Upload New Media</span>
                <div className="flex gap-2">
                  <AlertDialog
                    open={isCategoryModalOpen}
                    onOpenChange={setIsCategoryModalOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Manage Categories
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Manage Categories</AlertDialogTitle>
                        <AlertDialogDescription>
                          Add new categories for organizing your media.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="new-category">New Category</Label>
                          <Input
                            id="new-category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Enter category name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Existing Categories</Label>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                              <Badge key={category} variant="secondary">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleAddCategory}
                          disabled={
                            !newCategory.trim() ||
                            categories.includes(newCategory.trim())
                          }
                        >
                          Add Category
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog
                    open={isUploadModalOpen}
                    onOpenChange={setIsUploadModalOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Media
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Upload New Media</AlertDialogTitle>
                        <AlertDialogDescription>
                          Add details for your new media file before uploading.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Media Name</Label>
                          <Input
                            id="name"
                            value={newMedia.name}
                            onChange={(e) =>
                              setNewMedia({ ...newMedia, name: e.target.value })
                            }
                            placeholder="Enter media name"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="type">Media Type</Label>
                          <select
                            id="type"
                            value={newMedia.type}
                            onChange={(e) =>
                              setNewMedia({
                                ...newMedia,
                                type: e.target.value as "image" | "video",
                              })
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <select
                            id="category"
                            value={newMedia.category}
                            onChange={(e) =>
                              setNewMedia({
                                ...newMedia,
                                category: e.target.value,
                              })
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newMedia.description}
                            onChange={(e) =>
                              setNewMedia({
                                ...newMedia,
                                description: e.target.value,
                              })
                            }
                            placeholder="Describe the media"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="file">Media File</Label>
                          <Input
                            id="file"
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                          />
                          {newMedia.file && (
                            <p className="text-sm text-muted-foreground">
                              Selected: {newMedia.file.name} (
                              {formatBytes(newMedia.file.size)})
                            </p>
                          )}
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleUpload}
                          disabled={
                            uploading ||
                            !newMedia.name ||
                            !newMedia.category ||
                            !newMedia.file
                          }
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  Drag and drop media here
                </p>
                <p className="text-muted-foreground mb-4">
                  or click the &quot;Add Media&quot; button above
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: JPG, PNG, GIF, MP4, MOV, AVI. Max file
                  size: 100MB
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Media List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Media Management</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {mediaItems.map((media) => (
                    <div
                      key={media.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 rounded-lg w-12 h-12 flex items-center justify-center">
                          {media.type === "image" ? (
                            <ImageIcon className="w-6 h-6 text-primary" />
                          ) : (
                            <Video className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{media.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary">{media.category}</Badge>
                            <Badge
                              variant={
                                media.type === "image"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {media.type}
                            </Badge>
                            <Badge
                              variant={
                                media.status === "Published"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {media.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(media)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(media.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Edit Media Modal */}
        <AlertDialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Media</AlertDialogTitle>
              <AlertDialogDescription>
                Update the details for this media item.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {editingMedia && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Media Name</Label>
                  <Input
                    id="edit-name"
                    value={editingMedia.name}
                    onChange={(e) =>
                      editingMedia &&
                      setEditingMedia({ ...editingMedia, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <select
                    id="edit-category"
                    value={editingMedia.category}
                    onChange={(e) =>
                      editingMedia &&
                      setEditingMedia({
                        ...editingMedia,
                        category: e.target.value,
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingMedia.description}
                    onChange={(e) =>
                      editingMedia &&
                      setEditingMedia({
                        ...editingMedia,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    value={editingMedia.status}
                    onChange={(e) =>
                      editingMedia &&
                      setEditingMedia({
                        ...editingMedia,
                        status: e.target.value as "Draft" | "Published",
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleEdit}>
                Save Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
