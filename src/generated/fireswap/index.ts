import { AptosClient } from 'aptos';
import { AptosParserRepo, AptosLocalCache, AptosSyncedCache } from '@manahippo/move-to-ts';
import * as FireSwapPoolV1 from './FireSwapPoolV1';
import * as FireSwapPoolV1Library from './FireSwapPoolV1Library';

export * as FireSwapPoolV1 from './FireSwapPoolV1';
export * as FireSwapPoolV1Library from './FireSwapPoolV1Library';

export function loadParsers(repo: AptosParserRepo) {
  FireSwapPoolV1.loadParsers(repo);
  FireSwapPoolV1Library.loadParsers(repo);
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
  FireSwapPoolV1: FireSwapPoolV1.App;
  FireSwapPoolV1Library: FireSwapPoolV1Library.App;
  constructor(public client: AptosClient, public repo: AptosParserRepo, public cache: AptosLocalCache) {
    this.FireSwapPoolV1 = new FireSwapPoolV1.App(client, repo, cache);
    this.FireSwapPoolV1Library = new FireSwapPoolV1Library.App(client, repo, cache);
  }
}
