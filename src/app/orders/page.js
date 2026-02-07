'use client';

import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import { dbTimeForHuman } from "@/libs/datetime";
import { cartProductPrice } from "@/components/AppContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const { loading, data: profile } = useProfile();

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch('/api/orders')
      .then(res => res.json())
      .then(orders => {
        setOrders((orders || []).slice().reverse());
        setLoadingOrders(false);
      })
      .catch(err => {
        console.error('Neuspešno učitavanje porudžbina:', err);
        setLoadingOrders(false);
      });
  }

  const isAdmin = !!profile?.admin;

  function getOrderTotal(order) {
    let sum = 0;
    for (const p of order.cartProducts || []) {
      sum += cartProductPrice(p);
    }
    return sum;
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={isAdmin} />

      <div className="mt-8">
        {(loading || loadingOrders) && (
          <div>Učitavanje porudžbina...</div>
        )}

        {!loadingOrders && orders?.length === 0 && (
          <div className="text-gray-500">Još uvek nema porudžbina.</div>
        )}

        {orders?.length > 0 && orders.map(order => (
          <div
            key={order._id}
            className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6"
          >
            <div className="grow flex flex-col md:flex-row items-center gap-6">
              <div>
                <div
                  className={
                    (order.paid ? 'bg-green-500' : 'bg-red-400') +
                    ' p-2 rounded-md text-white w-28 text-center'
                  }
                >
                  {order.paid ? 'Plaćeno' : 'Nije plaćeno'}
                </div>
              </div>

              <div className="grow">
                <div className="flex gap-2 items-center mb-1">
                  <div className="grow">{order.userEmail}</div>
                  <div className="text-gray-500 text-sm">
                    {dbTimeForHuman(order.createdAt)}
                  </div>
                </div>

                <div className="text-gray-500 text-xs mb-1">
                  {(order.cartProducts || []).map(p => p.name).join(', ')}
                </div>

                <div className="text-sm font-semibold">
                  Ukupno: {getOrderTotal(order)} din
                </div>
              </div>
            </div>

            <div className="justify-end flex gap-2 items-center whitespace-nowrap">
              <Link href={`/orders/${order._id}`} className="button">
                Prikaži porudžbinu
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
