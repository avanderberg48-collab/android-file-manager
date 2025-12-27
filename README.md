# File Manager Pro

A feature-rich Android file manager application built with React Native and Expo. Browse, manage, and organize your files with an intuitive, iOS-inspired interface.

## Features

### File Management
- **Browse Files & Folders** - Navigate through your device storage with ease
- **Create Folders** - Organize your files by creating new folders
- **Copy & Move** - Relocate files and folders to different locations
- **Rename** - Change file and folder names
- **Delete** - Remove unwanted files and folders with confirmation
- **Long Press Actions** - Context menu for quick file operations

### Search
- **Real-time Search** - Find files and folders instantly as you type
- **Deep Search** - Search through all subdirectories

### Storage Analysis
- **Storage Overview** - Visual breakdown of used and available storage
- **Category Analysis** - See storage usage by file type (images, videos, audio, documents, archives)
- **Storage Percentage** - Clear visualization of storage capacity

### Settings
- **View Modes** - Switch between list and grid views
- **Sort Options** - Sort by name, date, size, or type
- **Theme Selection** - Choose light, dark, or auto theme
- **Show Hidden Files** - Toggle visibility of hidden files
- **Confirm Before Delete** - Enable/disable delete confirmation dialogs

## Tech Stack

- **React Native 0.81** with Expo SDK 54
- **TypeScript** for type safety
- **Expo Router 6** for navigation
- **NativeWind 4** (Tailwind CSS) for styling
- **Expo File System** for file operations
- **AsyncStorage** for settings persistence

## Installation

### Prerequisites
- Node.js 18+ and pnpm
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/android-file-manager.git
cd android-file-manager
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Run on your device:
   - Install **Expo Go** app on your Android/iOS device
   - Scan the QR code shown in the terminal
   - Or run `pnpm android` for Android emulator
   - Or run `pnpm ios` for iOS simulator (macOS only)

## Building APK

### Method 1: EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure the build:
```bash
eas build:configure
```

4. Build APK for Android:
```bash
eas build --platform android --profile preview
```

The APK will be available for download from the Expo dashboard.

### Method 2: Local Build

1. Generate Android project:
```bash
npx expo prebuild --platform android
```

2. Build APK:
```bash
cd android
./gradlew assembleRelease
```

The APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Project Structure

```
android-file-manager/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based screens
│   │   ├── index.tsx      # File browser
│   │   ├── search.tsx     # Search screen
│   │   ├── storage.tsx    # Storage analysis
│   │   └── settings.tsx   # Settings screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── file-item.tsx     # File list item
│   └── ui/               # UI components
├── lib/                  # Utilities and helpers
│   └── file-system.ts    # File operations
├── hooks/                # Custom React hooks
│   ├── use-settings.ts   # Settings management
│   └── use-colors.ts     # Theme colors
├── assets/               # Images and icons
└── tests/                # Test files
```

## Permissions

The app requires the following permissions:

- **Storage Access** - Read and write files on device storage
- **Notifications** (optional) - For background operations

Permissions are requested at runtime when needed.

## Screenshots

[Add screenshots of your app here]

## Development

### Running Tests
```bash
pnpm test
```

### Type Checking
```bash
pnpm check
```

### Linting
```bash
pnpm lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI inspired by iOS Files app
- Icons from [Material Icons](https://fonts.google.com/icons)

## Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ using React Native and Expo
