"use client";
import { WagmiConfig } from "wagmi";
import { SatsWagmiConfig } from "@gobob/sats-wagmi";

import { config } from "../../connectors/wagmi-connectors";
import { FC } from "react";
import { ConnectWallet } from "@/ui_components/ConnectWallet";
import Homepage from "@/ui_components/shared/Homepage";

export default function Home() {
  const handleClick = () => {
    console.log("test");
  };
  return (
    <main>
      <WagmiConfig config={config}>
        <SatsWagmiConfig network="testnet">
          <div className="flex min-h-screen flex-col items-center justify-between p-24">
            {/* <ConnectWallet />
             */}
            <Homepage />
          </div>
        </SatsWagmiConfig>
      </WagmiConfig>
      {/* <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div
          onClick={() => {
            handleClick();
          }}
        >
          Home
        </div>
        <ConnectWallet />
      </div> */}
    </main>
  );
}
