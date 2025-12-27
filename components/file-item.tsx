import { View, Text, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "./ui/icon-symbol";
import { FileItem as FileItemType, formatFileSize, formatDate, getFileType } from "@/lib/file-system";
import { useColors } from "@/hooks/use-colors";

interface FileItemProps {
  item: FileItemType;
  onPress: () => void;
  onLongPress: () => void;
  isSelected?: boolean;
}

export function FileItem({ item, onPress, onLongPress, isSelected }: FileItemProps) {
  const colors = useColors();

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const handleLongPress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onLongPress();
  };

  const getIconName = (): any => {
    if (item.isDirectory) return "folder.fill";
    
    const fileType = getFileType(item.name);
    switch (fileType) {
      case "image": return "photo.fill";
      case "video": return "video.fill";
      case "audio": return "music.note";
      case "document": return "doc.text.fill";
      case "archive": return "archivebox.fill";
      default: return "doc.fill";
    }
  };

  const getIconColor = () => {
    if (item.isDirectory) return "#3B82F6";
    
    const fileType = getFileType(item.name);
    switch (fileType) {
      case "image": return "#8B5CF6";
      case "video": return "#EC4899";
      case "audio": return "#14B8A6";
      case "document": return "#F97316";
      case "archive": return "#6366F1";
      default: return colors.muted;
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isSelected ? colors.surface : "transparent",
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={{ marginRight: 12 }}>
        <IconSymbol
          name={getIconName()}
          size={32}
          color={getIconColor()}
        />
      </View>
      
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: colors.foreground,
            marginBottom: 2,
          }}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.muted,
          }}
        >
          {item.isDirectory
            ? "Folder"
            : `${formatFileSize(item.size)} • ${formatDate(item.modificationTime)}`}
        </Text>
      </View>

      {isSelected && (
        <IconSymbol
          name="checkmark"
          size={24}
          color={colors.primary}
        />
      )}
    </Pressable>
  );
}
