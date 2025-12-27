import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ViewMode = "list" | "grid";
export type SortOrder = "name" | "date" | "size" | "type";
export type ThemeMode = "light" | "dark" | "auto";

export interface AppSettings {
  viewMode: ViewMode;
  sortOrder: SortOrder;
  showHiddenFiles: boolean;
  confirmBeforeDelete: boolean;
  theme: ThemeMode;
}

const DEFAULT_SETTINGS: AppSettings = {
  viewMode: "list",
  sortOrder: "name",
  showHiddenFiles: false,
  confirmBeforeDelete: true,
  theme: "auto",
};

const SETTINGS_KEY = "app_settings";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const updateSetting = async <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    await saveSettings(newSettings);
  };

  return {
    settings,
    isLoading,
    updateSetting,
    saveSettings,
  };
}
