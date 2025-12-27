# File Manager Pro - Mobile App Design

## Design Philosophy

This file manager app follows **Apple Human Interface Guidelines (HIG)** to feel like a first-party iOS app. The design prioritizes **one-handed usage** in **portrait orientation (9:16)** with mainstream iOS mobile app design standards.

## Screen List

1. **Home / Files Browser** - Main file browsing screen with folder navigation
2. **File Details** - Detailed view of selected file/folder with actions
3. **Search** - Search files and folders across storage
4. **Storage Info** - Visual storage usage breakdown
5. **Settings** - App preferences and configuration

## Primary Content and Functionality

### 1. Home / Files Browser Screen
**Content:**
- Current path breadcrumb at top
- Storage usage indicator bar
- List of files and folders with:
  - Icon (folder/file type)
  - Name
  - Size / item count
  - Last modified date
- Floating action button for new folder/upload

**Functionality:**
- Tap folder to navigate into it
- Long press file/folder for context menu (copy, move, delete, rename, share)
- Swipe actions: delete (left), share (right)
- Pull-to-refresh to reload directory
- Multi-select mode via toolbar button
- Sort options: name, date, size, type
- View toggle: list/grid

### 2. File Details Screen
**Content:**
- Large file type icon or thumbnail
- File name (editable)
- Full path
- Size, created date, modified date
- File type and extension
- Action buttons: Open, Share, Move, Copy, Delete, Rename

**Functionality:**
- Preview supported file types (images, text, PDF)
- Edit file name inline
- Quick actions for common operations
- Navigate to parent folder

### 3. Search Screen
**Content:**
- Search bar at top
- Recent searches
- Filter chips: file type, date range, size
- Search results list (same format as browser)

**Functionality:**
- Real-time search as user types
- Filter by file type, date, size
- Tap result to open file details
- Clear search history

### 4. Storage Info Screen
**Content:**
- Large circular progress indicator showing used/total storage
- Breakdown by category:
  - Images
  - Videos
  - Audio
  - Documents
  - Apps
  - Other
- Each category shows size and percentage
- Visual bar chart

**Functionality:**
- Tap category to see files in that category
- Refresh storage calculation
- Clear cache option

### 5. Settings Screen
**Content:**
- App preferences:
  - Default view mode (list/grid)
  - Default sort order
  - Show hidden files toggle
  - Confirm before delete toggle
  - Theme selection (light/dark/auto)
- About section:
  - App version
  - Storage permissions status

**Functionality:**
- Toggle switches for preferences
- Save settings to AsyncStorage
- Request storage permissions if not granted

## Key User Flows

### Flow 1: Browse and Open File
1. User opens app → Home screen shows root directory
2. User taps on a folder → Navigate into folder, breadcrumb updates
3. User taps on a file → File Details screen opens
4. User taps "Open" → File opens in appropriate viewer/app

### Flow 2: Delete Files
1. User long-presses a file → Context menu appears
2. User taps "Delete" → Confirmation dialog appears
3. User confirms → File is deleted, list refreshes

### Flow 3: Search for File
1. User taps search icon in header → Search screen opens
2. User types filename → Results appear in real-time
3. User taps result → File Details screen opens

### Flow 4: Create New Folder
1. User taps floating action button on Home screen → Menu appears
2. User taps "New Folder" → Dialog with text input appears
3. User enters name and confirms → Folder created, list refreshes

### Flow 5: Copy/Move Files
1. User long-presses file → Context menu appears
2. User taps "Copy" or "Move" → Folder picker appears
3. User navigates to destination folder → Taps "Paste Here"
4. File is copied/moved → Confirmation toast appears

## Color Choices

**Brand Colors:**
- **Primary**: `#2563EB` (Blue 600) - Modern, trustworthy, tech-forward
- **Background**: `#FFFFFF` (Light) / `#0F172A` (Dark - Slate 900)
- **Surface**: `#F8FAFC` (Light - Slate 50) / `#1E293B` (Dark - Slate 800)
- **Foreground**: `#0F172A` (Light) / `#F1F5F9` (Dark)
- **Muted**: `#64748B` (Slate 500)
- **Border**: `#E2E8F0` (Light) / `#334155` (Dark)
- **Success**: `#10B981` (Green 500) - File operations success
- **Warning**: `#F59E0B` (Amber 500) - Storage warnings
- **Error**: `#EF4444` (Red 500) - Delete confirmations

**File Type Colors:**
- Folders: `#3B82F6` (Blue)
- Images: `#8B5CF6` (Purple)
- Videos: `#EC4899` (Pink)
- Audio: `#14B8A6` (Teal)
- Documents: `#F97316` (Orange)
- Archives: `#6366F1` (Indigo)
- Other: `#6B7280` (Gray)

## Layout Principles

- **One-handed reach**: Critical actions (FAB, bottom tabs) within thumb zone
- **Generous tap targets**: Minimum 44pt touch targets per HIG
- **Clear hierarchy**: Large titles, clear sections, ample whitespace
- **Familiar patterns**: iOS-style navigation, swipe gestures, context menus
- **Responsive feedback**: Haptic feedback on key actions, visual press states

## Typography

- **Large Title**: 34pt Bold (Screen headers)
- **Title**: 28pt Bold (Section headers)
- **Headline**: 17pt Semibold (File names)
- **Body**: 17pt Regular (Metadata)
- **Caption**: 12pt Regular (Timestamps, sizes)

## Icons

Using SF Symbols style icons (via MaterialIcons fallback):
- Folder: `folder`
- File: `insert-drive-file`
- Image: `image`
- Video: `videocam`
- Audio: `audiotrack`
- Document: `description`
- Search: `search`
- Settings: `settings`
- More: `more-vert`
- Delete: `delete`
- Share: `share`
- Copy: `content-copy`
- Move: `drive-file-move`
- Create folder: `create-new-folder`
