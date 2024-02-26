"use client";
import { useConnect, SatsConnector } from "@gobob/sats-wagmi";
import { useState } from "react";

function HomePage() {
  const { connectors, connect } = useConnect();
  const [isConnecting, setIsConnecting] = useState(false); // To manage connection state

  const handleConnect = async (connector: SatsConnector) => {
    setIsConnecting(true);
    try {
      await connect({ connector });
      // Optionally, handle the successful connection here (e.g., update UI)
    } catch (error) {
      console.error("Connection failed:", error);
      // Optionally, handle the error state here (e.g., show an error message)
    } finally {
      setIsConnecting(false); // Reset connection state regardless of outcome
    }
  };

  return (
    <div>
      {connectors.map((connector) => (
        <button key={connector.name} onClick={() => handleConnect(connector)} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : `Connect to ${connector.name}`}
        </button>
      ))}
    </div>
  );
}

export default HomePage;
