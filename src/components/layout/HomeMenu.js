'use client';

import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import Image from "next/image";
import {useEffect, useState} from "react";

export default function HomeMenu() {

  return (
    <section className="">


      <div className="text-center mb-4">
        <SectionHeaders
          subHeader={'Pogledajte'}
          mainHeader={'Naša najtraženija jela'} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
 
          <MenuItem />
          <MenuItem />
          <MenuItem />
          <MenuItem />
          <MenuItem />
          <MenuItem />

      </div>
      
  
    </section>
  );
}