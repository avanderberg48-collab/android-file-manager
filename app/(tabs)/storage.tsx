import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import {
  getStorageInfo,
  calculateCategoryStorage,
  formatFileSize,
  CategoryStorage,
} from "@/lib/file-system";

export default function StorageScreen() {
  const colors = useColors();
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageTotal, setStorageTotal] = useState(0);
  const [storageFree, setStorageFree] = useState(0);
  const [categories, setCategories] = useState<CategoryStorage>({
    images: 0,
    videos: 0,
    audio: 0,
    documents: 0,
    archives: 0,
    other: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    setIsLoading(true);
    try {
      const info = await getStorageInfo();
      setStorageUsed(info.usedSpace);
      setStorageTotal(info.totalSpace);
      setStorageFree(info.freeSpace);

      const categoryData = await calculateCategoryStorage(
        FileSystem.documentDirectory || ""
      );
      setCategories(categoryData);
    } catch (error) {
      console.error("Failed to load storage data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const storagePercentage = storageTotal > 0 ? (storageUsed / storageTotal) * 100 : 0;

  const categoryData = [
    { name: "Images", value: categories.images, color: "#8B5CF6", icon: "photo.fill" as const },
    { name: "Videos", value: categories.videos, color: "#EC4899", icon: "video.fill" as const },
    { name: "Audio", value: categories.audio, color: "#14B8A6", icon: "music.note" as const },
    { name: "Documents", value: categories.documents, color: "#F97316", icon: "doc.text.fill" as const },
    { name: "Archives", value: categories.archives, color: "#6366F1", icon: "archivebox.fill" as const },
    { name: "Other", value: categories.other, color: "#6B7280", icon: "doc.fill" as const },
  ];

  const totalCategorySize = Object.values(categories).reduce((sum, val) => sum + val, 0);

  return (
    <ScreenContainer>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadStorageData}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontSize: 34,
              fontWeight: "bold",
              color: colors.foreground,
              marginBottom: 24,
            }}
          >
            Storage
          </Text>

          {/* Storage Circle */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                borderWidth: 20,
                borderColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  borderWidth: 20,
                  borderColor: storagePercentage > 90 ? colors.error : colors.primary,
                  borderTopColor: "transparent",
                  borderRightColor: "transparent",
                  transform: [{ rotate: `${(storagePercentage / 100) * 360}deg` }],
                }}
              />
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: colors.foreground,
                  }}
                >
                  {storagePercentage.toFixed(0)}%
                </Text>
                <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
                  Used
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 24, alignItems: "center" }}>
              <Text style={{ fontSize: 17, color: colors.foreground, fontWeight: "600" }}>
                {formatFileSize(storageUsed)} of {formatFileSize(storageTotal)}
              </Text>
              <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
                {formatFileSize(storageFree)} available
              </Text>
            </View>
          </View>

          {/* Category Breakdown */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: colors.foreground,
                marginBottom: 16,
              }}
            >
              Storage Breakdown
            </Text>

            {categoryData.map((category, index) => {
              const percentage = totalCategorySize > 0 ? (category.value / totalCategorySize) * 100 : 0;
              
              return (
                <TouchableOpacity
                  key={category.name}
                  style={{
                    marginBottom: index < categoryData.length - 1 ? 16 : 0,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: category.color + "20",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <IconSymbol
                        name={category.icon}
                        size={24}
                        color={category.color}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: "600",
                          color: colors.foreground,
                        }}
                      >
                        {category.name}
                      </Text>
                      <Text style={{ fontSize: 14, color: colors.muted }}>
                        {formatFileSize(category.value)} • {percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View
                    style={{
                      height: 6,
                      backgroundColor: colors.border,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: `${percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
