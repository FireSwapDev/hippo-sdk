import { StructTag, u64 } from '@manahippo/move-to-ts';
import { HexString, Types } from 'aptos';
import { DexType, PriceType, QuoteType, TradingPool, UITokenAmount } from '../types';
import { App } from '../../generated';
import bigInt from 'big-integer';
import { RawCoinInfo } from '@manahippo/coin-list';

export class BasiqTradingPool extends TradingPool {
  basiqPool: object | null;
  constructor(
    public ownerAddress: HexString,
    public xCoinInfo: RawCoinInfo,
    public yCoinInfo: RawCoinInfo,
    public poolResourceTag: StructTag
  ) {
    super();
    this.basiqPool = null;
  }
  get dexType() {
    return DexType.Basiq;
  }
  get poolType() {
    return u64(0);
  } // ignored
  get isRoutable() {
    return true;
  }
  // state-dependent
  isStateLoaded(): boolean {
    return true;
  }
  async reloadStateInternal(app: App): Promise<void> {
    this.basiqPool = await app.client.getAccountResource(this.ownerAddress, this.poolResourceTag.getAptosMoveTypeTag());
  }
  getPrice(): PriceType {
    if (!this.basiqPool) {
      throw new Error('Basiq pool not loaded. cannot compute price');
    }
    throw new Error('Not Implemented');
  }
  getQuote(inputUiAmt: UITokenAmount, isXtoY: boolean): QuoteType {
    if (!this.basiqPool) {
      throw new Error('Basiq pool not loaded. cannot compute quote');
    }
    const inputTokenInfo = isXtoY ? this.xCoinInfo : this.yCoinInfo;
    const outputTokenInfo = isXtoY ? this.yCoinInfo : this.xCoinInfo;

    const coinXReserve = bigInt((this.basiqPool as any).data.x_reserve.value as string);
    const coinYReserve = bigInt((this.basiqPool as any).data.y_reserve.value as string);
    const reserveInAmt = bigInt(isXtoY ? coinXReserve : coinYReserve);
    const reserveOutAmt = bigInt(isXtoY ? coinYReserve : coinXReserve);

    const xDecimalAdjust = bigInt((this.basiqPool as any).data.x_decimal_adjustment as string);
    const yDecimalAdjust = bigInt((this.basiqPool as any).data.y_decimal_adjustment as string);
    const coinInAdjust = isXtoY ? xDecimalAdjust : yDecimalAdjust;
    const coinOutAdjust = isXtoY ? yDecimalAdjust : xDecimalAdjust;

    const xPrice = bigInt((this.basiqPool as any).data.x_price as string);
    const yPrice = bigInt((this.basiqPool as any).data.y_price as string);
    const coinInPrice = isXtoY ? xPrice : yPrice;
    const coinOutPrice = isXtoY ? yPrice : xPrice;

    const feeBips = bigInt((this.basiqPool as any).data.fee_bips as string);
    const rebateBips = bigInt((this.basiqPool as any).data.rebate_bips as string);

    const coinInAmt = bigInt(Math.floor(inputUiAmt * Math.pow(10, inputTokenInfo.decimals)));

    const coinOutAmt = calc_swap_output(
      coinInAmt.multiply(coinInAdjust),
      reserveInAmt.multiply(coinInAdjust),
      reserveOutAmt.multiply(coinOutAdjust),
      coinInPrice,
      coinOutPrice,
      feeBips,
      rebateBips
    );

    const outputUiAmt = coinOutAmt.divide(coinOutAdjust).toJSNumber() / Math.pow(10, outputTokenInfo.decimals);

    return {
      inputSymbol: inputTokenInfo.symbol,
      outputSymbol: outputTokenInfo.symbol,
      inputUiAmt,
      outputUiAmt,
      avgPrice: outputUiAmt / inputUiAmt
    };
  }

  // build payload directly if not routable
  makePayload(inputUiAmt: UITokenAmount, minOutAmt: UITokenAmount): Types.EntryFunctionPayload {
    throw new Error('Not Implemented');
  }
}

export function imbalance_ratio(x_value: bigInt.BigInteger, y_value: bigInt.BigInteger): bigInt.BigInteger {
  const total_value = x_value.add(y_value);
  if (x_value.gt(y_value)) {
    return x_value.multiply(10000).divide(total_value);
  } else {
    return y_value.multiply(10000).divide(total_value);
  }
}

function calc_swap_output(
  input_amount: bigInt.BigInteger,
  input_reserve: bigInt.BigInteger,
  output_reserve: bigInt.BigInteger,
  input_price: bigInt.BigInteger,
  output_price: bigInt.BigInteger,
  fee_bips: bigInt.BigInteger,
  rebate_bips: bigInt.BigInteger
): bigInt.BigInteger {
  const fair_input_value = input_amount.multiply(input_price);
  const input_reserve_value = input_reserve.multiply(input_price);
  const output_reserve_value = output_reserve.multiply(output_price);

  const pre_trade_imbalance = imbalance_ratio(input_reserve_value, output_reserve_value);
  const post_trade_imbalance = imbalance_ratio(
    input_reserve_value.add(fair_input_value),
    output_reserve_value.subtract(fair_input_value)
  );

  const has_rebate = post_trade_imbalance.lt(pre_trade_imbalance);
  if (has_rebate) {
    return fair_input_value
      .divide(output_price)
      .multiply(bigInt(10000).subtract(fee_bips.subtract(rebate_bips)))
      .divide(10000);
  }

  const has_penalty = post_trade_imbalance.gt(7500);

  if (has_penalty) {
    let post_trade_surplus = post_trade_imbalance.subtract(7500).divide(100);
    let penalty_bips = post_trade_surplus.square().multiply(2);
    return fair_input_value
      .divide(output_price)
      .multiply(bigInt(10000).subtract(fee_bips).subtract(penalty_bips))
      .divide(10000);
  } else {
    return fair_input_value.divide(output_price).multiply(bigInt(10000).subtract(fee_bips)).divide(10000);
  }
}
