import { AptosClient } from 'aptos';
import { AptosParserRepo, AptosLocalCache, AptosSyncedCache, u8, u64, u128 } from '@manahippo/move-to-ts';
import * as Aptoswap from './Aptoswap';
import * as ResourceAccountDeployer from './ResourceAccountDeployer';
import * as SwapDeployer from './SwapDeployer';
import * as aux from './aux';
import * as basiq from './basiq';
import * as cetus_amm from './cetus_amm';
import * as coin_list from './coin_list';
import * as econia from './econia';
import * as hippo_aggregator from './hippo_aggregator';
import * as liquidswap from './liquidswap';
import * as liquidswap_lp from './liquidswap_lp';
import * as fireswap from './fireswap';
import * as fireswap_lp from './fireswap_lp';
import * as stdlib from './stdlib';
import * as u256 from './u256';
import * as uq64x64 from './uq64x64';

export * as Aptoswap from './Aptoswap';
export * as ResourceAccountDeployer from './ResourceAccountDeployer';
export * as SwapDeployer from './SwapDeployer';
export * as aux from './aux';
export * as basiq from './basiq';
export * as cetus_amm from './cetus_amm';
export * as coin_list from './coin_list';
export * as econia from './econia';
export * as hippo_aggregator from './hippo_aggregator';
export * as liquidswap from './liquidswap';
export * as liquidswap_lp from './liquidswap_lp';
export * as fireswap from './fireswap';
export * as fireswap_lp from './fireswap_lp';
export * as stdlib from './stdlib';
export * as u256 from './u256';
export * as uq64x64 from './uq64x64';

export { u8, u64, u128 };

export function getProjectRepo(): AptosParserRepo {
  const repo = new AptosParserRepo();
  Aptoswap.loadParsers(repo);
  ResourceAccountDeployer.loadParsers(repo);
  SwapDeployer.loadParsers(repo);
  aux.loadParsers(repo);
  basiq.loadParsers(repo);
  cetus_amm.loadParsers(repo);
  coin_list.loadParsers(repo);
  econia.loadParsers(repo);
  hippo_aggregator.loadParsers(repo);
  liquidswap.loadParsers(repo);
  liquidswap_lp.loadParsers(repo);
  fireswap.loadParsers(repo);
  fireswap_lp.loadParsers(repo);
  stdlib.loadParsers(repo);
  u256.loadParsers(repo);
  uq64x64.loadParsers(repo);
  repo.addDefaultParsers();
  return repo;
}

export class App {
  parserRepo: AptosParserRepo;
  cache: AptosLocalCache;
  Aptoswap: Aptoswap.App;
  ResourceAccountDeployer: ResourceAccountDeployer.App;
  SwapDeployer: SwapDeployer.App;
  aux: aux.App;
  basiq: basiq.App;
  cetus_amm: cetus_amm.App;
  coin_list: coin_list.App;
  econia: econia.App;
  hippo_aggregator: hippo_aggregator.App;
  liquidswap: liquidswap.App;
  liquidswap_lp: liquidswap_lp.App;
  fireswap: fireswap.App;
  fireswap_lp: fireswap_lp.App;
  stdlib: stdlib.App;
  u256: u256.App;
  uq64x64: uq64x64.App;
  constructor(public client: AptosClient) {
    this.parserRepo = getProjectRepo();
    this.cache = new AptosLocalCache();
    this.Aptoswap = new Aptoswap.App(client, this.parserRepo, this.cache);
    this.ResourceAccountDeployer = new ResourceAccountDeployer.App(client, this.parserRepo, this.cache);
    this.SwapDeployer = new SwapDeployer.App(client, this.parserRepo, this.cache);
    this.aux = new aux.App(client, this.parserRepo, this.cache);
    this.basiq = new basiq.App(client, this.parserRepo, this.cache);
    this.cetus_amm = new cetus_amm.App(client, this.parserRepo, this.cache);
    this.coin_list = new coin_list.App(client, this.parserRepo, this.cache);
    this.econia = new econia.App(client, this.parserRepo, this.cache);
    this.hippo_aggregator = new hippo_aggregator.App(client, this.parserRepo, this.cache);
    this.liquidswap = new liquidswap.App(client, this.parserRepo, this.cache);
    this.liquidswap_lp = new liquidswap_lp.App(client, this.parserRepo, this.cache);
    this.fireswap = new fireswap.App(client, this.parserRepo, this.cache);
    this.fireswap_lp = new fireswap_lp.App(client, this.parserRepo, this.cache);
    this.stdlib = new stdlib.App(client, this.parserRepo, this.cache);
    this.u256 = new u256.App(client, this.parserRepo, this.cache);
    this.uq64x64 = new uq64x64.App(client, this.parserRepo, this.cache);
  }
}
