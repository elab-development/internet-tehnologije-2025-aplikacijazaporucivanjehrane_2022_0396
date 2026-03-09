# 🍔 Ordering App – ITEH Projekat

Full-stack web aplikacija za poručivanje hrane razvijena u okviru predmeta **Internet Tehnologije (ITEH)**.

Aplikacija omogućava korisnicima pregled menija, dodavanje proizvoda u korpu, kreiranje porudžbina i online plaćanje putem **Stripe** servisa. Administratori imaju mogućnost upravljanja kategorijama, stavkama menija i korisnicima.

---

# 🌐 Produkciona verzija

Aplikacija je dostupna na:

**Production:**
https://internet-tehnologije-2025-aplikacij-puce.vercel.app

**Swagger API dokumentacija:**
https://internet-tehnologije-2025-aplikacij-puce.vercel.app/api/swagger

---

# 🚀 Tehnologije

## Frontend

* Next.js (App Router)
* React
* Tailwind CSS

## Backend

* Next.js API Routes
* MongoDB
* Mongoose

## Autentifikacija

* NextAuth (Credentials + Google OAuth)

## Eksterni servisi

* Stripe (online plaćanje)
* AWS S3 (upload slika)

## DevOps

* Docker
* Docker Compose
* Swagger (OpenAPI 3.0)

---

# 📦 Funkcionalnosti

## Korisnik

* Registracija i prijava
* Pregled menija
* Dodavanje proizvoda u korpu
* Kreiranje porudžbine
* Plaćanje putem Stripe-a
* Pregled sopstvenih porudžbina

## Administrator

* CRUD operacije nad kategorijama
* CRUD operacije nad stavkama menija
* Pregled svih porudžbina
* Pregled korisnika

---

# 📄 API Dokumentacija

Swagger UI je dostupan na:

http://localhost:3000/docs

OpenAPI JSON specifikacija:

http://localhost:3000/api/swagger

---

# ⚙️ Pokretanje projekta (Development)

## 1. Kloniranje repozitorijuma

git clone <repo-url>
cd <project-folder>

## 2. Instalacija dependencija

npm install

## 3. Kreiranje `.env.local` fajla

MONGO_URL=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket

## 4. Pokretanje aplikacije

npm run dev

Aplikacija će biti dostupna na:

http://localhost:3000

---

# 🐳 Pokretanje pomoću Docker-a

Build i pokretanje kontejnera:

docker compose up --build

Aplikacija će biti dostupna na:

http://localhost:3000

---

# 🗂️ Struktura projekta

src/

├── app/

│   ├── api/        → API rute

│   ├── docs/       → Swagger UI

│   ├── menu/       → Prikaz menija

│   ├── orders/     → Porudžbine

│   └── ...

│

├── models/         → Mongoose modeli

├── libs/           → OpenAPI, CORS, sanitization

├── components/     → React komponente

└── tests/        → Testovi


---

# 🔐 Bezbednost

U aplikaciji su implementirane sledeće bezbednosne mere:

* Autentifikacija putem **NextAuth**
* **Role-based pristup** za administratorske rute
* **CORS zaštita** za API rute
* **XSS sanitizacija** korisničkih inputa
* **Stripe webhook verifikacija potpisa**
* Validacija podataka pre upisa u bazu

---

# 🔌 Eksterni API servisi

Projekat koristi sledeće eksterne servise:

* **Stripe API** – procesiranje online plaćanja
* **AWS S3 API** – upload i skladištenje slika

---

# ☁️ Deployment

Aplikacija je deploy-ovana na:

**Vercel**

Deploy se automatski pokreće nakon push-a na `main` granu (CI/CD pipeline).

---

# 👨‍💻 Autori

Danilo Bogavac

Aleksandar Stojilković

Tamara Cvejić

Fakultet organizacionih nauka
Informacioni sistemi i tehnologije

Predmet: **Internet Tehnologije (ITEH)**
