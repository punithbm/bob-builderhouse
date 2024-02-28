"use client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  useConnect as UseSatConnect,
  useAccount as useSatsAccount,
  useDisconnect as useSatsDisconnect,
} from "@gobob/sats-wagmi";

import { Button } from "@/components/button";
import { useCallback } from "react";

export const ConnectWallet = () => {
  const { connector, address } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { connectors: satConnters, connectAsync: satConnectAsync } =
    UseSatConnect();
  const { address: btcWalletAddress, connector: btcWalletConnector } =
    useSatsAccount();
  const { disconnect: btcWalletDisconnect } = useSatsDisconnect();
  const unistatConnector = satConnters.filter(
    (item) => item.id === "unisat"
  )[0];

  const { disconnectAsync, disconnect } = useDisconnect();

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
  }, [satConnectAsync, connector, unistatConnector, disconnectAsync]);

  return (
    <div className="w-full h-full">
      <button
        onClick={() => {
          handleEvmConnect();
        }}
      >
        Connect EVM Walletsss
      </button>
      <Button
        onClick={() => {
          handleBTCConnect();
        }}
      >
        {unistatConnector?.name}
      </Button>
    </div>
  );
};
