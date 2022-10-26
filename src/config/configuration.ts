import { HexString } from 'aptos';
import { Coin_list } from '../generated/coin_list';
import { aux, basiq, Aptoswap, cetus_amm, econia, hippo_aggregator } from '../generated';

export class NetworkConfiguration {
  constructor(
    public name: string,
    public fullNodeUrl: string,
    public faucetUrl: string,
    public coinListAddress: HexString,
    public hippoAggregatorAddress: HexString,
    public pontemAddress: HexString,
    public econiaAddress: HexString,
    public basiqAddress: HexString,
    public dittoAddress: HexString,
    public tortugaAddress: HexString,
    public aptoswapAddress: HexString,
    public auxAddress: HexString,
    public animeAddress: HexString,
    public cetusAddress: HexString,
    public isMainNet = false
  ) {}
}

export const LOCAL_CONFIG = new NetworkConfiguration(
  'localhost',
  'http://0.0.0.0:8080',
  'http://0.0.0.0:8000',
  // coin list
  Coin_list.moduleAddress,
  // hippo aggregator
  hippo_aggregator.Aggregator.moduleAddress,
  // pontem
  new HexString('0x05a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948'),
  // econia
  econia.Market.moduleAddress,
  // basiq
  basiq.Dex.moduleAddress,
  // ditto
  new HexString('0x4d87417a2fb3248887d820f7737d9c4aeeb9591c5de91d08f7f490550e733894'),
  // tortuga
  new HexString('0x12d75d5bde2535789041cd380e832038da873a4ba86348ca891d374e1d0e15ab'),
  // aptoswap
  Aptoswap.Pool.moduleAddress,
  // aux
  aux.Amm.moduleAddress,
  // anime
  new HexString('0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf'),
  // cetus
  cetus_amm.Amm_swap.Pool.moduleAddress
);

export const TESTNET_CONFIG = new NetworkConfiguration(
  'testnet',
  'https://fullnode.testnet.aptoslabs.com/v1',
  'https://faucet.testnet.aptoslabs.com',
  // coin list
  Coin_list.moduleAddress,
  // hippo aggregator
  hippo_aggregator.Aggregator.moduleAddress,
  // pontem
  new HexString('0x05a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948'),
  // econia
  econia.Market.moduleAddress,
  // basiq
  basiq.Dex.moduleAddress,
  // ditto
  new HexString('0x4d87417a2fb3248887d820f7737d9c4aeeb9591c5de91d08f7f490550e733894'),
  // tortuga
  new HexString('0x12d75d5bde2535789041cd380e832038da873a4ba86348ca891d374e1d0e15ab'),
  // aptoswap
  Aptoswap.Pool.moduleAddress,
  // aux
  aux.Amm.moduleAddress,
  // anime
  new HexString('0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf'),
  // cetus
  cetus_amm.Amm_swap.Pool.moduleAddress
);

export const MAINNET_CONFIG = new NetworkConfiguration(
  'mainnet',
  'https://fullnode.mainnet.aptoslabs.com/v1',
  '',
  // coin list
  Coin_list.moduleAddress,
  // hippo aggregator
  hippo_aggregator.Aggregator.moduleAddress,
  // pontem
  new HexString('0x05a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948'),
  // econia
  econia.Market.moduleAddress,
  // basiq
  new HexString('0x4885b08864b81ca42b19c38fff2eb958b5e312b1ec366014d4afff2775c19aab'),
  // ditto
  new HexString('0x4d87417a2fb3248887d820f7737d9c4aeeb9591c5de91d08f7f490550e733894'),
  // tortuga
  new HexString('0x12d75d5bde2535789041cd380e832038da873a4ba86348ca891d374e1d0e15ab'),
  // aptoswap
  Aptoswap.Pool.moduleAddress,
  // aux
  aux.Amm.moduleAddress,
  // anime
  new HexString('0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf'),
  // cetus
  cetus_amm.Amm_swap.Pool.moduleAddress
);

export const CONFIGS = {
  localhost: LOCAL_CONFIG,
  testnet: TESTNET_CONFIG,
  mainnet: MAINNET_CONFIG
};

export const HIPPO_API_ORIGIN = 'http://localhost:3030';
