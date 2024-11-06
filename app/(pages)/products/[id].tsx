import { CartContext } from "@/app/CartContext";
import { ShopifyContext } from "@/app/ShopifyContext";
import { Carousel } from "@/components/Carousel";
import { NumberSelector } from "@/components/NumberSelector";
import { ThemedButton } from "@/components/ThemedButton";
import {
  ADD_TO_CART,
  BUY_NOW,
  GET_PRODUCT_INFO,
  GET_VARIANTS,
} from "@/constants/StorefrontQueries";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
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
import { useShopifyCheckoutSheet } from "@shopify/checkout-sheet-kit";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";

type ImageObject = {
  id: string;
  url: string;
};

type ProductInfo = {
  title: string;
  description: string;
  featuredImage?: ImageObject;
};

type Variant = {
  id: string;
  title: string;
  price: { amount: number; currencyCode: string };
  compareAtPrice: { amount: number; currencyCode: string };
  stock: number;
  imageID?: string;
};

const DEFAULT_QUANTITY = 1;
const VARIANTS_PER_PAGE = 10;

export default function ProductPage() {
  const shopifyClient = useContext(ShopifyContext);
  const shopifyCheckout = useShopifyCheckoutSheet();
  const { cart, setCart } = useContext(CartContext);

  const { id } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [productInfo, setProductInfo] = useState<ProductInfo>();

  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const isOutOfStock =
    selectedVariant !== null ? variants[selectedVariant].stock <= 0 : true;
  const cursor = useRef<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const [images, setImages] = useState<ImageObject[]>([]);
  const [quantity, setQuantity] = useState<number>(DEFAULT_QUANTITY);

  async function handleAddToCart() {
    if (selectedVariant === null || !shopifyClient || !cart) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await shopifyClient.request(ADD_TO_CART, {
        variables: {
          cartId: cart.id,
          lines: [
            { quantity: quantity, merchandiseId: variants[selectedVariant].id },
          ],
        },
      });
      if (res.errors) {
        throw res.errors;
      }

      const newCart: any = res.data.cartLinesAdd.cart;
      setCart({
        id: newCart.id,
        checkoutUrl: newCart.checkoutUrl,
        quantity: newCart.totalQuantity,
      });
      notificationAsync(NotificationFeedbackType.Success);
    } catch (e) {
      console.error(e);
      notificationAsync(NotificationFeedbackType.Error);
    } finally {
      setQuantity(DEFAULT_QUANTITY);
      setIsLoading(false);
    }
  }

  async function handleBuyNow() {
    if (selectedVariant === null || !shopifyClient || !cart) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await shopifyClient.request(BUY_NOW, {
        variables: {
          lines: [
            { quantity: quantity, merchandiseId: variants[selectedVariant].id },
          ],
        },
      });
      if (res.errors) {
        throw res.errors;
      }

      shopifyCheckout.present(res.data.cartCreate.cart.checkoutUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setQuantity(DEFAULT_QUANTITY);
      setIsLoading(false);
    }
  }

  async function getProductInfo() {
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

      setProductInfo({
        title: product.title,
        description: product.description,
        featuredImage: product.featuredImage
          ? {
              id: product.featuredImage.id,
              url: product.featuredImage.url,
            }
          : undefined,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function getVariantPage() {
    if (!shopifyClient) {
      return;
    }

    try {
      const res = await shopifyClient.request(GET_VARIANTS, {
        variables: {
          productId: id,
          count: VARIANTS_PER_PAGE,
          cursor: cursor.current,
        },
      });
      if (res.errors) {
        throw res.errors;
      }

      const page = res.data.product.variants;
      setVariants(
        variants.concat(
          page.edges.map((variant: any) => {
            return {
              id: variant.node.id,
              title: variant.node.title,
              price: variant.node.price,
              compareAtPrice: variant.node.compareAtPrice,
              stock: variant.node.quantityAvailable,
              imageID: variant.node.image?.id,
            };
          }),
        ),
      );
      if (selectedVariant === null && page.edges.length > 0) {
        setSelectedVariant(0);
      }

      cursor.current = page.pageInfo.hasNextPage
        ? page.pageInfo.endCursor
        : null;
      setHasNextPage(page.pageInfo.hasNextPage);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getProductInfo();
    getVariantPage();
  }, []);

  if (selectedVariant === null) {
    return <View />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {productInfo && (
            <>
              <View style={[styles.imageContainer, { height: height * 0.5 }]}>
                {images.length > 0 ? (
                  <Carousel
                    height={height}
                    width={width}
                    selected={variants[selectedVariant]?.imageID}
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
                    <Text style={{ color: "lightgrey" }}>
                      No image provided.
                    </Text>
                  </>
                )}
              </View>

              <Text style={[styles.title, styles.wallSpaced]}>
                {productInfo.title}
              </Text>

              <View style={[styles.section, styles.wallSpaced]}>
                <Text>
                  {variants[selectedVariant] &&
                  variants[selectedVariant].stock > 0 ? (
                    <View>
                      <Text>
                        <Text style={styles.price}>
                          {variants[selectedVariant]?.price.currencyCode ===
                            "USD" && "$"}
                          {Number(
                            variants[selectedVariant]?.price.amount,
                          ).toFixed(2)}
                          {variants[selectedVariant]?.price.currencyCode !==
                            "USD" &&
                            ` ${variants[selectedVariant]?.price.currencyCode}`}
                        </Text>{" "}
                        {variants[selectedVariant]?.compareAtPrice?.amount >
                          variants[selectedVariant]?.price.amount && (
                          <Text style={styles.compareAtPrice}>
                            {variants[selectedVariant]?.price.currencyCode ===
                              "USD" && "$"}
                            {Number(
                              variants[selectedVariant]?.compareAtPrice.amount,
                            ).toFixed(2)}
                            {variants[selectedVariant]?.price.currencyCode !==
                              "USD" &&
                              ` ${variants[selectedVariant]?.price.currencyCode}`}
                          </Text>
                        )}
                      </Text>
                      <Text>
                        {variants[selectedVariant]?.stock} items in stock!
                      </Text>
                    </View>
                  ) : (
                    <Text style={{ color: Colors.secondaryHighlight }}>
                      Out of stock
                    </Text>
                  )}
                </Text>
              </View>

              {variants.length > 1 && (
                <View style={styles.section}>
                  <Text style={[styles.subheading, styles.wallSpaced]}>
                    <Text style={{ fontWeight: "bold" }}>Variant: </Text>
                    <Text>{variants[selectedVariant]?.title}</Text>
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
                          variants[selectedVariant]?.id === variant.id
                            ? { borderColor: "rgb(3, 9, 156)" }
                            : undefined
                        }
                        onSelect={() => {
                          setSelectedVariant(index);
                        }}
                      />
                    ))}
                    {hasNextPage && (
                      <Pressable
                        onPress={getVariantPage}
                        style={[
                          {
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 8,
                          },
                          styles.disabledVariantCard,
                        ]}
                      >
                        {({ pressed }) => (
                          <>
                            <AntDesign
                              name="pluscircleo"
                              size={24}
                              color={pressed ? "rgb(3, 9, 156)" : "black"}
                            />
                            <Text
                              style={{
                                color: pressed ? "rgb(3, 9, 156)" : "black",
                              }}
                            >
                              Load more
                            </Text>
                          </>
                        )}
                      </Pressable>
                    )}
                  </ScrollView>
                </View>
              )}

              <View style={[styles.section, styles.wallSpaced]}>
                <NumberSelector
                  max={
                    selectedVariant
                      ? variants[selectedVariant].stock
                      : undefined
                  }
                  min={1}
                  onSelect={(selected) => setQuantity(selected)}
                  value={quantity}
                  style={{ marginBottom: 24 }}
                  textContainerStyle={{ padding: 16 }}
                  disabled={isOutOfStock}
                />
                <ThemedButton
                  color="transparent"
                  pressedColor="white"
                  disabledColor="lightgrey"
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
                <ThemedButton onPress={handleBuyNow} disabled={isOutOfStock}>
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
                {productInfo.description ? (
                  <Text>{productInfo.description}</Text>
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
    </>
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
  price: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 2,
  },
  compareAtPrice: {
    fontSize: 16,
    color: Colors.secondaryHighlight,
    textDecorationLine: "line-through",
  },
});
