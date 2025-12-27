import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
  TextInput,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { FileItem as FileItemComponent } from "@/components/file-item";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useSettings } from "@/hooks/use-settings";
import {
  FileItem,
  listDirectory,
  createFolder,
  deleteItem,
  copyItem,
  moveItem,
  getStorageInfo,
  formatFileSize,
} from "@/lib/file-system";

export default function FileBrowserScreen() {
  const colors = useColors();
  const { settings } = useSettings();
  const [currentPath, setCurrentPath] = useState(FileSystem.documentDirectory || "");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageTotal, setStorageTotal] = useState(0);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [clipboardItem, setClipboardItem] = useState<{ path: string; operation: "copy" | "move" } | null>(null);

  useEffect(() => {
    loadDirectory();
    loadStorageInfo();
  }, [currentPath]);

  const loadDirectory = async () => {
    setIsLoading(true);
    try {
      const items = await listDirectory(currentPath);
      setFiles(items);
    } catch (error) {
      Alert.alert("Error", "Failed to load directory");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStorageInfo = async () => {
    const info = await getStorageInfo();
    setStorageUsed(info.usedSpace);
    setStorageTotal(info.totalSpace);
  };

  const handleFilePress = (item: FileItem) => {
    if (isMultiSelectMode) {
      toggleSelection(item.path);
    } else if (item.isDirectory) {
      setCurrentPath(item.path);
    } else {
      Alert.alert("File", `Open ${item.name}`, [
        { text: "OK" },
      ]);
    }
  };

  const handleFileLongPress = (item: FileItem) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    showContextMenu(item);
  };

  const toggleSelection = (path: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(path)) {
      newSelection.delete(path);
    } else {
      newSelection.add(path);
    }
    setSelectedItems(newSelection);
  };

  const showContextMenu = (item: FileItem) => {
    const buttons = [
      {
        text: "Copy",
        onPress: () => {
          setClipboardItem({ path: item.path, operation: "copy" });
          Alert.alert("Success", "Item copied to clipboard");
        },
      },
      {
        text: "Move",
        onPress: () => {
          setClipboardItem({ path: item.path, operation: "move" });
          Alert.alert("Success", "Item ready to move");
        },
      },
      {
        text: "Rename",
        onPress: () => showRenameDialog(item),
      },
      {
        text: "Delete",
        onPress: () => confirmDelete(item),
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ];

    Alert.alert(item.name, "Choose an action", buttons as any);
  };

  const showRenameDialog = (item: FileItem) => {
    Alert.prompt(
      "Rename",
      "Enter new name",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Rename",
          onPress: async (newName?: string) => {
            if (newName && newName !== item.name) {
              const newPath = `${currentPath}/${newName}`;
              const success = await moveItem(item.path, newPath);
              if (success) {
                loadDirectory();
              } else {
                Alert.alert("Error", "Failed to rename item");
              }
            }
          },
        },
      ],
      "plain-text",
      item.name
    );
  };

  const confirmDelete = (item: FileItem) => {
    const message = item.isDirectory
      ? "This will delete the folder and all its contents."
      : "This file will be permanently deleted.";

    Alert.alert("Delete", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await deleteItem(item.path);
          if (success) {
            loadDirectory();
            loadStorageInfo();
          } else {
            Alert.alert("Error", "Failed to delete item");
          }
        },
      },
    ]);
  };

  const handleCreateFolder = () => {
    Alert.prompt(
      "New Folder",
      "Enter folder name",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: async (folderName?: string) => {
            if (folderName) {
              const newPath = `${currentPath}/${folderName}`;
              const success = await createFolder(newPath);
              if (success) {
                loadDirectory();
              } else {
                Alert.alert("Error", "Failed to create folder");
              }
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handlePaste = async () => {
    if (!clipboardItem) return;

    const fileName = clipboardItem.path.split("/").pop() || "item";
    const destinationPath = `${currentPath}/${fileName}`;

    let success = false;
    if (clipboardItem.operation === "copy") {
      success = await copyItem(clipboardItem.path, destinationPath);
    } else {
      success = await moveItem(clipboardItem.path, destinationPath);
    }

    if (success) {
      setClipboardItem(null);
      loadDirectory();
      loadStorageInfo();
    } else {
      Alert.alert("Error", `Failed to ${clipboardItem.operation} item`);
    }
  };

  const handleGoBack = () => {
    const parentPath = currentPath.split("/").slice(0, -1).join("/");
    if (parentPath && parentPath !== currentPath) {
      setCurrentPath(parentPath);
    }
  };

  const canGoBack = currentPath !== FileSystem.documentDirectory;

  const storagePercentage = storageTotal > 0 ? (storageUsed / storageTotal) * 100 : 0;

  return (
    <ScreenContainer>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        {/* Navigation */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          {canGoBack && (
            <TouchableOpacity
              onPress={handleGoBack}
              style={{ marginRight: 12, padding: 4 }}
            >
              <IconSymbol name="arrow.left" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          <Text
            style={{
              flex: 1,
              fontSize: 20,
              fontWeight: "bold",
              color: colors.foreground,
            }}
            numberOfLines={1}
          >
            {currentPath.split("/").pop() || "Files"}
          </Text>
          {clipboardItem && (
            <TouchableOpacity
              onPress={handlePaste}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: colors.primary,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "600" }}>
                Paste
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Storage Bar */}
        <View>
          <View
            style={{
              height: 6,
              backgroundColor: colors.surface,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${storagePercentage}%`,
                backgroundColor: storagePercentage > 90 ? colors.error : colors.primary,
              }}
            />
          </View>
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
            {formatFileSize(storageUsed)} of {formatFileSize(storageTotal)} used
          </Text>
        </View>
      </View>

      {/* File List */}
      <FlatList
        data={files}
        keyExtractor={(item) => item.path}
        renderItem={({ item }) => (
          <FileItemComponent
            item={item}
            onPress={() => handleFilePress(item)}
            onLongPress={() => handleFileLongPress(item)}
            isSelected={selectedItems.has(item.path)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadDirectory}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={{ padding: 32, alignItems: "center" }}>
            <IconSymbol name="folder.fill" size={64} color={colors.muted} />
            <Text style={{ marginTop: 16, fontSize: 16, color: colors.muted }}>
              This folder is empty
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleCreateFolder}
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <IconSymbol name="plus.circle.fill" size={28} color="#fff" />
      </TouchableOpacity>
    </ScreenContainer>
  );
}
