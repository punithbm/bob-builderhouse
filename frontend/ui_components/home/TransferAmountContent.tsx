"use client";
import { Input } from "@/components/input";
import { icons } from "@/utils/images";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown";
import { ChevronDown, Factory } from "lucide-react";
import { Button } from "@/components/button";
import {
  acceptBtcOrder,
  getBtcPrice,
  getOrderId,
  getTxStatus,
  getBtcBalance,
  sendToken,
} from "@/utils/apiServices";
import { bitcoin } from "bitcoinjs-lib/src/networks";
import { ContractType, CurrencyTicker } from "@/src/constants";
import { useContract } from "@/src/hooks/useContract";
import { Amount } from "@/utils/amount";
import { getCurrency } from "@/utils/currencies";
import { address } from "bitcoinjs-lib";
import { usePublicClient } from "wagmi";
import { addHexPrefix } from "@/utils/encoding";
import {
  DefaultElectrsClient,
  getBitcoinTxInfo,
  getBitcoinTxProof,
} from "@gobob/bob-sdk";
import {
  useConnect as UseSatConnect,
  useAccount as useSatsAccount,
  useDisconnect as useSatsDisconnect,
} from "@gobob/sats-wagmi";
import { formatUSD } from "@/utils/format";
import { useAccount } from "wagmi";
import Big from "big.js";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

const menuItems = [
  {
    id: 1,
    currency: "WBTC",
    icon: icons.wbtcIcon,
  },
  {
    id: 2,
    currency: "USDC",
    icon: icons.usdcIcon,
  },
];
// export async function getStaticProps() {
//   const bitCoinPrice = await getBtcPrice();
//   return {
//     props: {
//       bitCoinPrice,
//     },
//   };
// }

type AddOrderFormData = {
  inputValue?: string;
  outputValue?: string;
  inputTicker: CurrencyTicker;
  outputTicker: CurrencyTicker;
  btcAddress?: string;
};

interface ProofData {
  info: ElectrsTxInfo;
  proof: ElectrsTxProof;
}
type HexString = `0x${string}`;

type ElectrsTxInfo = {
  version: HexString;
  inputVector: HexString;
  outputVector: HexString;
  locktime: HexString;
};

type ElectrsTxProof = {
  merkleProof: HexString;
  txIndexInBlock: bigint;
  bitcoinHeaders: HexString;
};

const TransferAmountContent = ({ bitCoinPrice }: any) => {
  const { address: btcAddress } = useSatsAccount();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const { connector, address, isConnected } = useAccount();
  const [value, setValue] = useState("");
  const [tokenValue, setTokenValue] = useState<number>();
  const [currency, setCurrency] = useState("USDC");
  const [currIcon, setCurrIcon] = useState(icons.usdcIcon);
  const [btcPriceUsd, setBtcPriceUsd] = useState("");
  const [btcBalance, setBtcBalance] = useState(0);
  const [loader, setLoader] = useState(false);
  const [showTxRec, setShowTxRec] = useState(false);
  // const [jumpText, setJumpText] = useState("Make the Jump");
  const handleValueChange = (val: string, currencySel: string) => {
    // const valueWithoutBTC = val.replace(/[^\d.]/g, "");
    setValue(val);
    if (currencySel == "WBTC") {
      setTokenValue(Number(val));
    } else if (currencySel == "USDC") {
      setTokenValue(Number(val) * Number(btcPriceUsd));
    }
  };
  const getBtcPriceApi = async () => {
    const bitCoinPrice = await getBtcPrice();
    setBtcPriceUsd(bitCoinPrice.usd);
  };
  const getOrderIdApi = async (txHash: string) => {
    const getOrder = await getOrderId(txHash);
    return getOrder;
  };
  const getTxStatusApi = async (txHash: string) => {
    const txStatus = await getTxStatus(txHash);
    return txStatus;
  };
  const acceptOrderApi = async (btcOrder: string, orderId: string) => {
    const acceptOrder = await acceptBtcOrder(btcOrder, Number(orderId));
    return acceptOrder;
  };
  const sendTokenApi = async (
    token_address: string,
    to_address: string,
    amount: number
  ) => {
    const acceptOrder = await sendToken(token_address, to_address, amount);
    return acceptOrder;
  };
  useEffect(() => {
    getBtcPriceApi();
  }, []);

  useEffect(() => {
    // If showTxRec is true and confetti hasn't been shown yet, show it
    if (showTxRec && !showConfetti) {
      setShowConfetti(true);
      // Optionally, set a timeout to automatically hide the confetti after a few seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 2000); // Adjust time as needed

      // Cleanup the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [showTxRec, showConfetti]);

  const { write: writeBTCMarketplace } = useContract(
    ContractType.BTC_MARKETPLACE
  );
  const publicClient = usePublicClient();

  const { address: btcWalletAddress, connector: btcWalletConnector } =
    useSatsAccount();

  const handleAddOrder = useCallback(async () => {
    const inputCurrency = getCurrency("BTC");
    const outputCurrency = getCurrency(currency);
    const inputAtomicAmount = new Amount(inputCurrency, value, true).toAtomic();
    const outputAtomicAmount = new Amount(
      outputCurrency,
      BigInt(Math.round(tokenValue ?? 0).toString() ?? 0).toString() ?? "",
      true
    ).toAtomic();

    try {
      let tx;

      tx = await writeBTCMarketplace.placeBtcSellOrder([
        inputAtomicAmount,
        currency === "USDC"
          ? "0x27c3321E40f039d10D5FF831F528C9CEAE601B1d"
          : "0x2868d708e442A6a940670d26100036d426F1e16b",
        outputAtomicAmount,
      ]);

      await publicClient.waitForTransactionReceipt({ hash: tx });
      const orderId = await getOrderIdApi(tx);
      const acceptOrder = await acceptOrderApi(
        btcWalletAddress ?? "",
        orderId.data.order_id
      );

      const txStatus = getTxStatusApi(acceptOrder.data.tx_hash);

      await handleSendBTC(orderId.data.order_id);
    } catch (e) {
      setLoader(false);
    }
  }, [address, writeBTCMarketplace, publicClient, value, tokenValue]);

  async function waitForTransactionConfirmation(txId: string) {
    let isConfirmed = false;

    while (!isConfirmed) {
      try {
        // Make the API call to check transaction status
        const response = await fetch(
          `https://btc-testnet.gobob.xyz/tx/${txId}/status`
        );
        const txStatus = await response.json();

        if (txStatus.confirmed) {
          isConfirmed = true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.error("Error checking transaction status:", error);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  const handleSendBTC = async (orderId: number) => {
    const tx = await btcWalletConnector?.sendToAddress(
      "tb1qh28hd2vx273g596xl6wag37z0ss3qsvtr3mlkq",
      Number(new Amount(getCurrency("BTC"), 0.00001 ?? "0", true).toAtomic())
    );
    // const sendTokenRes = await sendTokenApi(
    //   currency === "USDC"
    //     ? "0x27c3321E40f039d10D5FF831F528C9CEAE601B1d"
    //     : "0x2868d708e442A6a940670d26100036d426F1e16b",
    //   address ?? "",
    //   Number(tokenValue)
    // );
    // setShowTxRec(true);
    const txId = tx ?? "";
    await waitForTransactionConfirmation(txId);
    const proofData = await fetchProofData(txId ?? "");
    // @ts-ignore
    const completedTx = await writeBTCMarketplace.completeBtcSellOrder([
      BigInt(orderId),
      proofData.info,
      proofData.proof,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: completedTx });
    setLoader(false);
  };

  const fetchProofData = async (txId: string): Promise<ProofData> => {
    const BITCOIN_NETWORK = "testnet";
    const electrsClient = new DefaultElectrsClient("testnet");
    // TODO: fetch from chain when available
    const hardcodedProofDifficultyFactor = 1;
    const info = await getBitcoinTxInfo(electrsClient, txId);
    const proof = await getBitcoinTxProof(
      electrsClient,
      txId,
      hardcodedProofDifficultyFactor
    );
    // TODO: Change types in SDK to return hex-prefixed data
    return {
      info: {
        version: addHexPrefix(info.version),
        locktime: addHexPrefix(info.locktime),
        inputVector: addHexPrefix(info.inputVector),
        outputVector: addHexPrefix(info.outputVector),
      },
      proof: {
        merkleProof: addHexPrefix(proof.merkleProof),
        bitcoinHeaders: addHexPrefix(proof.bitcoinHeaders),
        txIndexInBlock: BigInt(proof.txIndexInBlock),
      },
    };
  };

  // const writeOridinal = async () => {
  //   const proofData = await fetchProofData("");
  //   const txHash = await writeBTCMarketplace.completeBtcSellOrder([
  //     order.acceptId,
  //     proofData.info,
  //     proofData.proof,
  //   ]);

  //   await publicClient.waitForTransactionReceipt({ hash: txHash });
  // };

  const getbtcBalanceApi = async () => {
    const bitcoinBalance = await getBtcBalance(
      btcAddress ?? "tb1qh28hd2vx273g596xl6wag37z0ss3qsvtr3mlkq"
    );
    setBtcBalance(bitcoinBalance.btcSatoshi * 1e-9);
  };

  useEffect(() => {
    getBtcPriceApi();
    getbtcBalanceApi();
  }, []);
  console.log(!btcAddress || !isConnected || btcBalance == 0, "btc balance");
  return (
    <div>
      <div className="flex items-center gap-x-4">
        <div className="px-6 py-2.5 rounded-xl bg-[#E0E0E0] flex items-center justify-center mb-6 w-fit">
          <p className="text-sm leading-[17px] font-[600]">Spot</p>
        </div>
        <div className="px-6 py-2.5 flex items-center justify-center mb-6 w-fit">
          <p className="text-sm leading-[17px] font-[600]">Limit</p>
        </div>
      </div>
      <p className="paragraph1_medium pb-2">
        How much bitcoin do you want to sell ?
      </p>
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center gap-x-2">
          <Image src={icons.bitcoinLogo} alt="icon" width={12} height={12} />
          <p className="paragraph2_medium text-text-500">Bitcoin Testnet</p>
        </div>
        <p className="meta_regular text-text-500">{`Bal: ${btcBalance.toFixed(
          6
        )}`}</p>
      </div>
      <div className="relative h-14 rounded-lg bg-slate-200 w-full flex justify-center px-1 mb-1">
        <Input
          className="h-14 relative bg-slate-200 text-left w-full paragraph1_medium text-text-1000 placeholder:paragraph1_medium placeholder:text-text-500"
          placeholder={`0`}
          type="number"
          value={value}
          onChange={(e) => handleValueChange(e.target.value, currency)}
        />
        <div className="flex items-center absolute right-6 top-1/2 -translate-y-1/2 gap-x-3">
          <p className="paragraph1_medium">BTC</p>
          <Image src={icons.bitcoinLogo} width={24} height={24} alt="bitcoin" />
        </div>
      </div>
      <div className="w-full text-center mb-6">
        <p className="meta_regular">{`1 BTC = ${formatUSD(
          btcPriceUsd as any
        )}`}</p>
      </div>
      <p className="paragraph1_medium pb-2">You get Paid</p>
      <div className="flex items-center gap-x-2 mb-2">
        <Image src={icons.bobIcon} alt="icon" height={12} />
        <p className="paragraph2_medium text-text-500">Bob Testnet</p>
      </div>
      <div className="relative h-14 rounded-lg bg-slate-200 w-full flex justify-center px-1">
        <Input
          className="h-14 relative bg-slate-200 text-left w-full paragraph1_medium text-text-1000 placeholder:paragraph1_medium placeholder:text-text-500"
          placeholder={`0`}
          type="number"
          value={tokenValue}
        />
        <div className="flex items-center absolute right-6 top-1/2 -translate-y-1/2 gap-x-3">
          <p className="paragraph1_medium">{currency}</p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex gap-x-2 items-center">
                <Image src={currIcon} alt="token icon" width={24} height={24} />
                <ChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="bg-white rounded-lg flex flex-col gap-y-1 w-full h-full">
                {menuItems.map((item, index) => (
                  <DropdownMenuItem>
                    <div
                      className="flex items-center gap-x-3 hover:bg-slate-200 w-full py-2 px-5 cursor-pointer rounded-lg"
                      role="presentation"
                      onClick={() => {
                        setCurrIcon(item.icon);
                        setCurrency(item.currency);
                        handleValueChange(value ?? "", item.currency);
                      }}
                    >
                      <Image
                        src={item.icon}
                        alt="token icon"
                        width={24}
                        height={24}
                      />
                      <p>{item.currency}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Button
        className={`h-14 mt-6 w-full bg-black rounded-lg hover:bg-black ${
          !btcAddress ||
          !isConnected ||
          btcBalance == 0 ||
          !value ||
          tokenValue === 0
            ? "opacity-50"
            : "opacity-100"
        }`}
        disabled={
          !btcAddress ||
          !isConnected ||
          btcBalance == 0 ||
          !value ||
          tokenValue === 0
        }
        onClick={() => {
          setLoader(true);
          handleAddOrder();
        }}
      >
        {loader ? "Processing..." : "Make the Jump 🚀"}
      </Button>
      {/* {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )} */}
      {showTxRec && (
        <p className="paragraph2_medium text-text-500 mt-2 text-center">🎉 Received Token Successfully</p>
      )}
    </div>
  );
};

export default TransferAmountContent;
