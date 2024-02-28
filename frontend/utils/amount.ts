import Big from "big.js";
import { Currency } from "@/src/constants";

export class Amount<T extends Currency> {
  public readonly currency: T;
  private readonly amount: Big;

  constructor(currency: T, amount: Big.BigSource, base?: boolean) {
    this.currency = currency;
    this.amount = base ? new Big(amount) : new Big(amount).div(new Big(10).pow(currency.decimals));
  }

  public toBig() {
    return this.amount;
  }

  public toAtomic() {
    try {
      // Ensure the amount is rounded down to remove any decimals
      const roundedAmount = this.amount.times(new Big(10).pow(this.currency.decimals)).round(0, 0); // The second 0 specifies rounding mode, 0 for round down
      return BigInt(roundedAmount.toString());
    } catch (e) {
      // If rounding still leaves us with a decimal or another error occurs, log it or handle it appropriately
      console.error("Error converting to atomic units:", e);
      throw e; // Re-throw or handle as necessary
    }
  }
}
