import { ShopifyContext } from "@/app/ShopifyContext";
import { ProductCardProps } from "@/components/ProductCard";
import { ProductView } from "@/components/ProductView";
import { SEARCH } from "@/constants/StorefrontQueries";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Search() {
  const RESULTS_PER_PAGE = 10;
  const shopifyClient = useContext(ShopifyContext);
  const { searchTerm } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const pageCursor = useRef<string | null>(null);
  const [searchResults, setSearchResults] = useState<ProductCardProps[]>([]);

  useEffect(() => {
    fetchSearchResults();
  }, []);

  async function fetchSearchResults() {
    if (!shopifyClient) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await shopifyClient.request(SEARCH, {
        variables: {
          query: searchTerm,
          count: RESULTS_PER_PAGE,
          cursor: pageCursor.current,
        },
      });
      if (res.errors) {
        throw res.errors;
      }

      const page: ProductCardProps[] = res.data.search.edges.map(
        (edge: any) => ({
          ...edge.node,
          price: edge.node.priceRange.minVariantPrice.amount,
          currency: edge.node.priceRange.minVariantPrice.currencyCode,
        }),
      );
      setSearchResults(searchResults.concat(page));

      const hasNextPage = res.data.search.pageInfo.hasNextPage;
      setHasNextPage(hasNextPage);
      pageCursor.current = hasNextPage
        ? res.data.search.pageInfo.endCursor
        : null;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ProductView
      products={searchResults}
      onLoad={fetchSearchResults}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      HeaderComponent={
        <View style={{ marginBottom: 32, marginHorizontal: 32 }}>
          <Text style={styles.pageTitle}>Search</Text>
          <Text numberOfLines={1}>Showing results for "{searchTerm}"</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 16,
    textAlign: "center",
  },
});
