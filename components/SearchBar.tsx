import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router } from "expo-router";
import { useState } from "react";
import { TextInput, View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function FakeSearchBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 4 }]}>
      <Link href={"/search/IntermediateSearch"} asChild>
        <TextInput
          style={styles.input}
          placeholder="Search Shop Sari Sari"
          placeholderTextColor="grey"
          editable={false}
        />
      </Link>
    </View>
  );
}

type SearchBarProps = {
  onChangeText?: (text: string) => void;
};

export function SearchBar({ onChangeText }: SearchBarProps) {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState<string>("");

  function onSearch(text: string) {
    setSearchText(text);
    if (onChangeText) {
      onChangeText(text);
    }
  }

  return (
    <View>
      <View style={[styles.bar, { paddingTop: insets.top + 4 }]}>
        <Pressable onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </Pressable>
        <TextInput
          autoFocus
          style={styles.input}
          placeholder="Search Shop Sari Sari"
          placeholderTextColor="grey"
          enterKeyHint="search"
          onSubmitEditing={() => {
            if (searchText !== "") {
              router.replace({
                pathname: "/(pages)/search/[searchTerm]",
                params: { searchTerm: searchText },
              });
              setSearchText("");
            }
          }}
          value={searchText}
          onChangeText={onSearch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    padding: 12,
    backgroundColor: "rgb(3, 9, 156)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    height: 32,
    backgroundColor: "white",
    borderRadius: 8,
    flex: 1,
    padding: 8,
  },
  results: {
    backgroundColor: "white",
    padding: 8,
    position: "absolute",
    width: "100%",
    gap: 8,
  },
});
