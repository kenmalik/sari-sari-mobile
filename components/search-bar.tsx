import Feather from "@expo/vector-icons/build/Feather";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchBar() {
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const barHeight = useRef<number>(0);

  return (
    <View>
      <View
        style={[styles.bar, { paddingTop: insets.top + 4 }]}
        onLayout={(event) =>
          event.target.measure(
            (_x, _y, _width, height) => (barHeight.current = height),
          )
        }
      >
        <TextInput
          style={styles.input}
          placeholder="Search Shop Sari Sari"
          placeholderTextColor="grey"
          enterKeyHint="search"
          onFocus={() => setIsFocused(true)}
          onEndEditing={() => setIsFocused(false)}
          onSubmitEditing={() => {
            router.push({
              pathname: "/(pages)/search/[searchTerm]",
              params: { searchTerm: searchText },
            });
            setSearchText("");
          }}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View
        style={[
          styles.results,
          { top: barHeight.current },
          isFocused ? null : { display: "none" },
        ]}
      >
        <SearchResults results={SAMPLE_DATA} />
      </View>
    </View>
  );
}

type SearchResultObject = {
  title: string;
};

type SearchResultsProps = {
  results: SearchResultObject[];
};

function SearchResults({ results }: SearchResultsProps) {
  return (
    <View style={{ gap: 8 }}>
      {results.map((result, index) => (
        <SearchResult title={result.title} key={index} />
      ))}
    </View>
  );
}

function SearchResult({
  style,
  title,
}: {
  style?: StyleProp<ViewStyle>;
  title: string;
}) {
  return (
    <Pressable
      style={[{ flexDirection: "row", gap: 16, alignItems: "center" }, style]}
      onPress={() => console.log("Navigaing to ", title)}
    >
      {({ pressed }) => (
        <>
          <Text
            style={{ flex: 1, color: pressed ? "grey" : "black" }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Feather
            name="arrow-up-left"
            size={24}
            color={pressed ? "black" : "grey"}
          />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    padding: 12,
    backgroundColor: "rgb(3, 9, 156)",
  },
  input: {
    height: 32,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
  },
  results: {
    backgroundColor: "white",
    padding: 8,
    position: "absolute",
    width: "100%",
  },
});

const SAMPLE_DATA = [
  { title: "Result 1" },
  { title: "Result 2" },
  { title: "Result 3" },
  { title: "Result 4" },
  { title: "Result 5" },
  { title: "Result 6" },
  { title: "Result 7" },
  { title: "Result 8" },
  { title: "Result 9" },
  { title: "Result 10" },
];
