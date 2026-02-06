"use client";

import { CartContext, cartProductPrice } from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { useProfile } from "@/components/UseProfile";
import { useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

console.count("CartPage render");


function formatRSD(amount) {
  const n = Number(amount) || 0;
  return `${n.toLocaleString("sr-RS")} RSD`;
}

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const { data: profileData } = useProfile();
  const [address, setAddress] = useState({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.search.includes("canceled=1")) {
      toast.error("Plaćanje nije uspelo 😔");
    }
  }, []);

  useEffect(() => {
    if (!profileData?.city) return;
    const { phone, streetAddress, city, postalCode, country } = profileData;
    setAddress({ phone, streetAddress, city, postalCode, country });
  }, [profileData]);

  const subtotal = useMemo(() => {
    return (cartProducts || []).reduce((sum, p) => sum + cartProductPrice(p), 0);
  }, [cartProducts]);

  const deliveryFee = 500; // RSD
  const total = subtotal + deliveryFee;

  function handleAddressChange(propName, value) {
    setAddress((prev) => ({ ...prev, [propName]: value }));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();

    if (!cartProducts || cartProducts.length === 0) {
      toast.error("Korpa je prazna.");
      return;
    }

    const promise = fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, cartProducts }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Checkout failed");
      return res.json();
    });

    await toast.promise(promise, {
      loading: "Pripremamo porudžbinu...",
      success: "Preusmeravam na plaćanje...",
      error: "Nešto nije u redu... Pokušaj ponovo.",
    }).then((url) => {
      window.location.href = url;
    });
  }

  if (!isMounted) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Korpa" />
        <p className="mt-4 text-gray-500">Učitavanje korpe...</p>
      </section>
    );
  }

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Korpa" />
        <p className="mt-4">Tvoja korpa je prazna 😔</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Korpa" />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* LEFT */}
        <div>
          {cartProducts.map((product, index) => (
            <CartProduct
              key={`${product?._id || "p"}-${index}`}
              product={product}
              onRemove={() => removeCartProduct(index)}
            />
          ))}

          <div className="py-2 pr-2 md:pr-16 flex justify-end items-center">
            <div className="text-gray-500 text-right">
              Subtotal:
              <br />
              Dostava:
              <br />
              Ukupno:
            </div>
            <div className="font-semibold pl-2 text-right whitespace-nowrap">
              {formatRSD(subtotal)}
              <br />
              {formatRSD(deliveryFee)}
              <br />
              {formatRSD(total)}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Plaćanje</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
            />
            <button type="submit" className="mt-2">
              Plati {formatRSD(total)}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
