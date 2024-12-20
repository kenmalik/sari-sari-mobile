import { ShopifyContext } from "@/app/ShopifyContext";
import { Colors } from "@/constants/Colors";
import { GET_COLLECTION_PREVIEW } from "@/constants/StorefrontQueries";
import { Link } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { ProductCard, ProductCardProps } from "./ProductCard";

export type CollectionPreviewProps = {
  collectionId: string;
};

type PreviewData = {
  title: string;
  products: ProductCardProps[];
};

export function CollectionPreview({ collectionId }: CollectionPreviewProps) {
  const shopifyClient = useContext(ShopifyContext);
  const [data, setData] = useState<PreviewData | null>(null);

  async function getCollectionInfo() {
    if (!shopifyClient) {
      return;
    }

    try {
      const res = await shopifyClient.request(GET_COLLECTION_PREVIEW, {
        variables: {
          id: collectionId,
          count: 4,
        },
      });
      if (res.errors) {
        throw res.errors;
      }

      const page: ProductCardProps[] = res.data.collection.products.edges.map(
        (edge: any) => {
          const apiPrice = edge.node.priceRange.minVariantPrice;
          const apiCompareAtPrice =
            edge.node.compareAtPriceRange.minVariantPrice;

          return {
            id: edge.node.id,
            title: edge.node.title,
            featuredImage: edge.node.featuredImage,
            price: {
              amount: Number(apiPrice.amount),
              currencyCode: apiPrice.currencyCode,
            },
            compareAtPrice: {
              amount: Number(apiCompareAtPrice.amount),
              currencyCode: apiCompareAtPrice.currencyCode,
            },
          };
        },
      );
      setData({ title: res.data.collection.title, products: page });
    } catch (e) {
      console.error(e);
    }
  }

  const renderItem = ({ item }: { item: ProductCardProps }) => (
    <ProductCard
      id={item.id}
      key={item.id}
      title={item.title}
      featuredImage={item.featuredImage}
      price={item.price}
      compareAtPrice={item.compareAtPrice}
      style={styles.item}
    />
  );

  useEffect(() => {
    getCollectionInfo();
  }, []);

  if (!data) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{data.title}</Text>

      <FlatList
        scrollEnabled={false}
        removeClippedSubviews
        data={data.products}
        renderItem={renderItem}
        contentContainerStyle={styles.itemContainer}
        numColumns={2}
        columnWrapperStyle={{
          gap: 8,
        }}
      />

      <Link
        href={{
          pathname: "/(pages)/collections/[id]",
          params: { id: collectionId },
        }}
        asChild
      >
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>View All</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 48,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 16,
  },
  itemContainer: {
    gap: 8,
    padding: 8,
  },
  item: {
    maxWidth: "50%",
    aspectRatio: "1 / 1.25",
    justifyContent: "center",
  },
  itemName: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: Colors.tint,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginTop: 16,
  },
  buttonText: {
    color: Colors.lightText,
  },
});
