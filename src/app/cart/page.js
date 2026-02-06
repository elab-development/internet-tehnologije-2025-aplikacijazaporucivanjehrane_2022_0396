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

  // ✅ Hydration guard: čeka da se komponenta mountuje (bitno kad cart dolazi iz localStorage)
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
    if (typeof window !== "undefined") {
      if (window.location.href.includes("canceled=1")) {
        toast.error("Payment failed 😔");
      }
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

    // ✅ basic guard
    if (!cartProducts || cartProducts.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const promise = new Promise((resolve, reject) => {
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          cartProducts,
        }),
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
      loading: "Preparing your order...",
      success: "Redirecting to payment...",
      error: "Something went wrong... Please try again later",
    });
  }

  // ✅ Dok se ne mountuje, ne zaključuj da je prazno
  if (!isMounted) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4 text-gray-500">Loading cart...</p>
      </section>
    );
  }

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <section className="mt-8 text-center">
        <SectionHeaders mainHeader="Cart" />
        <p className="mt-4">Your shopping cart is empty 😔</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="text-center">
        <SectionHeaders mainHeader="Cart" />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* LEFT: products */}
        <div>
          {cartProducts.map((product, index) => (
            <CartProduct
              key={`${product?._id || "p"}-${index}`}
              product={product}
              onRemove={removeCartProduct}
            />
          ))}

          <div className="py-2 pr-2 md:pr-16 flex justify-end items-center">
            <div className="text-gray-500 text-right">
              Subtotal:
              <br />
              Delivery:
              <br />
              Total:
            </div>
            <div className="font-semibold pl-2 text-right">
              ${subtotal}
              <br />
              $5
              <br />${subtotal + 5}
            </div>
          </div>
        </div>

        {/* RIGHT: checkout */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">Checkout</h2>
          <form onSubmit={proceedToCheckout}>
            <AddressInputs
              addressProps={address}
              setAddressProp={handleAddressChange}
            />
            <button type="submit" className="mt-2">
              Pay ${subtotal + 5}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
