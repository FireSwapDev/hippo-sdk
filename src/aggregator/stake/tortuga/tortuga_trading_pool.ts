import { DexType } from '../../types';
import { StakeTradingPool } from '../stake_trading_pool';
import { CoinInfo as StdCoinInfo } from '../../../generated/stdlib/coin';
import { App } from '../../../generated';
import { Types } from 'aptos';
import { coinInfoToTag } from '@manahippo/coin-list';

export class TortugaTradingPool extends StakeTradingPool {
  private xAmountInfo: Types.MoveResource | undefined;
  get dexType(): DexType {
    return DexType.Tortuga;
  }
  getXAmount(): number {
    // @ts-ignore
    let amount = this.xAmountInfo?.data.commission_exempt_amount;
    return parseInt(amount) / Math.pow(10, this.xCoinInfo.decimals);
  }
  async reloadStateInternal(app: App): Promise<void> {
    let res = await Promise.all([
      app.client.getAccountResource(this.ownerAddress, this.ownerAddress + '::stake_router::StakingStatus'),
      StdCoinInfo.load(app.parserRepo, app.client, this.ownerAddress, [coinInfoToTag(this.yCoinInfo)])
    ]);
    this.xAmountInfo = res[0];
    this.yAmountInfo = res[1];
  }
  isStateLoaded(): boolean {
    return this.xAmountInfo != undefined && this.yAmountInfo != undefined;
  }
}
