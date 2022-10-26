import { DexType, PoolType, PriceType, QuoteType, TradingPool, UITokenAmount } from '../types';
import { HexString, Types } from 'aptos';
import { u128, u64 } from '@manahippo/move-to-ts';
import { App } from '../../generated';
import { RawCoinInfo } from '@manahippo/coin-list';
import { Pool as CetusPool } from '../../generated/cetus_amm/amm_swap';
import { compute_b_out_ } from '../../generated/cetus_amm/amm_router';
export class CetusTradingPool extends TradingPool {
  pool: CetusPool | null;
  constructor(public ownerAddr: HexString, public xCoinInfo: RawCoinInfo, public yCoinInfo: RawCoinInfo) {
    super();
    this.pool = null;
  }
  get dexType(): DexType {
    return DexType.Cetus;
  }

  getPrice(): PriceType {
    if (this.isStateLoaded()) {
      const xPrice = compute_b_out_(u128(Math.pow(10, this.yCoinInfo.decimals)), false, this.pool?.__app?.cache!, [
        this.yTag,
        this.xTag
      ]);
      const yPrice = compute_b_out_(u128(Math.pow(10, this.xCoinInfo.decimals)), true, this.pool?.__app?.cache!, [
        this.xTag,
        this.yTag
      ]);
      return {
        xToY: xPrice.toJsNumber(),
        yToX: yPrice.toJsNumber()
      };
    }
    throw new Error('Cetus pool not loaded. cannot compute quote');
  }

  getQuote(inputUiAmt: UITokenAmount, isXtoY: boolean): QuoteType {
    if (this.isStateLoaded()) {
      const inputCoinInfo = isXtoY ? this.xCoinInfo : this.yCoinInfo;
      const outputCoinInfo = isXtoY ? this.yCoinInfo : this.xCoinInfo;
      const inputTag = isXtoY ? this.xTag : this.yTag;
      const outputTag = isXtoY ? this.yTag : this.xTag;
      let outAmount = compute_b_out_(
        u64(Math.floor(inputUiAmt * Math.pow(10, inputCoinInfo.decimals))),
        isXtoY,
        this.pool?.__app?.cache!,
        [inputTag, outputTag]
      );
      const outputUiAmt = outAmount.toJsNumber() / Math.pow(10, outputCoinInfo.decimals);
      return {
        inputSymbol: inputCoinInfo.symbol,
        outputSymbol: outputCoinInfo.symbol,
        inputUiAmt,
        outputUiAmt,
        avgPrice: outputUiAmt / inputUiAmt
      };
    }
    throw new Error('Cetus pool not loaded. cannot compute quote');
  }

  get isRoutable(): boolean {
    return true;
  }

  isStateLoaded(): boolean {
    return this.pool != null;
  }

  makePayload(inputUiAmt: UITokenAmount, minOutAmt: UITokenAmount): Types.EntryFunctionPayload {
    throw new Error('Not Implemented');
  }

  get poolType(): PoolType {
    return u64(0);
  }

  async reloadStateInternal(app: App): Promise<void> {
    if (this.pool == null) {
      await app.cetus_amm.amm_config.loadPoolFeeConfig(this.ownerAddr, [this.xTag, this.yTag]);
    }
    this.pool = await app.cetus_amm.amm_swap.loadPool(this.ownerAddr, [this.xTag, this.yTag]);
  }
}
