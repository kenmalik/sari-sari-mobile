import { CartContext } from "@/app/CartContext";
import { ShopifyContext } from "@/app/ShopifyContext";
import { Carousel } from "@/components/Carousel";
import { NumberSelector } from "@/components/NumberSelector";
import { ThemedButton } from "@/components/ThemedButton";
import { ADD_TO_CART, GET_PRODUCT_INFO } from "@/constants/StorefrontQueries";
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
import { notificationAsync, NotificationFeedbackType } from "expo-haptics";

type ImageObject = {
  id: string;
  url: string;
};

type Product = {
  title: string;
  description: string;
  featuredImage?: ImageObject;
  available: boolean;
  stock: number;
};

type Variant = {
  id: string;
  title: string;
  price: { amount: number; currencyCode: string };
  stock: number;
  imageID?: string;
};

const DEFAULT_QUANTITY = 1;

export default function ProductPage() {
  const shopifyClient = useContext(ShopifyContext);
  const { id } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [product, setProduct] = useState<Product>();
  const isOutOfStock = product ? product.stock <= 0 : true;
  const [images, setImages] = useState<ImageObject[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant>();

  const { cart, setCart } = useContext(CartContext);

  const [quantity, setQuantity] = useState<number>(DEFAULT_QUANTITY);

  async function handleAddToCart() {
    if (!selectedVariant || !shopifyClient || !cart) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await shopifyClient.request(ADD_TO_CART, {
        variables: {
          cartId: cart.id,
          lines: [{ quantity: quantity, merchandiseId: selectedVariant.id }],
        },
      });
      if (res.errors) {
        throw res.errors;
      }

      setCart(res.data.cartLinesAdd.cart);
      notificationAsync(NotificationFeedbackType.Success);
    } catch (e) {
      console.error(e);
      notificationAsync(NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
      setQuantity(DEFAULT_QUANTITY);
    }
  }

  async function getVariants() {
    if (!shopifyClient) {
      return;
    }

    try {
      const res = await shopifyClient.request(GET_PRODUCT_INFO, {
        variables: {
          id: id,
        },
      });
      if (res.errors) {
        throw res.errors;
      }

      const product = res.data.product;
      const images = product.images.edges.map((edge: any) => {
        return { url: edge.node.url, id: edge.node.id };
      });
      setImages(images);

      setProduct({
        title: product.title,
        description: product.description,
        featuredImage: product.featuredImage
          ? {
              id: product.featuredImage.id,
              url: product.featuredImage.url,
            }
          : undefined,
        available: product.availableForSale,
        stock: product.totalInventory,
      });

      setVariants(
        product.variants.edges.map((variant: any, index: number) => {
          return {
            id: variant.node.id,
            title: variant.node.title,
            price: variant.node.price,
            stock: variant.node.quantityAvailable,
            imageID:
              index > 0 && variant.node.image.id === product.featuredImage?.id
                ? undefined
                : variant.node.image?.id,
          };
        }),
      );
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getVariants();
  }, [id, shopifyClient]);

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
                <Carousel
                  height={height}
                  width={width}
                  selected={selectedVariant?.imageID}
                >
                  {images.map((image) => (
                    <Image
                      id={image.id}
                      key={image.id}
                      style={[styles.image]}
                      source={{ uri: image.url }}
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
                {(selectedVariant?.stock ?? product.stock) > 0 ? (
                  <Text>
                    {selectedVariant?.stock ?? product.stock} items in stock!
                  </Text>
                ) : (
                  <Text style={{ color: "red" }}>Out of stock</Text>
                )}
              </Text>
            </View>

            {variants.length > 1 && (
              <View style={styles.section}>
                <Text style={[styles.subheading, styles.wallSpaced]}>
                  <Text style={{ fontWeight: "bold" }}>Variant: </Text>
                  <Text>{selectedVariant?.title}</Text>
                </Text>
                <ScrollView
                  contentContainerStyle={styles.variantCardContainer}
                  horizontal
                >
                  {variants.map((variant) => (
                    <VariantCard
                      key={variant.id}
                      variant={variant}
                      style={
                        selectedVariant?.id === variant.id
                          ? { borderColor: "rgb(3, 9, 156)" }
                          : undefined
                      }
                      onSelect={() => {
                        setSelectedVariant(variant);
                      }}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={[styles.section, styles.wallSpaced]}>
              <NumberSelector
                max={product.stock}
                min={1}
                onSelect={(selected) => setQuantity(selected)}
                value={quantity}
                style={{ marginBottom: 24 }}
                textContainerStyle={{ padding: 16 }}
                disabled={isOutOfStock}
              />
              <ThemedButton
                lightColor="transparent"
                lightPressedColor="white"
                lightDisabledColor="lightgrey"
                darkColor="transparent"
                darkPressedColor="white"
                darkDisabledColor="lightgrey"
                style={{
                  borderColor: isOutOfStock ? "grey" : "black",
                  borderWidth: 1,
                  marginBottom: 8,
                }}
                onPress={handleAddToCart}
                disabled={isOutOfStock}
              >
                <Text
                  style={{
                    color: isOutOfStock ? "grey" : "black",
                    textAlign: "center",
                    padding: 16,
                  }}
                >
                  Add to Cart
                </Text>
              </ThemedButton>
              <ThemedButton disabled={isOutOfStock}>
                <Text
                  style={{
                    textAlign: "center",
                    padding: 16,
                    color: isOutOfStock ? "gainsboro" : "white",
                  }}
                >
                  Buy Now
                </Text>
              </ThemedButton>
            </View>

            <View style={[styles.section, styles.wallSpaced]}>
              <Text style={[styles.subheading, { fontWeight: "bold" }]}>
                Description:{" "}
              </Text>
              {product.description ? (
                <Text>{product.description}</Text>
              ) : (
                <Text>This item has no description.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "lightgrey",
          opacity: 0.4,
          display: isLoading ? "flex" : "none",
        }}
      ></View>
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
