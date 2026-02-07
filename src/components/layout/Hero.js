import Right from "@/components/icons/Right";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-semibold">
          SVE<br />
          je lepše uz<br />
          <span className="text-primary">
            dobru domaću kuhinju!
          </span>
        </h1>

        <p className="my-6 text-gray-500 text-sm">
          Domaća srpska kuhinja pripremljena po tradicionalnim receptima,
          sa pažljivo biranim sastojcima i ukusima koji podsećaju na porodičnu trpezu.
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4 text-sm">
          {/* PRIMARY */}
          <Link
            href="/menu"
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold uppercase hover:opacity-90 transition"
          >
            Naruči odmah
            <Right />
          </Link>

          {/* SECONDARY */}
          <Link
            href="/about"
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
          >
            Saznaj više
            <Right />
          </Link>
        </div>
      </div>

      <div className="relative hidden md:block">
        <Image
          src="/pizza1.png"
          fill
          className="object-contain"
          alt="pizza"
        />
      </div>
    </section>
  );
}
