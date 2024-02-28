"use client";
import { FC, useState } from "react";
import WalletDetails from "../home/WalletDetails";
import TransferAmount from "../home/TransferAmount";
import { Accordion } from "@/components/accordion";
import Image from "next/image";
import { icons } from "@/utils/images";

const Homepage: FC = () => {
  const [activeAccordion, setActiveAccordion] = useState("item-1");
  return (
    <div className="grid grid-cols-2 items-center justify-center h-full w-full">
      <div className="relative col-span-1 text-left">
        <Image src={icons.bobLogo} alt="bob-logo" width={110} height={40} className="mb-8" />
        <h1 className="heading1_bold pb-4">
          Bridge BTC the <br /> trustless way
        </h1>
        <Image
          src={icons.bannerImage}
          alt="banner-img"
          width={450}
          height={350}
          className="w-[120%]"
        />
      </div>
      <div className="relative col-span-1">
        <Accordion
          type="single"
          value={activeAccordion}
          collapsible
          className="flex flex-col gap-y-10 w-[70%] mx-auto"
        >
          <WalletDetails setActiveAccordion={setActiveAccordion} />
          <TransferAmount setActiveAccordion={setActiveAccordion} />
        </Accordion>
      </div>
    </div>
  );
};

export default Homepage;
