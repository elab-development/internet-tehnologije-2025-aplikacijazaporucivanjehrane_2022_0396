"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
  let price = cartProduct.basePrice;
  if (cartProduct.size) price += cartProduct.size.price;
  if (cartProduct.extras?.length > 0) {
    for (const extra of cartProduct.extras) price += extra.price;
  }
  return price;
}

function CartProviderInner({ children }) {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || null;

  const ls = typeof window !== "undefined" ? window.localStorage : null;

  // cart key po korisniku (guest ili email)
  const storageKey = useMemo(() => {
    return userEmail ? `cart:${userEmail}` : "cart:guest";
  }, [userEmail]);

  const [cartProducts, setCartProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // učitaj cart kad se promeni korisnik (login/logout)
  useEffect(() => {
    if (!ls) return;
    const saved = ls.getItem(storageKey);
    setCartProducts(saved ? JSON.parse(saved) : []);
    setLoaded(true);
  }, [ls, storageKey]);

  function saveCartProductsToLocalStorage(products) {
    if (!ls) return;
    ls.setItem(storageKey, JSON.stringify(products));
  }

  // auto-save na svaku promenu (posle load)
  useEffect(() => {
    if (!loaded) return;
    saveCartProductsToLocalStorage(cartProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartProducts, loaded, storageKey]);

  function clearCart() {
    setCartProducts([]);
    if (ls) ls.removeItem(storageKey);
  }

  // remove po index-u
  function removeCartProduct(indexToRemove) {
    setCartProducts((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    toast.success("Proizvod je uklonjen iz korpe");
  }

  function addToCart(product, size = null, extras = []) {
    setCartProducts((prev) => {
      const cartProduct = { ...product, size, extras };
      return [...prev, cartProduct];
    });
    toast.success("Dodato u korpu");
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addToCart,
        removeCartProduct,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function AppProvider({ children }) {
  return (
    <SessionProvider>
      <CartProviderInner>{children}</CartProviderInner>
    </SessionProvider>
  );
}
