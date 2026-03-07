import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders
          subHeader={'Naša priča'}
          mainHeader={'O nama'}
        />
        <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
Sve je počelo još na samom početku fakulteta, kada su Danilo, Palja i Tamara, kroz razgovore, ideje i zajedničku ljubav prema hrani, počeli da sanjaju o sopstvenom restoranu. Ono što je u tom trenutku bila samo ideja, vremenom je postalo ozbiljna vizija, mesto koje će negovati ono što nam je svima blisko i poznato: pravu srpsku kuhinju.          </p>
          <p>Kroz godine učenja, rada i ličnog razvoja, shvatili smo da želimo da sačuvamo tradicionalne ukuse, ali da ih predstavimo na način koji pripada današnjem vremenu. Naš restoran je nastao iz poštovanja prema domaćim receptima, porodičnim trpezama i autentičnim jelima, uz želju da svaki gost oseti toplinu, jednostavnost i iskrenost srpske kuhinje.</p>
          <p>Danas, konačno, taj san živimo i delimo sa svima koji žele da uživaju u pravoj domaćoj hrani.</p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders
          subHeader={'NE OKLEVAJTE'}
          mainHeader={'Kontaktirajte nas'}
        />
        <div className="mt-8">
          <a className="text-4xl underline text-gray-500" href="tel: +381 64 5572942">
            +381 64 5572942
          </a>
        </div>
      </section>
    </>
  )
}
