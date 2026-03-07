"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useCallback, useEffect, useMemo, useState } from "react";

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatRSD(value) {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
    maximumFractionDigits: 0,
  }).format(toNumber(value));
}

function formatNumber(value) {
  return new Intl.NumberFormat("sr-RS", { maximumFractionDigits: 0 }).format(toNumber(value));
}

function normalizeStats(json) {
  const range = json?.range || {};
  const totals = json?.totals || {};
  const byCategoryRaw = Array.isArray(json?.byCategory) ? json.byCategory : [];

  const byCategory = byCategoryRaw
    .map((x) => ({
      name: String(x?.name ?? "Ostalo"),
      prodaja: toNumber(x?.prodaja),
      prihod: toNumber(x?.prihod),
    }))
    .filter((x) => x.name);

  return {
    range: {
      from: range?.from || null,
      to: range?.to || null,
    },
    totals: {
      orders: toNumber(totals?.orders),
      revenue: toNumber(totals?.revenue),
      avgOrderValue: toNumber(totals?.avgOrderValue),
    },
    byCategory,
  };
}

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = useMemo(
    () => ["#f97316", "#22c55e", "#3b82f6", "#a855f7", "#ef4444", "#14b8a6", "#f59e0b"],
    []
  );

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // no-store da uvek vidiš nove podatke
      const res = await fetch("/api/stats?days=30", { cache: "no-store" });

      // pokušaj da pročitaš i error payload ako postoji
      if (!res.ok) {
        let msg = "Ne mogu da učitam statistiku";
        try {
          const errJson = await res.json();
          if (errJson?.error) msg = String(errJson.error);
        } catch {}
        throw new Error(msg);
      }

      const json = await res.json();
      setStats(normalizeStats(json));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Greška");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (cancelled) return;
      await load();
    })();

    return () => {
      cancelled = true;
    };
  }, [load]);

  const data = stats?.byCategory ?? [];

  const headerNote = useMemo(() => {
    const fromIso = stats?.range?.from;
    const toIso = stats?.range?.to;
    if (!fromIso || !toIso) return "";

    const from = new Date(fromIso);
    const to = new Date(toIso);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return "";

    const fmt = new Intl.DateTimeFormat("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `${fmt.format(from)} do ${fmt.format(to)}`;
  }, [stats]);

  const hasData = data.length > 0;
  const ordersCount = stats?.totals?.orders ?? 0;

  return (
    <section className="mt-8 mb-16 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <SectionHeaders mainHeader="Statistika prodaje" />
        <p className="text-gray-500 mt-2">
          Analiza učinka iz baze{headerNote ? `, period: ${headerNote}` : ""}
        </p>

        <div className="mt-4 flex justify-center">
          <button
            onClick={load}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm text-sm font-semibold hover:bg-gray-50"
          >
            Osveži podatke
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center text-gray-600">
          Učitavam statistiku...
        </div>
      )}

      {!loading && error && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-red-200 text-center text-red-600">
          {error}
          <div className="mt-3 text-gray-500 text-sm">
            Proveri da li ruta <span className="font-mono">/api/stats</span> vraća JSON i da u bazi ima porudžbina u
            traženom periodu.
          </div>
        </div>
      )}

      {!loading && !error && stats && !hasData && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center text-gray-700">
          Nema podataka za izabrani period.
          <div className="mt-2 text-gray-500 text-sm">
            Ako filtriraš samo <span className="font-mono">paid: true</span>, proveri da li ima plaćenih porudžbina u
            poslednjih 30 dana.
          </div>
        </div>
      )}

      {!loading && !error && stats && hasData && (
        <>
          <div className="grid gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-bold mb-6 text-center">Broj prodatih stavki po kategorijama</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      cursor={{ fill: "#fef3c7" }}
                      formatter={(value, name) => {
                        if (name === "Broj prodatih") return [formatNumber(value), name];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar dataKey="prodaja" name="Broj prodatih" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-bold mb-6 text-center">Udeo u ukupnom prihodu po kategorijama</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="prihod"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.name}`}
                    >
                      {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatRSD(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-orange-500 text-center">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Porudžbine</p>
              <p className="text-3xl font-black text-gray-800">{formatNumber(stats.totals.orders)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500 text-center">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Prihod</p>
              <p className="text-3xl font-black text-gray-800">{formatRSD(stats.totals.revenue)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500 text-center">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Prosečna vrednost porudžbine</p>
              <p className="text-3xl font-black text-gray-800">{formatRSD(stats.totals.avgOrderValue)}</p>
            </div>
          </div>

          <div className="mt-6 text-center text-gray-500 text-sm">
            Ukupno porudžbina u periodu: {formatNumber(ordersCount)}
          </div>
        </>
      )}
    </section>
  );
}