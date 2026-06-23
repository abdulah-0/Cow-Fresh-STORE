"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType extends CartState {
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string, variant: string) => void;
  updateQuantity: (id: string, variant: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: any): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { item, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.id === item.id && i.variant === item.variant);
      if (existing) {
        return { ...state, items: state.items.map((i) => i.id === item.id && i.variant === item.variant ? { ...i, quantity: i.quantity + quantity } : i) };
      }
      return { ...state, items: [...state.items, { ...item, quantity }] };
    }
    case "REMOVE_FROM_CART":
      return { ...state, items: state.items.filter((i) => !(i.id === action.payload.id && i.variant === action.payload.variant)) };
    case "UPDATE_QUANTITY":
      return { ...state, items: state.items.map((i) => i.id === action.payload.id && i.variant === action.payload.variant ? { ...i, quantity: action.payload.quantity } : i) };
    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 });

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => dispatch({ type: "ADD_TO_CART", payload: { item, quantity } });
  const removeFromCart = (id: string, variant: string) => dispatch({ type: "REMOVE_FROM_CART", payload: { id, variant } });
  const updateQuantity = (id: string, variant: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, variant, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return <CartContext.Provider value={{ ...state, total, itemCount, addToCart, removeFromCart, updateQuantity, clearCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}