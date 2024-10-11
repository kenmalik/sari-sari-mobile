import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { ShopifyContext } from "../ShopifyContext";
import { ProductCardProps } from "@/components/ProductCard";
import { ProductView } from "@/components/ProductView";
import { GET_PRODUCT_PAGE } from "@/constants/StorefrontQueries";

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
        (edge: any) => ({
          ...edge.node,
          price: edge.node.priceRange.minVariantPrice.amount,
          currency: edge.node.priceRange.minVariantPrice.currencyCode,
        }),
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
    <ProductView
      products={products}
      onLoad={loadPage}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      HeaderComponent={<Text style={styles.pageTitle}>Products</Text>}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    gap: 32,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 24,
    textAlign: "center",
  },
});
