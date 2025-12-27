import { View, Text, ScrollView, Switch, TouchableOpacity, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useSettings, ViewMode, SortOrder, ThemeMode } from "@/hooks/use-settings";

export default function SettingsScreen() {
  const colors = useColors();
  const { settings, updateSetting } = useSettings();

  const handleToggle = async (key: keyof typeof settings, value: boolean) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await updateSetting(key, value);
  };

  return (
    <ScreenContainer>
      <ScrollView>
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
            Settings
          </Text>

          {/* Display Section */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              Display
            </Text>

            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {/* View Mode */}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    color: colors.foreground,
                    marginBottom: 8,
                  }}
                >
                  Default View Mode
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => updateSetting("viewMode", "list")}
                    style={{
                      flex: 1,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      backgroundColor:
                        settings.viewMode === "list" ? colors.primary : colors.background,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: settings.viewMode === "list" ? "#fff" : colors.foreground,
                        fontWeight: "600",
                      }}
                    >
                      List
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => updateSetting("viewMode", "grid")}
                    style={{
                      flex: 1,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 8,
                      backgroundColor:
                        settings.viewMode === "grid" ? colors.primary : colors.background,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: settings.viewMode === "grid" ? "#fff" : colors.foreground,
                        fontWeight: "600",
                      }}
                    >
                      Grid
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sort Order */}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    color: colors.foreground,
                    marginBottom: 8,
                  }}
                >
                  Default Sort Order
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {(["name", "date", "size", "type"] as SortOrder[]).map((order) => (
                    <TouchableOpacity
                      key={order}
                      onPress={() => updateSetting("sortOrder", order)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor:
                          settings.sortOrder === order ? colors.primary : colors.background,
                      }}
                    >
                      <Text
                        style={{
                          color: settings.sortOrder === order ? "#fff" : colors.foreground,
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {order}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Theme */}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: "600",
                    color: colors.foreground,
                    marginBottom: 8,
                  }}
                >
                  Theme
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {(["light", "dark", "auto"] as ThemeMode[]).map((theme) => (
                    <TouchableOpacity
                      key={theme}
                      onPress={() => updateSetting("theme", theme)}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor:
                          settings.theme === theme ? colors.primary : colors.background,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: settings.theme === theme ? "#fff" : colors.foreground,
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {theme}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Behavior Section */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              Behavior
            </Text>

            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {/* Show Hidden Files */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "600",
                      color: colors.foreground,
                    }}
                  >
                    Show Hidden Files
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.muted, marginTop: 2 }}>
                    Display files starting with a dot
                  </Text>
                </View>
                <Switch
                  value={settings.showHiddenFiles}
                  onValueChange={(value) => handleToggle("showHiddenFiles", value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>

              {/* Confirm Before Delete */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "600",
                      color: colors.foreground,
                    }}
                  >
                    Confirm Before Delete
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.muted, marginTop: 2 }}>
                    Show confirmation dialog before deleting
                  </Text>
                </View>
                <Switch
                  value={settings.confirmBeforeDelete}
                  onValueChange={(value) => handleToggle("confirmBeforeDelete", value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </View>

          {/* About Section */}
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: colors.foreground,
                marginBottom: 12,
              }}
            >
              About
            </Text>

            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 17, color: colors.foreground }}>
                  Version
                </Text>
                <Text style={{ fontSize: 17, color: colors.muted }}>1.0.0</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 17, color: colors.foreground }}>
                  Platform
                </Text>
                <Text style={{ fontSize: 17, color: colors.muted }}>
                  {Platform.OS === "ios" ? "iOS" : Platform.OS === "android" ? "Android" : "Web"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
