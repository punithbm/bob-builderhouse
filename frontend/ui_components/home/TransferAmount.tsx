import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/accordion";
import { FC } from "react";
import TransferAmountContent from "./TransferAmountContent";

interface ITransferAmountProps {
  setActiveAccordion: (val: string) => void;
}

const TransferAmount: FC<ITransferAmountProps> = ({ setActiveAccordion }) => {
  return (
    <div className="w-full h-full px-6 py-4 rounded-lg bannerShadow">
      <AccordionItem value="item-2" className="border-b-0">
        <AccordionTrigger onClick={() => setActiveAccordion("item-2")}>
          <p className="paragraph2_regular font-[600] text-text-500">Bridge Kit</p>
        </AccordionTrigger>
        <AccordionContent>
          <TransferAmountContent />
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};

export default TransferAmount;
