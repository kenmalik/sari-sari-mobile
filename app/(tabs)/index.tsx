import { useContext, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ShopifyContext } from "../ShopifyContext";
import ProductCard, { ProductCardProps } from "@/components/ProductCard";

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

      console.log(res.data);
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

  useEffect(function () {
    loadPage();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Products</Text>
      <View style={styles.cardContainer}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            featuredImage={product.featuredImage}
            price={product.price}
            currency={product.currency}
          />
        ))}
      </View>
      {hasNextPage && (
        <Pressable
          onPress={() => loadPage()}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgb(33, 39, 186)" : "rgb(3, 9, 156)",
            },
            styles.loadMoreButton,
          ]}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Load More</Text>
        </Pressable>
      )}
    </ScrollView>
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
