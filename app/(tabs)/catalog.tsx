import { useContext, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { ShopifyContext } from "../ShopifyContext";
import {
  CollectionCard,
  CollectionCardProps,
} from "@/components/CollectionCard";

export default function Catalog() {
  const shopifyClient = useContext(ShopifyContext);

  const [collections, setCollections] = useState<CollectionCardProps[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const ITEMS_PER_PAGE = 20;
  const pageCursor = useRef<string | null>(null);

  async function getCollections() {
    if (!shopifyClient) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await shopifyClient.request(GET_COLLECTIONS, {
        variables: {
          count: ITEMS_PER_PAGE,
          cursor: pageCursor.current,
        },
      });

      setCollections(
        res.data.collections.edges.map(({ node }: any) => {
          return { id: node.id, title: node.title, image: node.image };
        }),
      );

      const hasNextPage = res.data.collections.pageInfo.hasNextPage;
      setHasNextPage(hasNextPage);
      pageCursor.current = hasNextPage
        ? res.data.collections.pageInfo.hasNextPage
        : null;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(function () {
    getCollections();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Catalog</Text>
      <View style={styles.cardContainer}>
        {collections.map((collection) => (
          <CollectionCard
            id={collection.id}
            title={collection.title}
            image={collection.image}
            key={collection.id}
            style={styles.card}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 32,
    textAlign: "center",
  },
  cardContainer: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    rowGap: 16,
  },
  card: {
    width: "48%",
  },
});

const GET_COLLECTIONS = `
  query CollectionQuery($count: Int, $cursor: String) {
    collections(first: $count, after: $cursor) {
        edges {
          node {
            id
            title
            image {
              altText
              id
              url
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
  }
`;
