"use client";
import { useAccount, useConnect, useDisconnect, usePublicClient } from "wagmi";
import { useConnect as UseSatConnect, useAccount as useSatsAccount, useDisconnect as useSatsDisconnect } from "@gobob/sats-wagmi";

import { Button } from "@/components/button";
import { useCallback } from "react";
import { ContractType, CurrencyTicker, Erc20Currency } from "@/src/constants";
import { getCurrency } from "@/utils/currencies";
import { Amount } from "@/utils/amount";
import { useContract } from "@/src/hooks/useContract";
import Image from "next/image";
import { icons } from "@/utils/images";

type AddOrderFormData = {
  inputValue?: string;
  outputValue?: string;
  inputTicker: CurrencyTicker;
  outputTicker: CurrencyTicker;
  btcAddress?: string;
};

const WalletDetailContent = () => {
  // Connect Wallet
  const { connector, address, isConnected } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { connectors: satConnters, connectAsync: satConnectAsync } = UseSatConnect();
  const { address: btcWalletAddress, connector: btcWalletConnector } = useSatsAccount();

  const { disconnect: btcWalletDisconnect } = useSatsDisconnect();
  // end

  const { disconnectAsync, disconnect } = useDisconnect();

  const unistatConnector = satConnters.filter((item) => item.id === "unisat")[0];

  const handleEvmConnect = useCallback(async () => {
    if (connector) {
      await disconnectAsync();
    }

    await connectAsync({
      connector: connectors[0],
    });
  }, [connectAsync, connector, connectors, disconnectAsync]);

  const handleBTCConnect = useCallback(async () => {
    if (btcWalletConnector) {
      await disconnectAsync();
    }

    await satConnectAsync({
      connector: unistatConnector,
    });
  }, [satConnectAsync, satConnters, unistatConnector, btcWalletDisconnect]);

  return (
    <div>
      <h2 className="heading3_medium pb-1">Setup your wallets</h2>
      <p className="paragraph2_regular text-text-500 pb-6">We need both your BTC and EVM wallet addresses to enable this transaction</p>
      <p className="paragraph_regular pb-2">Add your Bitcoin Address</p>
      <Button
        className="w-full h-14 bg-[#FFC34E] rounded-md mb-10 text-text-1000 hover:bg-[#FFB018] shadow-sm paragraph1_medium"
        onClick={() => {
          handleBTCConnect();
        }}
      >
        {btcWalletAddress ? (
          <p className="text-[12px]">{btcWalletAddress}</p>
        ) : (
          <div className="flex items-center gap-x-2">
            <Image src={icons.uniStatLogo} alt="logo" width={18} height={18} />
            <p>UniSat Wallet</p>
          </div>
        )}
      </Button>
      <p className="paragraph_regular pb-2">Add your Ethereum Address</p>
      <Button
        className="w-full h-14 bg-[#000000] rounded-md mb-4 hover:bg-[#000000]/80 shadow-sm paragraph1_medium text-white"
        onClick={() => {
          handleEvmConnect();
        }}
      >
        {isConnected ? (
          <p className="text-[12px]">{address}</p>
        ) : (
          <div className="flex items-center gap-x-2">
            <Image src={icons.metaMaskLogo} alt="logo" width={18} height={18} />
            <p>Metamask Flask</p>
          </div>
        )}
      </Button>
    </div>
  );
};

export default WalletDetailContent;
