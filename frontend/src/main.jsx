import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SatsWagmiConfig } from '@gobob/sats-wagmi';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode >
    <SatsWagmiConfig network='testnet'>
      <App />
    </SatsWagmiConfig>
  </React.StrictMode>,
)
