import { useCallback, useContext, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { CartContext } from "../CartContext";
import { ShopifyContext } from "../ShopifyContext";
import {
  GET_SUBTOTAL,
  REMOVE_FROM_CART,
  UPDATE_ITEM_IN_CART,
  VIEW_CART,
} from "@/constants/StorefrontQueries";
import { useFocusEffect } from "expo-router";
import ProductListItem, {
  ProductListItemProps,
} from "@/components/ProductListItem";
import { ThemedButton } from "@/components/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useShopifyCheckoutSheet } from "@shopify/checkout-sheet-kit";

const ITEMS_PER_PAGE = 20;

export default function Cart() {
  const shopifyClient = useContext(ShopifyContext);
  const shopifyCheckout = useShopifyCheckoutSheet();
  const { cart, setCart } = useContext(CartContext);
  const checkoutColor = useThemeColor({}, "tertiary");
  const checkoutColorPressed = useThemeColor({}, "tertiaryHighlight");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ProductListItemProps[]>([]);
  const [subtotal, setSubtotal] = useState<{
    amount: number;
    currency: string;
  }>({ amount: 0, currency: "USD" });

  async function getCart() {
    if (!shopifyClient || !cart) {
      return;
    }

    try {
      console.info(
        "getCart() (app/(tabs)/cart.tsx): Requesting cart with ID",
        cart.id,
      );
      setIsLoading(true);
      const meta = await shopifyClient.request(GET_SUBTOTAL, {
        variables: {
          cartId: cart.id,
        },
      });
      if (meta.errors) {
        throw meta.errors;
      }
      const cartData = meta.data.cart;
      setSubtotal({
        amount: cartData.cost.subtotalAmount.amount,
        currency: cartData.cost.subtotalAmount.currencyCode,
      });
      setCart({
        id: cartData.id,
        checkoutUrl: cartData.checkoutUrl,
        quantity: cartData.totalQuantity,
      });

      setItems(await getCartItems());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function getCartItems() {
    if (!shopifyClient || !cart) {
      return [];
    }

    let cursor: string | null = null;
    let hasNextPage = true;
    let items: ProductListItemProps[] = [];
    while (hasNextPage) {
      const res: any = await shopifyClient.request(VIEW_CART, {
        variables: {
          cartId: cart.id,
          count: ITEMS_PER_PAGE,
          cursor: cursor,
        },
      });
      if (res.errors) {
        throw res.errors;
      }
      const page = res.data.cart.lines.edges.map((edge: any) => {
        const item = edge.node.merchandise;
        return {
          lineId: edge.node.id,
          variantId: item.id,
          productId: item.product.id,
          featuredImage: item.image,
          variantTitle: item.title,
          productTitle: item.product.title,
          price: item.price.amount,
          currency: item.price.currencyCode,
          quantity: edge.node.quantity,
          quantityAvailable: item.quantityAvailable,
        };
      });

      items.push(...page);
      hasNextPage = res.data.cart.lines.pageInfo.hasNextPage;
      cursor = hasNextPage ? res.data.cart.lines.pageInfo.endCursor : null;
    }
    return items;
  }

  async function handleUpdateQuantity(itemId: string, newQuantity: number) {
    if (!shopifyClient || !cart) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await shopifyClient.request(UPDATE_ITEM_IN_CART, {
        variables: {
          cartId: cart.id,
          lines: [{ id: itemId, quantity: newQuantity }],
        },
      });

      if (res.errors) {
        throw res.errors;
      }
    } catch (e) {
      console.error(e);
    } finally {
      getCart();
      setIsLoading(false);
    }
  }

  async function handleRemoveFromCart(lineId: string) {
    if (!shopifyClient || !cart) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await shopifyClient.request(REMOVE_FROM_CART, {
        variables: {
          cartId: cart.id,
          lineIds: [lineId],
        },
      });

      if (res.errors) {
        throw res.errors;
      }
    } catch (e) {
      console.error(e);
    } finally {
      getCart();
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getCart();
    }, []),
  );

  return (
    <>
      <FlatList
        data={items}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <ProductListItem
            key={item.lineId}
            lineId={item.lineId}
            variantId={item.variantId}
            variantTitle={item.variantTitle}
            productId={item.productId}
            productTitle={item.productTitle}
            featuredImage={item.featuredImage}
            price={item.price}
            currency={item.currency}
            quantity={item.quantity}
            quantityAvailable={item.quantityAvailable}
            onDelete={() => {
              handleRemoveFromCart(item.lineId);
            }}
            onQuantityChange={(newQuantity) => {
              handleUpdateQuantity(item.lineId, newQuantity);
            }}
          />
        )}
        ListHeaderComponent={
          items.length > 0 ? (
            <View style={styles.header}>
              <Text style={styles.pageTitle}>Your Cart</Text>

              <Text style={styles.subtitle}>
                <Text style={{ fontWeight: "300" }}>Subtotal </Text>
                <Text style={{ fontWeight: "600" }}>
                  {subtotal.currency === "USD"
                    ? `\$${Number(subtotal.amount).toFixed(2)}`
                    : `${Number(subtotal.amount).toFixed(2)} ${subtotal.currency}`}
                </Text>
              </Text>

              <ThemedButton
                lightColor={checkoutColor}
                lightPressedColor={checkoutColorPressed}
                darkColor={checkoutColor}
                darkPressedColor={checkoutColorPressed}
                style={{ padding: 12 }}
                onPress={() => {
                  if (!cart) {
                    console.error("Checkout Error: No cart");
                    return;
                  }
                  console.log(cart.checkoutUrl);
                  shopifyCheckout.present(cart.checkoutUrl);
                }}
              >
                <Text style={{ color: "#302f2f", textAlign: "center" }}>
                  Proceed to Checkout
                </Text>
              </ThemedButton>
            </View>
          ) : (
            <Text style={styles.cartEmptyText}>Cart empty</Text>
          )
        }
      />
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  itemContainer: {
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
    color: "grey",
  },
  cartEmptyText: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 32,
  },
  header: {
    borderBottomWidth: 1,
    borderColor: "lightgrey",
    marginBottom: 8,
    paddingBottom: 16,
  },
});
