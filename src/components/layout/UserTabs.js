'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserTabs({ isAdmin }) {
  const path = usePathname();

  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      <Link
        className={path === '/profile' ? 'active' : ''}
        href={'/profile'}
      >
        Profil
      </Link>

      {isAdmin && (
        <>
          <Link
            href={'/categories'}
            className={path === '/categories' ? 'active' : ''}
          >
            Kategorije
          </Link>

          <Link
            href={'/menu-items'}
            className={path.includes('menu-items') ? 'active' : ''}
          >
            Stavke menija
          </Link>

          <Link
            className={path.includes('/users') ? 'active' : ''}
            href={'/users'}
          >
            Korisnici
          </Link>
        </>
      )}

      <Link
        className={path === '/orders' ? 'active' : ''}
        href={'/orders'}
      >
        Porudžbine
      </Link>
    </div>
  );
}
