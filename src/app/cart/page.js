"use client";

import { CartContext, cartProductPrice } from "@/components/AppContext";
import AddressInputs from "@/components/layout/AddressInputs";
import SectionHeaders from "@/components/layout/SectionHeaders";
import CartProduct from "@/components/menu/CartProduct";
import { useProfile } from "@/components/UseProfile";
import { useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cartProducts, removeCartProduct } = useContext(CartContext);

  // Hydration guard (bitno kad cart dolazi iz localStorage)
  const [isMounted, setIsMounted] = useState(false);

  const [address, setAddress] = useState({
    phone: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const { data: profileData } = useProfile();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.href.includes("canceled=1")) {
      toast.error("Plaćanje nije uspelo 😔");
    }
  }, []);

  useEffect(() => {
    if (profileData?.city) {
      const { phone, streetAddress, city, postalCode, country } = profileData;
      setAddress({
        phone: phone || "",
        streetAddress: streetAddress || "",
        city: city || "",
        postalCode: postalCode || "",
        country: country || "",
      });
    }
  }, [profileData]);

  const subtotal = useMemo(() => {
    let sum = 0;
    for (const p of cartProducts || []) sum += cartProductPrice(p);
    return sum;
  }, [cartProducts]);

  function handleAddressChange(propName, value) {
    setAddress((prev) => ({ ...prev, [propName]: value }));
  }

  async function proceedToCheckout(ev) {
    ev.preventDefault();

    if (!cartProducts || cartProducts.length === 0) {
      toast.error("Korpa je prazna.");
      return;
    }

    const promise = new Promise((resolve, reject) => {
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, cartProducts }),
      }).then(async (response) => {
        if (response.ok) {
          const url = await response.json();
          resolve();
          window.location.href = url;
        } else {
          reject();
        }
      });
    });

    await toast.promise(promise, {
      loading: "Pripremamo porudžbinu...",
      success: "Preusmeravamo na plaćanje...",
      error: "Nešto nije u redu... Pokušajte ponovo kasnije",
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
        <p className="mt-4">Vaša korpa je prazna 😔</p>
      </section>
    );
  }

  const deliveryFee = 200; // din

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Korpa" />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* LEFT: products */}
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
              Međuzbir:
              <br />
              Dostava:
              <br />
              Ukupno:
            </div>
            <div className="font-semibold pl-2 text-right">
              {subtotal} din
              <br />
              {deliveryFee} din
              <br />
              {subtotal + deliveryFee} din
            </div>
          </div>
        </div>

        {/* RIGHT: checkout */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Plaćanje</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
            />
            <button type="submit" className="mt-2">
              Plati {subtotal + deliveryFee} din
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
