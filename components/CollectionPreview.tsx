import { ShopifyContext } from "@/app/ShopifyContext";
import { Colors } from "@/constants/Colors";
import {
  GET_COLLECTION_INFO,
  GET_COLLECTION_PRODUCTS,
} from "@/constants/StorefrontQueries";
import { Link } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ProductCard, ProductCardProps } from "./ProductCard";

export type CollectionPreviewProps = {
  collectionId: string;
};

export function CollectionPreview({ collectionId }: CollectionPreviewProps) {
  const shopifyClient = useContext(ShopifyContext);
  const [title, setTitle] = useState<string>("");
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  console.log(products);

  async function getCollectionInfo() {
    if (!shopifyClient) {
      return;
    }

    try {
      const titleres = await shopifyClient.request(GET_COLLECTION_INFO, {
        variables: {
          id: collectionId,
        },
      });
      if (titleres.errors) {
        throw titleres.errors;
      }

      setTitle(titleres.data.collection.title);

      const res = await shopifyClient.request(GET_COLLECTION_PRODUCTS, {
        variables: {
          id: collectionId,
          count: 4,
        },
      });

      if (res.errors) {
        throw res.errors;
      }

      const page = res.data.collection.products.edges.map((edge: any) => {
        const apiPrice = edge.node.priceRange.minVariantPrice;
        const apiCompareAtPrice = edge.node.compareAtPriceRange.minVariantPrice;

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
      });
      setProducts(page);
      console.log(page[0].featuredImage.url);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getCollectionInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{title}</Text>

      <View style={styles.itemContainer}>
        {products.map((item) => (
          <ProductCard
            id={item.id}
            key={item.id}
            title={item.title}
            featuredImage={item.featuredImage}
            price={item.price}
            compareAtPrice={item.compareAtPrice}
            style={styles.item}
          />
        ))}
      </View>

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
    flexDirection: "row",
    flexWrap: "wrap",
    aspectRatio: "1 / 1",
    justifyContent: "space-between",
    alignItems: "flex-start",
    alignContent: "space-between",
    padding: 8,
  },
  item: {
    width: "49%",
    aspectRatio: "1 / 1",
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
