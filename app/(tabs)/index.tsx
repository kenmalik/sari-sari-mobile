import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { ShopifyContext } from "../ShopifyContext";
import { ProductCardProps } from "@/components/ProductCard";
import { ProductView } from "@/components/ProductView";
import { GET_PRODUCT_PAGE } from "@/constants/StorefrontQueries";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const shopifyClient = useContext(ShopifyContext);

  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  let pageCursor = useRef<string | null>(null);
  const ITEMS_PER_PAGE = 10;

  async function loadPage() {
    if (!shopifyClient) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await shopifyClient.request(GET_PRODUCT_PAGE, {
        variables: {
          count: ITEMS_PER_PAGE,
          cursor: pageCursor.current,
        },
      });
      if (res.errors) {
        throw res.errors;
      }

      const page: ProductCardProps[] = res.data.products.edges.map(
        (edge: any) => {
          return {
            ...edge.node,
            price: edge.node.priceRange.minVariantPrice,
            compareAtPrice: edge.node.compareAtPriceRange.minVariantPrice,
          };
        },
      );
      setProducts(products.concat(page));

      const hasNextPage = res.data.products.pageInfo.hasNextPage;
      setHasNextPage(hasNextPage);
      pageCursor.current = hasNextPage
        ? res.data.products.pageInfo.endCursor
        : null;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <ProductView
        products={products}
        onLoad={loadPage}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        HeaderComponent={<Text style={styles.pageTitle}>Products</Text>}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 24,
    textAlign: "center",
  },
});
