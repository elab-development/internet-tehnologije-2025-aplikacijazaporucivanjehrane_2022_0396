import Right from "@/components/icons/Right";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-semibold">
          SVE<br />
         je lepše uz<br />
          uz&nbsp;
          <span className="text-primary">
            dobru domaću kuhinju!
          </span>
        </h1>
        <p className="my-6 text-gray-500 text-sm">
          Domaća srpska kuhinja pripremljena po tradicionalnim receptima, sa pažljivo biranim sastojcima i ukusima koji podsećaju na porodičnu trpezu.
        </p>
        <div className="flex gap-4 text-sm">
          <button className="flex justify-center bg-primary uppercase flex items-center gap-2 text-white px-4 py-2 rounded-full">
             Naruči odmah
            <Right />
          </button>
          <button className="flex items-center border-0 gap-2 py-2 text-gray-600 font-semibold">
            Saznaj više
            <Right />
          </button>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image src={'/pizza1.png'} layout={'fill'} objectFit={'contain'} alt={'pizza'} />
      </div>
    </section>
  );
}