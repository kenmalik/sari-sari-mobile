import { ShopifyContext } from "@/app/ShopifyContext";
import { Carousel } from "@/components/Carousel";
import { NumberSelector } from "@/components/NumberSelector";
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
  KeyboardAvoidingView,
  Platform,
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
  const { width, height } = useWindowDimensions();
  const [product, setProduct] = useState<Product>();
  const [images, setImages] = useState<{ id: string; uri: string }[]>([]);
  const [index, setIndex] = useState<number>();

  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant>();

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
        const image = data.product.images.edges.map((edge: any) => {
          return { uri: edge.node.url, id: edge.node.id };
        });
        setImages(image);
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

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    }
  }, [variants]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {product && (
          <>
            <View style={[styles.imageContainer, { height: height * 0.5 }]}>
              {images.length > 0 ? (
                <Carousel height={height} width={width} selected={index}>
                  {images.map((image) => (
                    <Image
                      style={[styles.image]}
                      source={{ uri: image.uri }}
                      key={image.id}
                    />
                  ))}
                </Carousel>
              ) : (
                <>
                  <AntDesign name="picture" size={64} color="lightgrey" />
                  <Text style={{ color: "lightgrey" }}>No image provided.</Text>
                </>
              )}
            </View>

            <Text style={[styles.title, styles.wallSpaced]}>
              {product.title}
            </Text>

            <View style={[styles.section, styles.wallSpaced]}>
              <Text>
                {product.stock > 0 ? (
                  <Text>{product.stock} items in stock!</Text>
                ) : (
                  <Text>Out of stock</Text>
                )}
              </Text>
            </View>

            {variants.length > 1 && (
              <View style={styles.section}>
                <Text style={[styles.subheading, styles.wallSpaced]}>
                  Variant:{" "}
                  <Text style={{ fontWeight: "regular" }}>
                    {selectedVariant?.title}
                  </Text>
                </Text>
                <ScrollView
                  contentContainerStyle={styles.variantCardContainer}
                  horizontal
                >
                  {variants.map((variant, index) => (
                    <VariantCard
                      key={variant.id}
                      variant={variant}
                      style={
                        selectedVariant && selectedVariant.id === variant.id
                          ? { borderColor: "rgb(3, 9, 156)" }
                          : undefined
                      }
                      onSelect={() => {
                        setSelectedVariant(variant);
                        setIndex(index);
                      }}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={[styles.section, styles.wallSpaced]}>
              <NumberSelector max={product.stock} min={1} />
              <Pressable
                style={{
                  borderRadius: 64,
                  overflow: "hidden",
                  borderColor: "black",
                  borderWidth: 1,
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    padding: 16,
                  }}
                >
                  Add to Cart
                </Text>
              </Pressable>
              <Pressable style={{ borderRadius: 64, overflow: "hidden" }}>
                <Text
                  style={{
                    textAlign: "center",
                    padding: 16,
                    backgroundColor: "rgb(3, 9, 156)",
                    color: "white",
                  }}
                >
                  Buy Now
                </Text>
              </Pressable>
            </View>

            <View style={[styles.section, styles.wallSpaced]}>
              <Text style={styles.subheading}>Description: </Text>
              {product.description ? (
                <Text>{product.description}</Text>
              ) : (
                <Text>This item has no description.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function VariantCard({
  variant,
  style,
  onSelect,
}: {
  variant: Variant;
  style: any;
  onSelect: () => void;
}) {
  const disabled = variant.stock <= 0;
  return (
    <Pressable
      style={[
        styles.variantCard,
        disabled ? styles.disabledVariantCard : styles.enabledVariantCard,
        style,
      ]}
      onPress={onSelect}
      disabled={disabled}
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
      images(first: 5) {
        edges {
          node {
            id
            url
          }
        }
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  imageContainer: {
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
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
    paddingHorizontal: 16,
  },
  variantCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 128,
    maxWidth: 200,
    display: "flex",
    justifyContent: "space-between",
  },
  enabledVariantCard: {
    borderColor: "black",
    backgroundColor: "white",
  },
  disabledVariantCard: {
    borderColor: "grey",
    borderStyle: "dashed",
  },
  section: {
    marginBottom: 32,
  },
  wallSpaced: {
    marginHorizontal: 16,
  },
});
