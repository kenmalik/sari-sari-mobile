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
  Pressable,
} from "react-native";

type Product = {
  title: string;
  description: string;
  imageURL: string;
  available: boolean;
  stock: number;
};

type Variant = {
  id: string;
  title: string;
  price: { amount: number; currencyCode: string };
  stock: number;
};

export default function ProductPage() {
  const shopifyClient = useContext(ShopifyContext);
  const { id } = useLocalSearchParams();
  const { height } = useWindowDimensions();
  const [product, setProduct] = useState<Product>();
  const [variants, setVariants] = useState<Variant[]>([]);

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
        console.log(data.product);
        setProduct({
          title: data.product.title,
          description: data.product.description,
          imageURL: data.product.featuredImage?.url ?? null,
          available: data.product.availableForSale,
          stock: data.product.totalInventory,
        });
        setVariants(
          data.product.variants.edges.map((variant: any) => {
            return {
              id: variant.node.id,
              title: variant.node.title,
              price: variant.node.price,
              stock: variant.node.quantityAvailable,
            };
          }),
        );

        if (errors || extensions) {
          console.log(errors);
          console.log(extensions);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
              <Text>{product.stock} items in stock!</Text>
            ) : (
              <Text>Out of stock</Text>
            )}
          </Text>

          <Text style={styles.subheading}>Variant</Text>
          <ScrollView
            contentContainerStyle={styles.variantCardContainer}
            horizontal
          >
            {variants.map((variant) => (
              <VariantCard key={variant.id} variant={variant} />
            ))}
          </ScrollView>

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

function VariantCard({ variant }: { variant: Variant }) {
  return (
    <Pressable
      style={styles.variantCard}
      onPress={() => console.log("Selected variant", variant.id)}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginBottom: 8,
        }}
        numberOfLines={2}
      >
        {variant.title}
      </Text>
      <View>
        <Text style={{ fontSize: 16, marginBottom: 4 }}>
          {variant.price.currencyCode === "USD"
            ? `$${variant.price.amount}`
            : `${variant.price.amount} ${variant.price.currencyCode}`}
        </Text>
        <Text
          style={[
            variant.stock > 0 ? { color: "green" } : { color: "red" },
            { fontSize: 12 },
          ]}
        >
          {variant.stock > 0 ? "In stock" : "Out of stock"}
        </Text>
      </View>
    </Pressable>
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
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            quantityAvailable
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      totalInventory
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 64,
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
  variantCardContainer: {
    display: "flex",
    gap: 16,
  },
  variantCard: {
    padding: 16,
    borderColor: "black",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 128,
    maxWidth: 200,
    display: "flex",
    justifyContent: "space-between",
  },
});
