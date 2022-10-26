import { DexType, PriceType, QuoteType, TradingPool, UITokenAmount } from '../types';
import { HexString, Types } from 'aptos';
import { StructTag, TypeTag, u64 } from '@manahippo/move-to-ts';
import { App } from '../../generated';
import { LiquidityPool as PontemPool } from '../../generated/liquidswap/liquidity_pool';
import { get_amount_out_ } from '../../generated/liquidswap/router';
import { RawCoinInfo } from '@manahippo/coin-list';

export class PontemTradingPool extends TradingPool {
  pontemPool: PontemPool | null;
  constructor(
    public ownerAddress: HexString,
    public xCoinInfo: RawCoinInfo,
    public yCoinInfo: RawCoinInfo,
    public curvesTag: StructTag
  ) {
    super();
    this.pontemPool = null;
  }
  get dexType() {
    return DexType.Pontem;
  }
  get poolType() {
    return u64(0);
  } // ignored
  get isRoutable() {
    return true;
  }
  // state-dependent
  isStateLoaded(): boolean {
    return this.pontemPool != undefined;
  }
  async reloadStateInternal(app: App): Promise<void> {
    this.pontemPool = await app.liquidswap.liquidity_pool.loadLiquidityPool(this.ownerAddress, [
      this.xTag,
      this.yTag,
      this.getCurves()
    ]);
  }
  getPrice(): PriceType {
    if (!this.isStateLoaded()) {
      throw new Error('Pontem pool not loaded. cannot compute price');
    }
    throw new Error('Not Implemented');
  }
  getQuote(inputUiAmt: UITokenAmount, isXtoY: boolean): QuoteType {
    if (!this.isStateLoaded()) {
      throw new Error('Pontem pool not loaded. cannot compute quote');
    }
    const inputTokenInfo = isXtoY ? this.xCoinInfo : this.yCoinInfo;
    const outputTokenInfo = isXtoY ? this.yCoinInfo : this.xCoinInfo;
    const inputTag = isXtoY ? this.xTag : this.yTag;
    const outputTag = isXtoY ? this.yTag : this.xTag;
    const pool = this.pontemPool!;
    const cache = pool.__app?.cache!;
    cache.move_to(pool.typeTag, this.ownerAddress, pool, true);
    const outAmount = get_amount_out_(
      u64(Math.floor(inputUiAmt * Math.pow(10, inputTokenInfo.decimals))),
      this.pontemPool?.__app?.cache!,
      [inputTag, outputTag, this.getCurves()]
    );
    const outputUiAmt = outAmount.toJsNumber() / Math.pow(10, outputTokenInfo.decimals);

    return {
      inputSymbol: inputTokenInfo.symbol,
      outputSymbol: outputTokenInfo.symbol,
      inputUiAmt,
      outputUiAmt,
      avgPrice: outputUiAmt / inputUiAmt
    };
  }

  getTagE(): TypeTag {
    return this.curvesTag;
  }

  // build payload directly if not routable
  makePayload(inputUiAmt: UITokenAmount, minOutAmt: UITokenAmount): Types.EntryFunctionPayload {
    throw new Error('Not Implemented');
  }
  getCurves() {
    return this.curvesTag;
  }
}
