🍔 Ordering App – ITEH Projekat

Full-stack web aplikacija za poručivanje hrane razvijena u okviru predmeta Internet Tehnologije (ITEH).

Aplikacija omogućava korisnicima pregled menija, dodavanje proizvoda u korpu, kreiranje porudžbina i online plaćanje putem Stripe servisa. Administratori imaju mogućnost upravljanja kategorijama, stavkama menija i korisnicima.

🚀 Tehnologije

Frontend:

Next.js (App Router)

React

Tailwind CSS

Backend:

Next.js API Routes

MongoDB (Mongoose)

Autentifikacija:

NextAuth (credentials + Google OAuth)

Eksterni servisi:

Stripe (online plaćanje)

AWS S3 (upload slika)

DevOps:

Docker

Docker Compose

Swagger (OpenAPI 3.0 specifikacija)

📦 Funkcionalnosti

Korisnik:

Registracija i prijava

Pregled menija

Dodavanje proizvoda u korpu

Kreiranje porudžbine

Plaćanje putem Stripe-a

Pregled sopstvenih porudžbina

Administrator:

CRUD operacije nad kategorijama

CRUD operacije nad stavkama menija

Pregled svih porudžbina

Pregled korisnika

📄 API Dokumentacija

Swagger UI je dostupan na:

http://localhost:3000/docs

OpenAPI JSON specifikacija:

http://localhost:3000/api/swagger

⚙️ Pokretanje projekta (Development)

Klonirati repozitorijum

git clone <repo-url>
cd <project-folder>

Instalirati зависности

npm install

Kreirati .env.local fajl i dodati:

MONGO_URL=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket

Pokrenuti aplikaciju

npm run dev

Aplikacija će biti dostupna na:

http://localhost:3000

🐳 Pokretanje pomoću Docker-a

Build i pokretanje kontejnera:

docker compose up --build

Aplikacija će biti dostupna na:

http://localhost:3000

🗂️ Struktura projekta
src/
 ├── app/
 │   ├── api/           → API rute
 │   ├── docs/          → Swagger UI
 │   ├── menu/          → Prikaz menija
 │   ├── orders/        → Porudžbine
 │   └── ...
 ├── models/            → Mongoose modeli
 ├── libs/              → OpenAPI, pomoćne funkcije
 └── components/        → Reusable React komponente
🔐 Bezbednost

Implementirane su sledeće bezbednosne mere:

Autentifikacija putem NextAuth

Ograničen pristup admin rutama

Zaštita od neautorizovanog pristupa (role-based logika)

Stripe webhook validacija potpisa


🌐 Produkciono okruženje

Projekat se može deploy-ovati na:

Vercel

Render

Railway

Bilo koju cloud platformu sa podrškom za Node.js i MongoDB

👨‍💻 Autori

Danilo Bogavac
Aleksandar Stojilković
Tamara Cvejić
FON – Informacioni sistemi i tehnologije
Predmet: Internet Tehnologije (ITEH)