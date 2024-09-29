import { useCallback, useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { CartContext } from "../CartContext";
import { ShopifyContext } from "../ShopifyContext";
import { VIEW_CART } from "@/constants/StorefrontQueries";
import { useFocusEffect } from "expo-router";
import ProductListItem, {
  ProductListItemProps,
} from "@/components/ProductListItem";

export default function Cart() {
  const shopifyContext = useContext(ShopifyContext);
  const { cart, setCart } = useContext(CartContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ProductListItemProps[]>([]);
  const [subtotal, setSubtotal] = useState<{
    amount: number;
    currency: string;
  }>({ amount: 0, currency: "USD" });

  async function getCart() {
    if (!shopifyContext || !cart) {
      return;
    }

    try {
      console.info(
        "getCart() (app/(tabs)/cart.tsx): Requesting cart with ID",
        cart.id,
      );
      setIsLoading(true);
      const res = await shopifyContext.request(VIEW_CART, {
        variables: {
          cartId: cart.id,
        },
      });

      if (res.errors) {
        console.error(
          "getCart() (app/(tabs)/cart.tsx):",
          res.errors.graphQLErrors?.map((error) => error.message),
        );
        return;
      }
      setSubtotal({
        amount: res.data.cart.cost.subtotalAmount.amount,
        currency: res.data.cart.cost.subtotalAmount.currencyCode,
      });
      setItems(
        res.data.cart.lines.edges.map((edge: any) => {
          const item = edge.node.merchandise;
          return {
            id: item.product.id,
            featuredImage: item.image,
            title: item.product.title,
            price: item.price.amount,
            currency: item.price.currencyCode,
            quantity: edge.node.quantity,
          };
        }),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getCart();
    }, []),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading cart...</Text>
      ) : (
        <>
          {items.length > 0 ? (
            <>
              <Text style={styles.pageTitle}>Your Cart</Text>
              <Text style={styles.subtitle}>
                <Text style={{ fontWeight: "300" }}>Subtotal </Text>
                <Text style={{ fontWeight: "600" }}>
                  {subtotal.currency === "USD"
                    ? `\$${Number(subtotal.amount).toFixed(2)}`
                    : `${Number(subtotal.amount).toFixed(2)} ${subtotal.currency}`}
                </Text>
              </Text>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: "lightgrey",
                  marginBottom: 16,
                }}
              ></View>

              <View style={styles.itemContainer}>
                {items.map((item) => (
                  <ProductListItem
                    id={item.id}
                    key={item.id}
                    title={item.title}
                    featuredImage={item.featuredImage}
                    price={item.price}
                    currency={item.currency}
                    quantity={item.quantity}
                  />
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.cartEmptyText}>Cart empty</Text>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
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
});
