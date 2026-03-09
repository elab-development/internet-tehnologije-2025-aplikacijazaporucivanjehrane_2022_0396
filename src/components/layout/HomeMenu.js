'use client';

import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import { useEffect, useMemo, useState } from "react";

function pickRandom(items, count) {
  const arr = Array.isArray(items) ? [...items] : [];
  // Fisher–Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

export default function HomeMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/menu-items", { cache: "no-store" });
        const data = await res.json();
        if (!ignore) setMenuItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Neuspešno učitavanje menija:", e);
        if (!ignore) setMenuItems([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const randomSix = useMemo(() => pickRandom(menuItems, 6), [menuItems]);

  return (
    <section>
      <div className="text-center mb-4">
        <SectionHeaders subHeader="Pogledajte" mainHeader="Naša najtraženija jela" />
      </div>

      {loading && (
        <div className="text-center text-gray-500">Učitavanje ponude...</div>
      )}

      {!loading && randomSix.length === 0 && (
        <div className="text-center text-gray-500">Trenutno nema stavki u meniju.</div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {randomSix.map((item) => (
          <MenuItem key={item._id} {...item} />
        ))}
      </div>
    </section>
  );
}
