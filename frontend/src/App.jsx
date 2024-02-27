import { useConnect, SatsConnector } from '@gobob/sats-wagmi';

function App() {
  const { connectors, connect } = useConnect();

  const handleConnect = (connector) => {
    connect({
      connector
    });
  };

  return (
    <div>
      {connectors.map((connector) => {
        // <p>Address: {connector?.getAccount()}</p>
        <button key={connector.name} onClick={() => handleConnect(connector)}>
          {connector.name}
        </button>
      }
      )
      }
    </div>
  );
}

export default App;