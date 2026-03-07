"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

export function useProfile() {
  const { status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Ako je već fetch-ovano, izađi
    if (hasFetched.current) return;

    // Čekaj da se session učita
    if (status === "loading") return;
    
    // Ako korisnik nije ulogovan
    if (status === "unauthenticated") {
      setLoading(false);
      hasFetched.current = true;
      return;
    }

    // Fetchuj samo ako je korisnik ulogovan
    if (status === "authenticated") {
      hasFetched.current = true;
      setLoading(true);
      
      fetch("/api/profile")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then((profileData) => {
          setData(profileData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Profile fetch error:", err);
          setLoading(false);
        });
    }
  }, [status]);

  return { data, loading };
}