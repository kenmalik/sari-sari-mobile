import { ShopifyContext } from "@/app/ShopifyContext";
import { ProductCardProps } from "@/components/ProductCard";
import { ProductView } from "@/components/ProductView";
import {
  GET_COLLECTION_INFO,
  GET_COLLECTION_PRODUCTS,
} from "@/constants/StorefrontQueries";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export type CollectionViewProps = {
  collectionId: string | string[];
};

const PRODUCTS_PER_PAGE = 20;

export default function CollectionView({ collectionId }: CollectionViewProps) {
  const shopifyClient = useContext(ShopifyContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductCardProps[]>([]);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  let pageCursor = useRef<string | null>(null);

  async function getCollectionInfo() {
    if (!shopifyClient) {
      return;
    }

    try {
      const res = await shopifyClient.request(GET_COLLECTION_INFO, {
        variables: {
          id: collectionId,
        },
      });

      if (res.errors) {
        throw res.errors;
      }

      setTitle(res.data.collection.title);
      setDescription(res.data.collection.description);
    } catch (e) {
      console.error(e);
    }
  }

  async function getProducts() {
    if (!shopifyClient) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await shopifyClient.request(GET_COLLECTION_PRODUCTS, {
        variables: {
          id: collectionId,
          count: PRODUCTS_PER_PAGE,
          cursor: pageCursor.current,
        },
      });

      if (res.errors) {
        throw res.errors;
      }

      const page = res.data.collection.products.edges.map((edge: any) => {
        return {
          id: edge.node.id,
          title: edge.node.title,
          featuredImage: edge.node.featuredImage,
          price: edge.node.priceRange.minVariantPrice,
          compareAtPrice: edge.node.compareAtPriceRange.minVariantPrice,
        };
      });
      setProducts(products.concat(page));

      const hasNextPage = res.data.collection.products.pageInfo.hasNextPage;
      setHasNextPage(hasNextPage);
      pageCursor.current = hasNextPage
        ? res.data.collection.products.pageInfo.endCursor
        : null;

      if (res.extensions) {
        console.log(res.extensions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(function () {
    getCollectionInfo();
    getProducts();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <ProductView
        products={products}
        onLoad={() => getProducts()}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        HeaderComponent={
          <View>
            <Text
              style={[
                styles.pageTitle,
                description ? { marginBottom: 16 } : null,
              ]}
            >
              {title}
            </Text>
            {description && <Text>{description}</Text>}
          </View>
        }
        style={styles.container}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 24,
    textAlign: "center",
  },
});
