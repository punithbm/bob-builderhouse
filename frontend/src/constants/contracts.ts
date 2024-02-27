import { BtcMarketplaceAbi } from "../contracts/abi/BtcMarketplace.abi";
import { ERC20Abi } from "../contracts/abi/ERC20.abi";
import { HexString } from "../types";
import { Erc20Currencies, Erc20CurrencyTicker } from "./currencies";

// TODO: Figure out how we can reuse the ERC20Currency enum
//       here without need to re-define currencies again.
enum ContractType {
  WBTC = "WBTC",
  USDC = "USDC",
  ERC20_MARKETPLACE = "ERC20_MARKETPLACE",
  BTC_MARKETPLACE = "BTC_MARKETPLACE",
}

// Contracts config with contract address and ABI
// that is used in useContract hook to automatically infer smart contract types.
const contracts = {
  // Automatically adds all ERC20 currencies contracts here.
  ...Object.entries(Erc20Currencies).reduce((result, [key, value]) => ({ ...result, [key as ContractType]: { ...value, abi: ERC20Abi } }), {} as { [ticker in Erc20CurrencyTicker]: { abi: typeof ERC20Abi; address: HexString } }),

  [ContractType.BTC_MARKETPLACE]: {
    address: "0x193E50fa1b7f8a65d8BC64143b698b573baFDF0c",
    abi: BtcMarketplaceAbi,
  },
} as const;

export { contracts, ContractType };
