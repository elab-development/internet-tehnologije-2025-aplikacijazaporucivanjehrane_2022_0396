import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongoose";
import { Order } from "@/models/Order";
import { MenuItem } from "@/models/MenuItem";
import { Category } from "@/models/Category";

function safeNumber(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const days = safeNumber(searchParams.get("days") ?? 30);
    const safeDays = days > 0 && days <= 365 ? days : 30;

    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - safeDays);

    // uzimamo samo plaćene porudžbine, ako želiš i neplaćene, skloni paid:true
    const orders = await Order.find({
      paid: true,
      createdAt: { $gte: from, $lte: to },
    }).lean();

    // skupi sve unique MenuItem id-jeve iz cartProducts
    const menuItemIds = new Set();
    for (const o of orders) {
      const cps = Array.isArray(o.cartProducts) ? o.cartProducts : [];
      for (const cp of cps) {
        if (cp?._id) menuItemIds.add(String(cp._id));
      }
    }

    const ids = Array.from(menuItemIds);
    const menuItems = await MenuItem.find({ _id: { $in: ids } }).lean();

    // map: menuItemId -> menuItem
    const menuItemMap = new Map(menuItems.map((m) => [String(m._id), m]));

    // map: categoryId -> categoryName
    const categoryIds = Array.from(
      new Set(menuItems.map((m) => (m.category ? String(m.category) : null)).filter(Boolean))
    );
    const categories = await Category.find({ _id: { $in: categoryIds } }).lean();
    const categoryMap = new Map(categories.map((c) => [String(c._id), c.name || "Ostalo"]));

    // grupisanje po kategoriji
    const byCategoryMap = new Map(); // name -> { name, prodaja, prihod }
    let revenueTotal = 0;

    for (const o of orders) {
      const cps = Array.isArray(o.cartProducts) ? o.cartProducts : [];

      for (const cp of cps) {
        const menuItem = menuItemMap.get(String(cp?._id));
        if (!menuItem) continue;

        let price = safeNumber(menuItem.basePrice);

        // size: u cartProduct čuvaš ceo objekat size sa _id, kao u checkout logici
        if (cp.size?._id && Array.isArray(menuItem.sizes)) {
          const size = menuItem.sizes.find((s) => String(s._id) === String(cp.size._id));
          if (size) price += safeNumber(size.price);
        }

        // extras: niz objekata sa _id, kao u checkout logici
        if (Array.isArray(cp.extras) && cp.extras.length > 0 && Array.isArray(menuItem.extraIngredientPrices)) {
          for (const ex of cp.extras) {
            const exInfo = menuItem.extraIngredientPrices.find((e) => String(e._id) === String(ex._id));
            if (exInfo) price += safeNumber(exInfo.price);
          }
        }

        revenueTotal += price;

        const categoryName = menuItem.category ? (categoryMap.get(String(menuItem.category)) || "Ostalo") : "Ostalo";
        const existing = byCategoryMap.get(categoryName) || { name: categoryName, prodaja: 0, prihod: 0 };
        existing.prodaja += 1; // kod tebe je quantity implicitno 1 po stavci
        existing.prihod += price;
        byCategoryMap.set(categoryName, existing);
      }
    }

    const byCategory = Array.from(byCategoryMap.values()).sort((a, b) => b.prihod - a.prihod);

    const ordersCount = orders.length;
    const avgOrderValue = ordersCount > 0 ? revenueTotal / ordersCount : 0;

    return NextResponse.json({
      range: { from: from.toISOString(), to: to.toISOString() },
      totals: {
        orders: ordersCount,
        revenue: revenueTotal,
        avgOrderValue,
      },
      byCategory,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}