import { useContext, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { ShopifyContext } from "../ShopifyContext";
import {
  CollectionCard,
  CollectionCardProps,
} from "@/components/CollectionCard";
import { GET_COLLECTIONS } from "@/constants/StorefrontQueries";
import { StatusBar } from "expo-status-bar";

export default function Catalog() {
  const shopifyClient = useContext(ShopifyContext);

  const [collections, setCollections] = useState<CollectionCardProps[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

      const page = res.data.collections.edges.map(({ node }: any) => {
        return { id: node.id, title: node.title, image: node.image };
      });
      setCollections(collections.concat(page));

      const hasNextPage = res.data.collections.pageInfo.hasNextPage;
      setHasNextPage(hasNextPage);
      pageCursor.current = hasNextPage
        ? res.data.collections.pageInfo.hasNextPage
        : null;
      pageCursor.current = hasNextPage
        ? res.data.collections.pageInfo.endCursor
        : null;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <>
      <StatusBar style="light" />
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
        {isLoading && (
          <Text style={styles.loadingText}>Loading catalog...</Text>
        )}
        {hasNextPage && (
          <Pressable
            onPress={getCollections}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? "rgb(33, 39, 186)"
                  : "rgb(3, 9, 156)",
              },
              styles.loadMoreButton,
            ]}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Load More</Text>
          </Pressable>
        )}
      </ScrollView>
    </>
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
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
    color: "grey",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
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
});
