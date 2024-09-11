import { ShopifyContext } from "@/app/ShopifyContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

type Product = {
  title: string;
  description: string;
  imageURL: string;
  available: boolean;
  stock: number;
} | null;

export default function ProductPage() {
  const shopifyClient = useContext(ShopifyContext);
  const { id } = useLocalSearchParams();
  const { height } = useWindowDimensions();
  const [product, setProduct] = useState<Product>(null);

  useEffect(() => {
    if (!shopifyClient) {
      return;
    }

    shopifyClient
      .request(productQuery, {
        variables: {
          id: id,
        },
      })
      .then(({ data, errors, extensions }) => {
        setProduct({
          title: data.product.title,
          description: data.product.description,
          imageURL: data.product.featuredImage?.url ?? null,
          available: data.product.availableForSale,
          stock: data.product.totalInventory,
        });

        if (errors || extensions) {
          console.log(errors);
          console.log(extensions);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <ScrollView style={styles.container}>
      {product && (
        <>
          <Text style={styles.title}>{product.title}</Text>
          <View style={[styles.imageContainer, { height: height * 0.5 }]}>
            {product.imageURL ? (
              <Image style={styles.image} source={{ uri: product.imageURL }} />
            ) : (
              <>
                <AntDesign name="picture" size={64} color="lightgrey" />
                <Text style={{ color: "lightgrey" }}>No image provided.</Text>
              </>
            )}
          </View>
          <Text style={styles.paragraph}>
            {product.stock > 0 ? (
              <Text>{product.stock} items in stock.</Text>
            ) : (
              <Text>Item currently out of stock.</Text>
            )}
          </Text>
          <Text style={styles.subheading}>Description: </Text>
          {product.description ? (
            <Text>{product.description}</Text>
          ) : (
            <Text>This item has no description.</Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const productQuery = `
  query ProductQuery($id: ID!) {
    product(id: $id) {
      title
      availableForSale
      description
      featuredImage {
        url
      }
      totalInventory
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 48,
  },
  imageContainer: {
    marginBottom: 64,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 8,
  },
});
