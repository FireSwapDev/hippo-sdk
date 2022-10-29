import * as $ from '@manahippo/move-to-ts';
import { AptosDataCache, AptosParserRepo, DummyCache, AptosLocalCache } from '@manahippo/move-to-ts';
import { U8, U64, U128 } from '@manahippo/move-to-ts';
import { u8, u64, u128 } from '@manahippo/move-to-ts';
import { TypeParamDeclType, FieldDeclType } from '@manahippo/move-to-ts';
import { AtomicTypeTag, StructTag, TypeTag, VectorTag, SimpleStructTag } from '@manahippo/move-to-ts';
import { OptionTransaction } from '@manahippo/move-to-ts';
import { HexString, AptosClient, AptosAccount, TxnBuilderTypes, Types } from 'aptos';
import * as Stdlib from '../stdlib';
export const packageName = 'FireSwapV1';
export const moduleAddress = new HexString('0xa525a3e28af5d79fb7d0c6571f80f9b50481633a69434ff13a8a6157cf7c7cd0');
export const moduleName = 'FireSwapPoolV1';

export class AdminData {
  static moduleAddress = moduleAddress;
  static moduleName = moduleName;
  __app: $.AppType | null = null;
  static structName: string = 'AdminData';
  static typeParameters: TypeParamDeclType[] = [];
  static fields: FieldDeclType[] = [
    { name: 'signer_cap', typeTag: new StructTag(new HexString('0x1'), 'account', 'SignerCapability', []) },
    { name: 'dao_fee_to', typeTag: AtomicTypeTag.Address },
    { name: 'admin_address', typeTag: AtomicTypeTag.Address },
    { name: 'dao_fee', typeTag: AtomicTypeTag.U8 },
    { name: 'swap_fee', typeTag: AtomicTypeTag.U64 },
    { name: 'dao_fee_on', typeTag: AtomicTypeTag.Bool },
    { name: 'is_pause', typeTag: AtomicTypeTag.Bool }
  ];

  signer_cap: Stdlib.Account.SignerCapability;
  dao_fee_to: HexString;
  admin_address: HexString;
  dao_fee: U8;
  swap_fee: U64;
  dao_fee_on: boolean;
  is_pause: boolean;

  constructor(proto: any, public typeTag: TypeTag) {
    this.signer_cap = proto['signer_cap'] as Stdlib.Account.SignerCapability;
    this.dao_fee_to = proto['dao_fee_to'] as HexString;
    this.admin_address = proto['admin_address'] as HexString;
    this.dao_fee = proto['dao_fee'] as U8;
    this.swap_fee = proto['swap_fee'] as U64;
    this.dao_fee_on = proto['dao_fee_on'] as boolean;
    this.is_pause = proto['is_pause'] as boolean;
  }

  static AdminDataParser(data: any, typeTag: TypeTag, repo: AptosParserRepo): AdminData {
    const proto = $.parseStructProto(data, typeTag, repo, AdminData);
    return new AdminData(proto, typeTag);
  }

  static async load(repo: AptosParserRepo, client: AptosClient, address: HexString, typeParams: TypeTag[]): Promise<AdminData> {
    const result = await repo.loadResource(client, address, AdminData, typeParams);
    return result as unknown as AdminData;
  }

  static async loadByApp(app: $.AppType, address: HexString, typeParams: TypeTag[]) {
    const result = await app.repo.loadResource(app.client, address, AdminData, typeParams);
    await result.loadFullState(app);
    return result as unknown as AdminData;
  }

  static getTag(): StructTag {
    return new StructTag(moduleAddress, moduleName, 'AdminData', []);
  }

  async loadFullState(app: $.AppType) {
    await this.signer_cap.loadFullState(app);
    this.__app = app;
  }
}

export class LiquidityPool {
  static moduleAddress = moduleAddress;
  static moduleName = moduleName;
  __app: $.AppType | null = null;
  static structName: string = 'LiquidityPool';
  static typeParameters: TypeParamDeclType[] = [
    { name: 'X', isPhantom: true },
    { name: 'Y', isPhantom: true }
  ];
  static fields: FieldDeclType[] = [
    { name: 'coin_x_reserve', typeTag: new StructTag(new HexString('0x1'), 'coin', 'Coin', [new $.TypeParamIdx(0)]) },
    { name: 'coin_y_reserve', typeTag: new StructTag(new HexString('0x1'), 'coin', 'Coin', [new $.TypeParamIdx(1)]) },
    { name: 'last_block_timestamp', typeTag: AtomicTypeTag.U64 },
    { name: 'last_price_x_cumulative', typeTag: AtomicTypeTag.U128 },
    { name: 'last_price_y_cumulative', typeTag: AtomicTypeTag.U128 },
    { name: 'k_last', typeTag: AtomicTypeTag.U128 },
    {
      name: 'lp_mint_cap',
      typeTag: new StructTag(new HexString('0x1'), 'coin', 'MintCapability', [
        new StructTag(
          new HexString('0x21a19ab56c7521fcc4af7eef657d1c2b61a96b0e23c0f94426626ed3d830fe5c'),
          'LPCoinV1',
          'LPCoin',
          [new $.TypeParamIdx(0), new $.TypeParamIdx(1)]
        )
      ])
    },
    {
      name: 'lp_freeze_cap',
      typeTag: new StructTag(new HexString('0x1'), 'coin', 'FreezeCapability', [
        new StructTag(
          new HexString('0x21a19ab56c7521fcc4af7eef657d1c2b61a96b0e23c0f94426626ed3d830fe5c'),
          'LPCoinV1',
          'LPCoin',
          [new $.TypeParamIdx(0), new $.TypeParamIdx(1)]
        )
      ])
    },
    {
      name: 'lp_burn_cap',
      typeTag: new StructTag(new HexString('0x1'), 'coin', 'BurnCapability', [
        new StructTag(
          new HexString('0x21a19ab56c7521fcc4af7eef657d1c2b61a96b0e23c0f94426626ed3d830fe5c'),
          'LPCoinV1',
          'LPCoin',
          [new $.TypeParamIdx(0), new $.TypeParamIdx(1)]
        )
      ])
    },
    { name: 'locked', typeTag: AtomicTypeTag.Bool }
  ];

  coin_x_reserve: Stdlib.Coin.Coin;
  coin_y_reserve: Stdlib.Coin.Coin;
  last_block_timestamp: U64;
  last_price_x_cumulative: U128;
  last_price_y_cumulative: U128;
  k_last: U128;
  lp_mint_cap: Stdlib.Coin.MintCapability;
  lp_freeze_cap: Stdlib.Coin.FreezeCapability;
  lp_burn_cap: Stdlib.Coin.BurnCapability;
  locked: boolean;

  constructor(proto: any, public typeTag: TypeTag) {
    this.coin_x_reserve = proto['coin_x_reserve'] as Stdlib.Coin.Coin;
    this.coin_y_reserve = proto['coin_y_reserve'] as Stdlib.Coin.Coin;
    this.last_block_timestamp = proto['last_block_timestamp'] as U64;
    this.last_price_x_cumulative = proto['last_price_x_cumulative'] as U128;
    this.last_price_y_cumulative = proto['last_price_y_cumulative'] as U128;
    this.k_last = proto['k_last'] as U128;
    this.lp_mint_cap = proto['lp_mint_cap'] as Stdlib.Coin.MintCapability;
    this.lp_freeze_cap = proto['lp_freeze_cap'] as Stdlib.Coin.FreezeCapability;
    this.lp_burn_cap = proto['lp_burn_cap'] as Stdlib.Coin.BurnCapability;
    this.locked = proto['locked'] as boolean;
  }

  static LiquidityPoolParser(data: any, typeTag: TypeTag, repo: AptosParserRepo): LiquidityPool {
    const proto = $.parseStructProto(data, typeTag, repo, LiquidityPool);
    return new LiquidityPool(proto, typeTag);
  }

  static async load(repo: AptosParserRepo, client: AptosClient, address: HexString, typeParams: TypeTag[]): Promise<LiquidityPool> {
    const result = await repo.loadResource(client, address, LiquidityPool, typeParams);
    return result as unknown as LiquidityPool;
  }

  static async loadByApp(app: $.AppType, address: HexString, typeParams: TypeTag[]) {
    const result = await app.repo.loadResource(app.client, address, LiquidityPool, typeParams);
    await result.loadFullState(app);
    return result as unknown as LiquidityPool;
  }

  static makeTag($p: TypeTag[]): StructTag {
    return new StructTag(moduleAddress, moduleName, 'LiquidityPool', $p);
  }

  async loadFullState(app: $.AppType) {
    await this.coin_x_reserve.loadFullState(app);
    await this.coin_y_reserve.loadFullState(app);
    await this.lp_mint_cap.loadFullState(app);
    await this.lp_freeze_cap.loadFullState(app);
    await this.lp_burn_cap.loadFullState(app);
    this.__app = app;
  }
}

export function swap_coins_for_coins_(
  _coins_in: Stdlib.Coin.Coin,
  $c: AptosDataCache,
  $p: TypeTag[] /* <X, Y>*/
): Stdlib.Coin.Coin {
  throw $.abortCode(u64('0'));
}

export function loadParsers(repo: AptosParserRepo) {
  repo.addParser(
    '0xa525a3e28af5d79fb7d0c6571f80f9b50481633a69434ff13a8a6157cf7c7cd0::FireSwapPoolV1::AdminData',
    AdminData.AdminDataParser
  );
  repo.addParser(
    '0xa525a3e28af5d79fb7d0c6571f80f9b50481633a69434ff13a8a6157cf7c7cd0::FireSwapPoolV1::LiquidityPool',
    LiquidityPool.LiquidityPoolParser
  );
}

export class App {
  constructor(public client: AptosClient, public repo: AptosParserRepo, public cache: AptosLocalCache) {}
  get moduleAddress() {
    {
      return moduleAddress;
    }
  }
  get moduleName() {
    {
      return moduleName;
    }
  }
  get AdminData() {
    return AdminData;
  }
  async loadAdminData(owner: HexString, loadFull = true, fillCache = true) {
    const val = await AdminData.load(this.repo, this.client, owner, [] as TypeTag[]);
    if (loadFull) {
      await val.loadFullState(this);
    }
    if (fillCache) {
      this.cache.set(val.typeTag, owner, val);
    }
    return val;
  }
  get LiquidityPool() {
    return LiquidityPool;
  }
  async loadLiquidityPool(owner: HexString, $p: TypeTag[] /* <X, Y> */, loadFull = true, fillCache = true) {
    const val = await LiquidityPool.load(this.repo, this.client, owner, $p);
    if (loadFull) {
      await val.loadFullState(this);
    }
    if (fillCache) {
      this.cache.set(val.typeTag, owner, val);
    }
    return val;
  }
}
