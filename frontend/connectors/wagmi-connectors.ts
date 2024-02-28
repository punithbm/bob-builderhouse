"use client";
import { Chain, configureChains, createConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import {
  L2_BLOCK_EXPLORER,
  L2_CHAIN_ID,
  L2_MULTICALL3_ADDRESS,
  L2_RPC_URL,
  L2_WSS_URL,
} from "../src/config";

const L2_PROJECT_ID = "ecaa69239ffd7e64d35979e80b2d2cf3";

const L2_METADATA = {
  name: "BOB: Peer to Peer Swap",
  description: "BOB Peer to Peer Swap Demo",
  url: "https://demo.gobob.xyz",
  icons: [
    "https://uploads-ssl.webflow.com/64e85c2f3609488b3ed725f4/64ecae53ef4b561482f1c49f_bob1.jpg",
  ],
};

const L2_CHAIN_CONFIG = {
  id: L2_CHAIN_ID,
  name: "BOB L2 Demo",
  network: "BOB-L2-Demo",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: [L2_RPC_URL], webSocket: [L2_WSS_URL] },
    default: { http: [L2_RPC_URL], webSocket: [L2_WSS_URL] },
  },
  blockExplorers: {
    default: { name: "BobScan", url: L2_BLOCK_EXPLORER },
  },
  contracts: {
    multicall3: {
      address: L2_MULTICALL3_ADDRESS,
    },
  },
} as const satisfies Chain;

const chains = [L2_CHAIN_CONFIG];

const { publicClient, webSocketPublicClient } = configureChains(chains, [
  publicProvider(),
]);
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
  ],
});

export { L2_CHAIN_CONFIG, L2_METADATA, L2_PROJECT_ID, config, publicClient };
