import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { ScreenContainer } from "@/components/screen-container";
import { FileItem as FileItemComponent } from "@/components/file-item";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { FileItem, searchFiles } from "@/lib/file-system";

export default function SearchScreen() {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FileItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (query.length >= 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const searchResults = await searchFiles(
        FileSystem.documentDirectory || "",
        query
      );
      setResults(searchResults);
    } catch (error) {
      Alert.alert("Error", "Failed to search files");
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilePress = (item: FileItem) => {
    Alert.alert("File", `Open ${item.name}`, [{ text: "OK" }]);
  };

  const handleFileLongPress = (item: FileItem) => {
    Alert.alert(item.name, `Path: ${item.path}`, [{ text: "OK" }]);
  };

  const handleRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  return (
    <ScreenContainer>
      {/* Search Header */}
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
        <Text
          style={{
            fontSize: 34,
            fontWeight: "bold",
            color: colors.foreground,
            marginBottom: 12,
          }}
        >
          Search
        </Text>

        {/* Search Input */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 44,
          }}
        >
          <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search files and folders"
            placeholderTextColor={colors.muted}
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 17,
              color: colors.foreground,
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <IconSymbol name="xmark" size={20} color={colors.muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {query.length === 0 ? (
        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: colors.foreground,
              marginBottom: 12,
            }}
          >
            Recent Searches
          </Text>
          {recentSearches.length === 0 ? (
            <View style={{ paddingVertical: 32, alignItems: "center" }}>
              <IconSymbol name="magnifyingglass" size={64} color={colors.muted} />
              <Text
                style={{
                  marginTop: 16,
                  fontSize: 16,
                  color: colors.muted,
                  textAlign: "center",
                }}
              >
                Search for files and folders
              </Text>
            </View>
          ) : (
            recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRecentSearch(search)}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 17, color: colors.foreground }}>
                  {search}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.path}
          renderItem={({ item }) => (
            <FileItemComponent
              item={item}
              onPress={() => handleFilePress(item)}
              onLongPress={() => handleFileLongPress(item)}
            />
          )}
          ListEmptyComponent={
            <View style={{ padding: 32, alignItems: "center" }}>
              {isSearching ? (
                <Text style={{ fontSize: 16, color: colors.muted }}>
                  Searching...
                </Text>
              ) : (
                <>
                  <IconSymbol name="magnifyingglass" size={64} color={colors.muted} />
                  <Text
                    style={{
                      marginTop: 16,
                      fontSize: 16,
                      color: colors.muted,
                      textAlign: "center",
                    }}
                  >
                    No results found for "{query}"
                  </Text>
                </>
              )}
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}
