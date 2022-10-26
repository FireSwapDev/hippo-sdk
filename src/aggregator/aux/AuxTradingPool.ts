import { DexType, PoolType, PriceType, QuoteType, TradingPool, UITokenAmount } from '../types';
import { HexString, Types } from 'aptos';
import { App } from '../../generated';
import { au_out_, Pool as AuxPool } from '../../generated/aux/amm';
import { u64 } from '@manahippo/move-to-ts';
import { RawCoinInfo } from '@manahippo/coin-list';

export class AuxTradingPool extends TradingPool {
  pool: AuxPool | null;
  constructor(public ownerAddress: HexString, public xCoinInfo: RawCoinInfo, public yCoinInfo: RawCoinInfo) {
    super();
    this.pool = null;
  }
  get dexType(): DexType {
    return DexType.Aux;
  }

  getPrice(): PriceType {
    if (this.isStateLoaded()) {
      const xPrice = au_out_(u64(10 ** this.xCoinInfo.decimals), this.pool?.__app?.cache!, [this.xTag, this.yTag]);
      const yPrice = au_out_(u64(10 ** this.xCoinInfo.decimals), this.pool?.__app?.cache!, [this.yTag, this.xTag]);
      return {
        xToY: xPrice.toJsNumber(),
        yToX: yPrice.toJsNumber()
      };
    }
    throw new Error('Aux pool not loaded. cannot compute quote');
  }

  getQuote(inputUiAmt: UITokenAmount, isXtoY: boolean): QuoteType {
    if (!this.isStateLoaded()) {
      throw new Error('Aux pool not loaded. cannot compute quote');
    }
    const inputCoinInfo = isXtoY ? this.xCoinInfo : this.yCoinInfo;
    const outputCoinInfo = isXtoY ? this.yCoinInfo : this.xCoinInfo;
    const inputTag = isXtoY ? this.xTag : this.yTag;
    const outputTag = isXtoY ? this.yTag : this.xTag;
    if (inputUiAmt == 0) {
      return {
        inputSymbol: inputCoinInfo.symbol,
        outputSymbol: outputCoinInfo.symbol,
        inputUiAmt,
        outputUiAmt: 0,
        avgPrice: 0
      };
    }
    let outAmount = au_out_(
      u64(Math.floor(inputUiAmt * Math.pow(10, inputCoinInfo.decimals))),
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
    this.pool = await app.aux.amm.loadPool(this.ownerAddress, [this.xTag, this.yTag]);
  }
}
