import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { ShopifyContext } from "../ShopifyContext";
import { ProductCardProps } from "@/components/ProductCard";
import { ProductView } from "@/components/ProductView";

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

      if (res.errors || res.extensions) {
        console.error(res.errors);
        console.log(res.extensions);
      }
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
      titleBlock={<Text style={styles.pageTitle}>Products</Text>}
    />
  );
}

const GET_PRODUCT_PAGE = `
  query PageQuery($count: Int, $cursor: String) {
    products(first: $count, after: $cursor) {
      edges {
        node {
          id
          title
          featuredImage {
            id
            url
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 32,
    textAlign: "center",
  },
  loadMoreButton: {
    paddingVertical: 16,
    paddingHorizontal: 64,
    marginTop: 16,
    marginBottom: 64,
    shadowColor: "grey",
    shadowOpacity: 100,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "white",
  },
});
