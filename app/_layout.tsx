import { Stack } from "expo-router";
import { ShopifyContext } from "./ShopifyContext";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const client = createStorefrontApiClient({
  storeDomain: "http://sari-sari-test.myshopify.com",
  apiVersion: "2024-07",
  publicAccessToken: "d1811492b0be351f4ed7bbc223abd2e6",
});

export default function RootLayout() {
  return (
    <ShopifyContext.Provider value={client}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ShopifyContext.Provider>
  );
}
