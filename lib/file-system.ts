import * as FileSystem from "expo-file-system/legacy";

export type FileItemType = "file" | "folder";

export interface FileItem {
  name: string;
  path: string;
  type: FileItemType;
  size: number;
  modificationTime: number;
  isDirectory: boolean;
  uri: string;
}

export interface StorageInfo {
  totalSpace: number;
  freeSpace: number;
  usedSpace: number;
}

export interface CategoryStorage {
  images: number;
  videos: number;
  audio: number;
  documents: number;
  archives: number;
  other: number;
}

/**
 * Get file type based on extension
 */
export function getFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  
  const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "heic"];
  const videoExts = ["mp4", "mov", "avi", "mkv", "webm", "m4v"];
  const audioExts = ["mp3", "wav", "aac", "m4a", "flac", "ogg"];
  const documentExts = ["pdf", "doc", "docx", "txt", "rtf", "xls", "xlsx", "ppt", "pptx"];
  const archiveExts = ["zip", "rar", "7z", "tar", "gz"];
  
  if (imageExts.includes(ext)) return "image";
  if (videoExts.includes(ext)) return "video";
  if (audioExts.includes(ext)) return "audio";
  if (documentExts.includes(ext)) return "document";
  if (archiveExts.includes(ext)) return "archive";
  
  return "other";
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format date to relative time
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return date.toLocaleDateString();
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

/**
 * List files and folders in a directory
 */
export async function listDirectory(path: string): Promise<FileItem[]> {
  try {
    const items = await FileSystem.readDirectoryAsync(path);
    const fileItems: FileItem[] = [];
    
    for (const item of items) {
      const itemPath = `${path}/${item}`;
      try {
        const info = await FileSystem.getInfoAsync(itemPath);
        
        if (info.exists) {
          fileItems.push({
            name: item,
            path: itemPath,
            type: info.isDirectory ? "folder" : "file",
            size: info.size || 0,
            modificationTime: info.modificationTime || 0,
            isDirectory: info.isDirectory || false,
            uri: info.uri,
          });
        }
      } catch (error) {
        console.warn(`Failed to get info for ${itemPath}:`, error);
      }
    }
    
    // Sort: folders first, then by name
    return fileItems.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Failed to list directory:", error);
    return [];
  }
}

/**
 * Create a new folder
 */
export async function createFolder(path: string): Promise<boolean> {
  try {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
    return true;
  } catch (error) {
    console.error("Failed to create folder:", error);
    return false;
  }
}

/**
 * Delete a file or folder
 */
export async function deleteItem(path: string): Promise<boolean> {
  try {
    await FileSystem.deleteAsync(path, { idempotent: true });
    return true;
  } catch (error) {
    console.error("Failed to delete item:", error);
    return false;
  }
}

/**
 * Copy a file or folder
 */
export async function copyItem(sourcePath: string, destinationPath: string): Promise<boolean> {
  try {
    await FileSystem.copyAsync({
      from: sourcePath,
      to: destinationPath,
    });
    return true;
  } catch (error) {
    console.error("Failed to copy item:", error);
    return false;
  }
}

/**
 * Move a file or folder
 */
export async function moveItem(sourcePath: string, destinationPath: string): Promise<boolean> {
  try {
    await FileSystem.moveAsync({
      from: sourcePath,
      to: destinationPath,
    });
    return true;
  } catch (error) {
    console.error("Failed to move item:", error);
    return false;
  }
}

/**
 * Get storage information
 */
export async function getStorageInfo(): Promise<StorageInfo> {
  try {
    const freeDiskStorage = await FileSystem.getFreeDiskStorageAsync();
    const totalDiskCapacity = await FileSystem.getTotalDiskCapacityAsync();
    
    return {
      totalSpace: totalDiskCapacity || 0,
      freeSpace: freeDiskStorage || 0,
      usedSpace: (totalDiskCapacity || 0) - (freeDiskStorage || 0),
    };
  } catch (error) {
    console.error("Failed to get storage info:", error);
    return {
      totalSpace: 0,
      freeSpace: 0,
      usedSpace: 0,
    };
  }
}

/**
 * Calculate storage by category
 */
export async function calculateCategoryStorage(path: string): Promise<CategoryStorage> {
  const categories: CategoryStorage = {
    images: 0,
    videos: 0,
    audio: 0,
    documents: 0,
    archives: 0,
    other: 0,
  };
  
  try {
    const items = await listDirectory(path);
    
    for (const item of items) {
      if (item.isDirectory) {
        const subCategories = await calculateCategoryStorage(item.path);
        categories.images += subCategories.images;
        categories.videos += subCategories.videos;
        categories.audio += subCategories.audio;
        categories.documents += subCategories.documents;
        categories.archives += subCategories.archives;
        categories.other += subCategories.other;
      } else {
        const fileType = getFileType(item.name);
        switch (fileType) {
          case "image":
            categories.images += item.size;
            break;
          case "video":
            categories.videos += item.size;
            break;
          case "audio":
            categories.audio += item.size;
            break;
          case "document":
            categories.documents += item.size;
            break;
          case "archive":
            categories.archives += item.size;
            break;
          default:
            categories.other += item.size;
        }
      }
    }
  } catch (error) {
    console.error("Failed to calculate category storage:", error);
  }
  
  return categories;
}

/**
 * Search files by name
 */
export async function searchFiles(path: string, query: string): Promise<FileItem[]> {
  const results: FileItem[] = [];
  const lowerQuery = query.toLowerCase();
  
  try {
    const items = await listDirectory(path);
    
    for (const item of items) {
      if (item.name.toLowerCase().includes(lowerQuery)) {
        results.push(item);
      }
      
      if (item.isDirectory) {
        const subResults = await searchFiles(item.path, query);
        results.push(...subResults);
      }
    }
  } catch (error) {
    console.error("Failed to search files:", error);
  }
  
  return results;
}
