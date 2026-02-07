"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [error, setError] = useState(false);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setCreatingUser(true);
    setError(false);
    setUserCreated(false);

    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      setUserCreated(true);
    } else {
      setError(true);
    }
    setCreatingUser(false);
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">
        Registracija
      </h1>

      {userCreated && (
        <div className="my-4 text-center">
          Nalog je uspešno kreiran.<br />
          Sada možete{' '}
          <Link className="underline" href={'/login'}>
            da se prijavite &raquo;
          </Link>
        </div>
      )}

      {error && (
        <div className="my-4 text-center">
          Došlo je do greške.<br />
          Molimo pokušajte ponovo kasnije.
        </div>
      )}

      <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input
          type="email"
          placeholder="Email adresa"
          value={email}
          disabled={creatingUser}
          onChange={ev => setEmail(ev.target.value)}
        />

        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          disabled={creatingUser}
          onChange={ev => setPassword(ev.target.value)}
        />

        <button type="submit" disabled={creatingUser}>
          Registruj se
        </button>

        <div className="my-4 text-center text-gray-500">
          ili se prijavite putem
        </div>

        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="flex gap-4 justify-center"
        >
          <Image src={'/google.png'} alt={'Google logo'} width={24} height={24} />
          Prijava putem Google naloga
        </button>

        <div className="text-center my-4 text-gray-500 border-t pt-4">
          Već imate nalog?{' '}
          <Link className="underline" href={'/login'}>
            Prijavite se ovde &raquo;
          </Link>
        </div>
      </form>
    </section>
  );
}
