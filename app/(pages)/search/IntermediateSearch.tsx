import { View, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import { ShopifyContext } from "@/app/ShopifyContext";
import { PREDICTIVE_SEARCH } from "@/constants/StorefrontQueries";
import { SearchBar } from "@/components/SearchBar";
import { Stack } from "expo-router";
import { SearchResult } from "@/components/SearchResult";
import { StatusBar } from "expo-status-bar";

type SearchResultObject = {
  id: string;
  title: string;
};

export default function IntermediateSearch() {
  const shopifyClient = useContext(ShopifyContext);

  const [searchResults, setSearchResults] = useState<SearchResultObject[]>([]);

  async function handleSearch(searchText: string) {
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
    <>
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          header: () => (
            <SearchBar onChangeText={(text) => handleSearch(text)} />
          ),
          animation: "none",
        }}
      />
      <View>
        {searchResults.map((result) => (
          <SearchResult
            key={result.id}
            productId={result.id}
            title={result.title}
            style={styles.result}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  result: {
    backgroundColor: "white",
    padding: 8,
  },
});
