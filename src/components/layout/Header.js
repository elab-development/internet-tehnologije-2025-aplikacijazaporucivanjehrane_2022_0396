"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useContext, useMemo, useState } from "react";
import { CartContext } from "@/components/AppContext";

import Bars2 from "@/components/icons/Bars2";
import ShoppingCart from "@/components/icons/ShoppingCart";

function AuthLinks({ status, userName, onLinkClick }) {
  if (status === "authenticated") {
    return (
      <>
        <Link
          href="/profile"
          className="whitespace-nowrap"
          onClick={onLinkClick}
        >
          Zdravo, {userName}
        </Link>
        <button
          type="button"
          onClick={() => signOut()}
          className="bg-primary rounded-full text-white px-6 py-2 whitespace-nowrap"
        >
          Odjavi se
        </button>
      </>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <Link href="/login" onClick={onLinkClick}>
          Prijava
        </Link>
        <Link
          href="/register"
          onClick={onLinkClick}
          className="bg-primary rounded-full text-white px-6 py-2 whitespace-nowrap"
        >
          Registracija
        </Link>
      </>
    );
  }

  return null; // loading
}

function CartLink({ count, onClick }) {
  return (
    <Link href="/cart" className="relative" onClick={onClick}>
      <ShoppingCart />
      {count > 0 && (
        <span className="absolute -top-2 -right-3 bg-primary text-white text-xs min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Header() {
  const session = useSession();
  const status = session?.status;

  const userData = session.data?.user;
  let userName = userData?.name || userData?.email || "";
  if (userName && userName.includes(" ")) userName = userName.split(" ")[0];

  const { cartProducts } = useContext(CartContext);
  const cartCount = useMemo(() => cartProducts?.length || 0, [cartProducts]);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <header className="w-full">
      {/* MOBILE TOP BAR */}
      <div className="flex items-center md:hidden justify-between">
        <Link className="text-primary font-semibold text-2xl" href="/">
          SRB Kuhinja
        </Link>

        <div className="flex gap-6 items-center">
          <CartLink count={cartCount} onClick={closeMobileNav} />
          <button
            type="button"
            className="p-2 border rounded-lg"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            aria-label="Otvori/zatvori navigaciju"
          >
            <Bars2 />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileNavOpen && (
        <div className="md:hidden p-4 bg-gray-200 rounded-lg mt-2 flex flex-col gap-3 text-center text-gray-700 font-semibold">
          <Link href="/" onClick={closeMobileNav}>
            Početna
          </Link>
          <Link href="/menu" onClick={closeMobileNav}>
            Meni
          </Link>
          <Link href="/about" onClick={closeMobileNav}>
            O nama
          </Link>
          <Link href="/contact" onClick={closeMobileNav}>
            Kontakt
          </Link>

          <div className="pt-2 border-t border-gray-300 flex flex-col gap-3">
            <AuthLinks
              status={status}
              userName={userName}
              onLinkClick={closeMobileNav}
            />
          </div>
        </div>
      )}

      {/* DESKTOP NAV */}
      <div className="hidden md:flex items-center justify-between">
        <nav className="flex items-center gap-8 text-gray-500 font-semibold">
          <Link className="text-primary font-semibold text-2xl" href="/">
            SRB Kuhinja
          </Link>
          <Link href="/">Početna</Link>
          <Link href="/menu">Meni</Link>
          <Link href="/about">O nama</Link>
          <Link href="/contact">Kontakt</Link>
        </nav>

        <nav className="flex items-center gap-5 text-gray-500 font-semibold">
          <CartLink count={cartCount} />
          <AuthLinks status={status} userName={userName} />
        </nav>
      </div>
    </header>
  );
}
