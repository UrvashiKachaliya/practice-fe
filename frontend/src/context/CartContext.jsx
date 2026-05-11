import React, { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart } from "../helpers/apiRequest";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart().then((r) => r.data),
    enabled: !!user,
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const invalidateCart = () => qc.invalidateQueries({ queryKey: ["cart"] });

  return (
    <CartContext.Provider value={{ cartCount, invalidateCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
