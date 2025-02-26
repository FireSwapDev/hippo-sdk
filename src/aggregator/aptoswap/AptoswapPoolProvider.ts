import { TradingPoolProvider } from '../types';
import { parseMoveStructTag, StructTag } from '@manahippo/move-to-ts';
import { typeTagToTypeInfo } from '../../utils';
import { AptoswapTradingPool } from './index';
import { POOLS } from './pools';
import { toStructTag } from '../utils';
import { Aptoswap } from '../../generated';

export class AptoswapPoolProvider extends TradingPoolProvider {
  async loadPoolList(): Promise<AptoswapTradingPool[]> {
    const poolList: AptoswapTradingPool[] = [];
    const packageAddr = this.netConfig.aptoswapAddress;
    const resources = await this.app.client.getAccountResources(packageAddr);

    for (const resource of resources) {
      if (resource.type.indexOf('pool::Pool') >= 0) {
        const tag = parseMoveStructTag(resource.type);
        const xTag = tag.typeParams[0] as StructTag;
        const yTag = tag.typeParams[1] as StructTag;
        const xCoinInfo = this.coinList.getCoinInfoByType(typeTagToTypeInfo(xTag));
        const yCoinInfo = this.coinList.getCoinInfoByType(typeTagToTypeInfo(yTag));
        if (!xCoinInfo || !yCoinInfo) {
          continue;
        }

        const pool = new AptoswapTradingPool(packageAddr, tag, xCoinInfo, yCoinInfo, resource);
        if (pool.pool != null && pool.pool.isAvaliableForSwap()) {
          poolList.push(pool);
        }
      }
    }

    return poolList;
  }

  getDefaultPoolList(): AptoswapTradingPool[] {
    const poolList: AptoswapTradingPool[] = [];
    for (const poolType of POOLS) {
      const xTag = toStructTag(poolType[0]);
      const yTag = toStructTag(poolType[1]);
      const tag = new StructTag(Aptoswap.Pool.moduleAddress, 'pool', 'Pool', [xTag, yTag]);
      const xCoinInfo = this.coinList.getCoinInfoByType(typeTagToTypeInfo(xTag));
      const yCoinInfo = this.coinList.getCoinInfoByType(typeTagToTypeInfo(yTag));
      if (xCoinInfo == undefined || yCoinInfo == undefined) {
        continue;
      }
      const pool = new AptoswapTradingPool(this.netConfig.aptoswapAddress, tag, xCoinInfo, yCoinInfo);
      poolList.push(pool);
    }
    return poolList;
  }
}
