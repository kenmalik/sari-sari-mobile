import { Stack } from "expo-router";
import { ShopifyContext } from "./ShopifyContext";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { Cart, CartContext } from "./CartContext";
import { CREATE_CART } from "@/constants/StorefrontQueries";
import { useEffect, useState } from "react";

const client = createStorefrontApiClient({
  storeDomain: "http://sari-sari-test.myshopify.com",
  apiVersion: "2024-07",
  publicAccessToken: "d1811492b0be351f4ed7bbc223abd2e6",
});

export default function RootLayout() {
  const [cart, setCart] = useState<Cart>(null);
  const cartContext = { cart, setCart };

  async function createCart() {
    try {
      const res = await client.request(CREATE_CART);
      console.info(
        "createCart() (app/_layout.tsx): Created cart",
        res.data.cartCreate.cart.id,
      );
      setCart(res.data.cartCreate.cart);
    } catch (error) {
      console.error("Error Getting Cart: ", error);
    }
  }

  useEffect(() => {
    if (!cart) {
      createCart();
    }
  }, [cart]);

  return (
    <ShopifyContext.Provider value={client}>
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
    </ShopifyContext.Provider>
  );
}
