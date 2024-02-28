import bitcoinLogo from "../../public/images/bitcoin_icon.svg";
import wbtcIcon from "../../public/images/wbtc_icon.svg";
import usdcIcon from "../../public/images/usdc_icon.svg";
import usdtIcon from "../../public/images/usdt_icon.svg";
import bannerImage from "../../public/images/banner_image.png";
import bobLogo from "../../public/images/bob_logo.svg";
import bobIcon from "../../public/images/bob_icon.svg";
import metaMaskLogo from "../../public/images/metamask.svg";
import uniStatLogo from "../../public/images/unistat_logo.svg";

export type TImages =
  | "bitcoinLogo"
  | "wbtcIcon"
  | "usdcIcon"
  | "usdtIcon"
  | "bannerImage"
  | "bobIcon"
  | "metaMaskLogo"
  | "uniStatLogo"
  | "bobLogo";

export type TNextImage = {
  src: string;
  height: number;
  width: number;
};

export const icons: Record<TImages, TNextImage> = {
  bitcoinLogo,
  wbtcIcon,
  usdcIcon,
  usdtIcon,
  bannerImage,
  bobLogo,
  bobIcon,
  metaMaskLogo,
  uniStatLogo,
};
