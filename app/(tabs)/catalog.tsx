import { useContext, useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, Pressable, FlatList } from "react-native";
import { ShopifyContext } from "../ShopifyContext";
import {
  CollectionCard,
  CollectionCardProps,
} from "@/components/CollectionCard";
import { GET_COLLECTIONS } from "@/constants/StorefrontQueries";
import { StatusBar } from "expo-status-bar";

const ITEMS_PER_PAGE = 2;

export default function Catalog() {
  const shopifyClient = useContext(ShopifyContext);

  const [collections, setCollections] = useState<CollectionCardProps[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      if (page.length % 2 !== 0) {
        page.push(null);
      }
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
      <FlatList
        data={collections}
        renderItem={({ item }) =>
          item ? (
            <CollectionCard
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image}
              style={styles.card}
            />
          ) : (
            <View style={styles.card} />
          )
        }
        ListHeaderComponent={<Text style={styles.pageTitle}>Catalog</Text>}
        ListFooterComponent={
          <ListFooter
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            onLoadMore={() => getCollections()}
          />
        }
        contentContainerStyle={styles.container}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
      ></FlatList>
    </>
  );
}

type ListFooterProps = {
  isLoading: boolean;
  hasNextPage: boolean;
  onLoadMore: VoidFunction;
};

function ListFooter({ isLoading, hasNextPage, onLoadMore }: ListFooterProps) {
  if (hasNextPage) {
    return (
      <Pressable
        onPress={onLoadMore}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(33, 39, 186)" : "rgb(3, 9, 156)",
          },
          styles.loadMoreButton,
        ]}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Loading..." : "Load More"}
        </Text>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 32,
    textAlign: "center",
  },
  card: {
    flex: 1,
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
