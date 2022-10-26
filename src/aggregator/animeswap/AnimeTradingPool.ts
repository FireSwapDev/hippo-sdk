import { AptosDataCache, u64 } from '@manahippo/move-to-ts';
import { HexString, Types } from 'aptos';
import { DexType, PriceType, QuoteType, TradingPool, UITokenAmount } from '../types';
import { AnimeSwapPoolV1 } from '../../generated/SwapDeployer';
import { App, SwapDeployer } from '../../generated';
import bigInt from 'big-integer';
import { RawCoinInfo } from '@manahippo/coin-list';

export class AnimeTradingPool extends TradingPool {
  pool: AnimeSwapPoolV1.LiquidityPool | null;
  constructor(public ownerAddr: HexString, public xCoinInfo: RawCoinInfo, public yCoinInfo: RawCoinInfo) {
    super();
    this.pool = null;
  }

  get dexType() {
    return DexType.AnimeSwap;
  }
  get poolType() {
    return u64(0);
  } // ignored

  get isRoutable() {
    return true;
  }

  // state-dependent
  isStateLoaded(): boolean {
    return !!this.pool;
  }

  async reloadStateInternal(app: App): Promise<void> {
    // eslint-disable-next-line max-len
    this.pool = await app.SwapDeployer.AnimeSwapPoolV1.LiquidityPool.load(app.parserRepo, app.client, this.ownerAddr, [
      this.xTag,
      this.yTag
    ]);
  }

  getPrice(): PriceType {
    throw new Error('Not Implemented');
  }

  getQuote(inputUiAmt: UITokenAmount, isXtoY: boolean): QuoteType {
    if (!this.pool) {
      throw new Error(`Anime Pool not loaded, unable to quote`);
    }
    const inputTokenInfo = isXtoY ? this.xCoinInfo : this.yCoinInfo;
    const outputTokenInfo = isXtoY ? this.yCoinInfo : this.xCoinInfo;
    const inputReserve = isXtoY ? this.pool.coin_x_reserve.value : this.pool.coin_y_reserve.value;
    const outputReserve = !isXtoY ? this.pool.coin_x_reserve.value : this.pool.coin_y_reserve.value;

    const coinInAmt = BigInt(Math.floor(inputUiAmt * Math.pow(10, inputTokenInfo.decimals)));
    const coinOutAmt = SwapDeployer.AnimeSwapPoolV1Library.get_amount_out_(
      u64(coinInAmt.toString()),
      inputReserve,
      outputReserve,
      u64(30),
      undefined as any as AptosDataCache
    );
    // eslint-disable-next-line max-len
    const outputUiAmt = bigInt(coinOutAmt.toBigInt()).toJSNumber() / Math.pow(10, outputTokenInfo.decimals);

    return {
      inputSymbol: inputTokenInfo.symbol,
      outputSymbol: outputTokenInfo.symbol,
      inputUiAmt: inputUiAmt,
      outputUiAmt: outputUiAmt,
      avgPrice: outputUiAmt / inputUiAmt
    };
  }

  // build payload directly if not routable
  makePayload(inputUiAmt: UITokenAmount, minOutAmt: UITokenAmount): Types.EntryFunctionPayload {
    throw new Error('Not Implemented');
  }
}
