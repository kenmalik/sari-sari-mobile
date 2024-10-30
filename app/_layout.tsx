import { Stack } from "expo-router";
import { ShopifyContext } from "./ShopifyContext";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { Cart, CartContext } from "./CartContext";
import { CREATE_CART } from "@/constants/StorefrontQueries";
import { useEffect, useState } from "react";
import { ShopifyCheckoutSheetProvider } from "@shopify/checkout-sheet-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const client = createStorefrontApiClient({
  storeDomain: "http://sari-sari-test.myshopify.com",
  apiVersion: "2024-07",
  publicAccessToken: "d1811492b0be351f4ed7bbc223abd2e6",
});

export default function RootLayout() {
  const [cart, setCart] = useState<Cart>(null);
  const cartContext = { cart, setCart: setAndStoreCart };

  async function setAndStoreCart(cart: Cart) {
    try {
      const jsonCart = JSON.stringify(cart);
      await AsyncStorage.setItem("cart", jsonCart);
    } catch (e) {
      console.error(e);
    } finally {
      setCart(cart);
    }
  }

  async function createCart() {
    try {
      const res = await client.request(CREATE_CART);
      console.info(
        "createCart() (app/_layout.tsx): Created cart",
        res.data.cartCreate.cart.id,
      );
      const cart = res.data.cartCreate.cart;
      setCart({
        id: cart.id,
        checkoutUrl: cart.checkoutUrl,
        quantity: cart.totalQuantity,
      });
    } catch (error) {
      console.error("Error Getting Cart: ", error);
    }
  }

  useEffect(() => {
    (async () => {
      let cartRetrieved = false;
      try {
        const jsonCart = await AsyncStorage.getItem("cart");
        const cart = jsonCart != null ? JSON.parse(jsonCart) : null;
        if (cart !== null) {
          setCart(cart);
          cartRetrieved = true;
          console.info(`Cart retrieved with id ${cart.id}`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cartRetrieved) {
          createCart();
        }
      }
    })();
  }, []);

  return (
    <ShopifyContext.Provider value={client}>
      <ShopifyCheckoutSheetProvider>
        <CartContext.Provider value={cartContext}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(pages)/products/[id]"
              options={{ headerTitle: "", headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="(pages)/collections/[id]"
              options={{ title: "", headerBackTitleVisible: false }}
            />
            <Stack.Screen
              name="(pages)/search/[searchTerm]"
              options={{ title: "", headerBackTitleVisible: false }}
            />
          </Stack>
        </CartContext.Provider>
      </ShopifyCheckoutSheetProvider>
    </ShopifyContext.Provider>
  );
}
