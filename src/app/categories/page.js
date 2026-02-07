'use client';
import DeleteButton from "@/components/DeleteButton";
import UserTabs from "@/components/layout/UserTabs";
import { useEffect, useState } from "react";
import { useProfile } from "@/components/UseProfile";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const { loading: profileLoading, data: profileData } = useProfile();
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch('/api/categories').then(res => {
      res.json().then(categories => {
        setCategories(categories);
      });
    });
  }

  async function handleCategorySubmit(ev) {
    ev.preventDefault();

    const creationPromise = new Promise(async (resolve, reject) => {
      const data = { name: categoryName };
      if (editedCategory) {
        data._id = editedCategory._id;
      }

      const response = await fetch('/api/categories', {
        method: editedCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      setCategoryName('');
      fetchCategories();
      setEditedCategory(null);

      if (response.ok) resolve();
      else reject();
    });

    await toast.promise(creationPromise, {
      loading: editedCategory
        ? 'Ažuriranje kategorije...'
        : 'Kreiranje nove kategorije...',
      success: editedCategory ? 'Kategorija je ažurirana' : 'Kategorija je kreirana',
      error: 'Greška, pokušajte ponovo...',
    });
  }

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/categories?_id=' + _id, {
        method: 'DELETE',
      });
      if (response.ok) resolve();
      else reject();
    });

    await toast.promise(promise, {
      loading: 'Brisanje...',
      success: 'Obrisano',
      error: 'Greška',
    });

    fetchCategories();
  }

  if (profileLoading) {
    return 'Učitavanje korisničkih podataka...';
  }

  if (!profileData.admin) {
    return 'Niste administrator';
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />

      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {editedCategory ? 'Ažuriraj kategoriju' : 'Naziv nove kategorije'}
              {editedCategory && (
                <>: <b>{editedCategory.name}</b></>
              )}
            </label>

            <input
              type="text"
              value={categoryName}
              onChange={ev => setCategoryName(ev.target.value)}
              placeholder="Unesite naziv kategorije"
            />
          </div>

          <div className="pb-2 flex gap-2">
            <button className="border border-primary" type="submit">
              {editedCategory ? 'Sačuvaj' : 'Kreiraj'}
            </button>

            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setCategoryName('');
              }}
            >
              Otkaži
            </button>
          </div>
        </div>
      </form>

      <div>
        <h2 className="mt-8 text-sm text-gray-500">Postojeće kategorije</h2>

        {categories?.length > 0 && categories.map(c => (
          <div
            key={c._id}
            className="bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-1 items-center"
          >
            <div className="grow">{c.name}</div>

            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  setEditedCategory(c);
                  setCategoryName(c.name);
                }}
              >
                Izmeni
              </button>

              <DeleteButton
                label="Obriši"
                onDelete={() => handleDeleteClick(c._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
