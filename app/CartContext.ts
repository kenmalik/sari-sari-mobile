import { createContext } from "react";

export type Cart = {
  id: string;
  checkoutUrl: string;
} | null;

export type CartContextType = {
  cart: Cart;
  setCart: (newCart: Cart) => void;
};

export const CartContext = createContext<CartContextType>({
  cart: null,
  setCart: () => {},
});
