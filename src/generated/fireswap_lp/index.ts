import { AptosClient } from 'aptos';
import { AptosParserRepo, AptosLocalCache, AptosSyncedCache } from '@manahippo/move-to-ts';
import * as LPCoinV1 from './LPCoinV1';

export * as LPCoinV1 from './LPCoinV1';

export function loadParsers(repo: AptosParserRepo) {
  LPCoinV1.loadParsers(repo);
}

export function getPackageRepo(): AptosParserRepo {
  const repo = new AptosParserRepo();
  loadParsers(repo);
  repo.addDefaultParsers();
  return repo;
}

export type AppType = {
  client: AptosClient;
  repo: AptosParserRepo;
  cache: AptosLocalCache;
};

export class App {
  LPCoinV1: LPCoinV1.App;
  constructor(public client: AptosClient, public repo: AptosParserRepo, public cache: AptosLocalCache) {
    this.LPCoinV1 = new LPCoinV1.App(client, repo, cache);
  }
}
