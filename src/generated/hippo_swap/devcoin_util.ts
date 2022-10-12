import * as $ from '@manahippo/move-to-ts';
import { AptosDataCache, AptosParserRepo, DummyCache, AptosLocalCache } from '@manahippo/move-to-ts';
import { U8, U64, U128 } from '@manahippo/move-to-ts';
import { u8, u64, u128 } from '@manahippo/move-to-ts';
import { TypeParamDeclType, FieldDeclType } from '@manahippo/move-to-ts';
import { AtomicTypeTag, StructTag, TypeTag, VectorTag, SimpleStructTag } from '@manahippo/move-to-ts';
import { OptionTransaction } from '@manahippo/move-to-ts';
import { HexString, AptosClient, AptosAccount, TxnBuilderTypes, Types } from 'aptos';
import * as Coin_list from '../coin_list';
import * as Stdlib from '../stdlib';
export const packageName = 'hippo-swap';
export const moduleAddress = new HexString('0x46e159be621e7493284112c551733e6378f931fd2fc851975bc36bedaae4de0f');
export const moduleName = 'devcoin_util';

export function init_coin_(
  coin_list_admin: HexString,
  decimals: U8,
  $c: AptosDataCache,
  $p: TypeTag[] /* <CoinType>*/
): void {
  if (!Stdlib.Coin.is_coin_initialized_($c, [$p[0]])) {
    Coin_list.Devnet_coins.initialize_(coin_list_admin, $.copy(decimals), $c, [$p[0]]);
  } else {
  }
  return;
}

export function init_coin_and_register_(
  admin: HexString,
  name: U8[],
  symbol: U8[],
  decimals: U8,
  $c: AptosDataCache,
  $p: TypeTag[] /* <CoinType>*/
): void {
  if (!Stdlib.Coin.is_coin_initialized_($c, [$p[0]])) {
    Coin_list.Devnet_coins.init_coin_and_register_(
      admin,
      Stdlib.String.utf8_($.copy(name), $c),
      Stdlib.String.utf8_($.copy(symbol), $c),
      $.copy(decimals),
      $c,
      [$p[0]]
    );
  } else {
  }
  return;
}

export function init_registry_(coin_list_admin: HexString, $c: AptosDataCache): void {
  if (!Coin_list.Coin_list.is_registry_initialized_($c)) {
    Coin_list.Coin_list.initialize_(coin_list_admin, $c);
  } else {
  }
  return;
}

export function loadParsers(repo: AptosParserRepo) {}
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
}
