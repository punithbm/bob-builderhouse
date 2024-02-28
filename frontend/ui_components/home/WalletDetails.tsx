import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/accordion";
import WalletDetailContent from "./WalletDetailContent";

interface IWalletDetailProps {
  setActiveAccordion: (val: string) => void;
}

const WalletDetails: FC<IWalletDetailProps> = ({ setActiveAccordion }) => {
  return (
    <div className="w-full h-full px-6 py-4 mb-4 rounded-lg bannerShadow">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger onClick={() => setActiveAccordion("item-1")}>
          <p className="paragraph2_regular font-[600] text-text-500">Wallet Details</p>
        </AccordionTrigger>
        <AccordionContent>
          <WalletDetailContent />
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

export default WalletDetails;
