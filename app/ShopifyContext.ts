import { StorefrontApiClient } from "@shopify/storefront-api-client";
import { createContext } from "react";

type ShopifyContextType = StorefrontApiClient | null;

export const ShopifyContext = createContext<ShopifyContextType>(null);
