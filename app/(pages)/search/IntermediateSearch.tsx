import { View, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import { ShopifyContext } from "@/app/ShopifyContext";
import { PREDICTIVE_SEARCH } from "@/constants/StorefrontQueries";
import { SearchBar } from "@/components/SearchBar";
import { Stack } from "expo-router";
import { SearchResult } from "@/components/SearchResult";
import AntDesign from "@expo/vector-icons/AntDesign";

type SearchResultObject = {
  id: string;
  title: string;
  isCollection: boolean;
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

      const products = res.data.predictiveSearch.products.map((result: any) => {
        return {
          id: result.id,
          title: result.title,
          isCollection: false,
        };
      });
      const collections = res.data.predictiveSearch.collections.map(
        (result: any) => {
          return {
            id: result.id,
            title: result.title,
            isCollection: true,
          };
        },
      );
      setSearchResults(products.concat(collections));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
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
            title={result.title}
            style={styles.result}
            link={
              result.isCollection
                ? {
                    pathname: "/(pages)/collections/[id]",
                    params: { id: result.id },
                  }
                : {
                    pathname: "/(pages)/products/[id]",
                    params: { id: result.id },
                  }
            }
            icon={
              result.isCollection ? (
                <AntDesign name="isv" size={20} color="grey" />
              ) : null
            }
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
