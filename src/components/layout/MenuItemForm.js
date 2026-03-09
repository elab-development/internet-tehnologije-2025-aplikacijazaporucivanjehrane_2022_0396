"use client";

import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";
import { useEffect, useMemo, useState } from "react";

export default function MenuItemForm({ onSubmit, menuItem }) {
  const isEdit = !!menuItem?._id;

  const [image, setImage] = useState(menuItem?.image || "");
  const [name, setName] = useState(menuItem?.name || "");
  const [description, setDescription] = useState(menuItem?.description || "");
  const [basePrice, setBasePrice] = useState(
    menuItem?.basePrice?.toString?.() ?? ""
  );
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [extraIngredientPrices, setExtraIngredientPrices] = useState(
    menuItem?.extraIngredientPrices || []
  );

  const [category, setCategory] = useState(
    menuItem?.category?._id || menuItem?.category || ""
  );
  const [categories, setCategories] = useState([]);

  const categoryIds = useMemo(
    () => new Set(categories.map((c) => c._id)),
    [categories]
  );

  useEffect(() => {
    let ignore = false;

    fetch("/api/categories")
      .then((res) => res.json())
      .then((cats) => {
        if (ignore) return;
        setCategories(cats || []);

        // default za create
        if (!isEdit && (!category || category === "") && cats?.length > 0) {
          setCategory(cats[0]._id);
        }

        // fallback za edit ako category nije validan
        if (isEdit && cats?.length > 0 && category && !categoryIds.has(category)) {
          const maybeId =
            typeof menuItem?.category === "object"
              ? menuItem?.category?._id
              : menuItem?.category;

          if (maybeId && cats.some((c) => c._id === maybeId)) {
            setCategory(maybeId);
          } else {
            setCategory(cats[0]._id);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(ev) {
    ev.preventDefault();

    const trimmedName = (name || "").trim();
    const trimmedDesc = (description || "").trim();

    if (!category) {
      alert("Molimo izaberite kategoriju.");
      return;
    }

    const normalizedBasePrice =
      basePrice === "" ? 0 : Number(String(basePrice).replace(",", "."));

    if (Number.isNaN(normalizedBasePrice)) {
      alert("Osnovna cena mora biti broj.");
      return;
    }

    if (!trimmedName) {
      alert("Naziv proizvoda je obavezan.");
      return;
    }

    onSubmit(ev, {
      image,
      name: trimmedName,
      description: trimmedDesc,
      basePrice: normalizedBasePrice,
      sizes,
      extraIngredientPrices,
      category,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
      <div
        className="md:grid items-start gap-4"
        style={{ gridTemplateColumns: ".3fr .7fr" }}
      >
        <div>
          <EditableImage link={image} setLink={setImage} />
        </div>

        <div className="grow">
          <label>Naziv stavke</label>
          <input
            type="text"
            placeholder="Unesite naziv"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />

          <label>Opis</label>
          <input
            type="text"
            placeholder="Kratak opis"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />

          <label>Kategorija</label>
          <select
            value={category || ""}
            onChange={(ev) => setCategory(ev.target.value)}
            required
          >
            <option value="" disabled>
              Izaberite kategoriju
            </option>

            {categories?.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>

          <label>Osnovna cena</label>
          <input
            type="text"
            placeholder="npr. 950"
            value={basePrice}
            onChange={(ev) => setBasePrice(ev.target.value)}
          />

          <MenuItemPriceProps
            name={"Veličine"}
            addLabel={"Dodaj veličinu"}
            props={sizes}
            setProps={setSizes}
          />

          <MenuItemPriceProps
            name={"Dodatni sastojci"}
            addLabel={"Dodaj dodatak"}
            props={extraIngredientPrices}
            setProps={setExtraIngredientPrices}
          />

          <button type="submit">Sačuvaj</button>
        </div>
      </div>
    </form>
  );
}
