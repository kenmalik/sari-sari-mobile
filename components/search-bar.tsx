import { ShopifyContext } from "@/app/ShopifyContext";
import { PREDICTIVE_SEARCH } from "@/constants/StorefrontQueries";
import Feather from "@expo/vector-icons/build/Feather";
import { Link, router } from "expo-router";
import { useContext, useRef, useState } from "react";
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
  const shopifyClient = useContext(ShopifyContext);

  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResultObject[]>([]);
  const barHeight = useRef<number>(0);

  async function handleSearch() {
    if (!shopifyClient) {
      return [];
    }

    try {
      const res = await shopifyClient.request(PREDICTIVE_SEARCH, {
        variables: {
          query: searchText,
          maxResults: 10,
        },
      });
      if (res.errors) {
        throw res.errors;
      }

      const searchResults = res.data.predictiveSearch.products.map(
        (result: any) => {
          return {
            id: result.id,
            title: result.title,
          };
        },
      );
      setSearchResults(searchResults);
    } catch (e) {
      console.error(e);
    }
  }

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
          onChangeText={(text) => {
            setSearchText(text);
            handleSearch();
          }}
        />
      </View>
      <View
        style={[
          styles.results,
          { top: barHeight.current },
          isFocused ? null : { display: "none" },
        ]}
      >
        <SearchResults results={searchResults} />
      </View>
    </View>
  );
}

type SearchResultObject = {
  id: string;
  title: string;
};

type SearchResultsProps = {
  results: SearchResultObject[];
};

function SearchResults({ results }: SearchResultsProps) {
  return (
    <View style={{ gap: 8 }}>
      {results.map((result, index) => (
        <SearchResult productId={result.id} title={result.title} key={index} />
      ))}
    </View>
  );
}

function SearchResult({
  style,
  title,
  productId,
}: {
  style?: StyleProp<ViewStyle>;
  title: string;
  productId: string;
}) {
  return (
    <Link
      href={{ pathname: "/(pages)/products/[id]", params: { id: productId } }}
      asChild
    >
      <Pressable onPress={() => console.log("Navigaing to ", title)}>
        {({ pressed }) => (
          <View
            style={[
              { flexDirection: "row", gap: 16, alignItems: "center" },
              style,
            ]}
          >
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
          </View>
        )}
      </Pressable>
    </Link>
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
