import * as $ from '@manahippo/move-to-ts';
import { AptosDataCache, AptosParserRepo, DummyCache, AptosLocalCache } from '@manahippo/move-to-ts';
import { U8, U64, U128 } from '@manahippo/move-to-ts';
import { u8, u64, u128 } from '@manahippo/move-to-ts';
import { TypeParamDeclType, FieldDeclType } from '@manahippo/move-to-ts';
import { AtomicTypeTag, StructTag, TypeTag, VectorTag, SimpleStructTag } from '@manahippo/move-to-ts';
import { OptionTransaction } from '@manahippo/move-to-ts';
import { HexString, AptosClient, AptosAccount, TxnBuilderTypes, Types } from 'aptos';
export const packageName = 'hippo-swap';
export const moduleAddress = new HexString('0x46e159be621e7493284112c551733e6378f931fd2fc851975bc36bedaae4de0f');
export const moduleName = 'safe_math';

export const ERROR_UNDERFLOW: U64 = u64('0');

export function add_(a: U128, b: U128, $c: AptosDataCache): U128 {
  return $.copy(a).add($.copy(b));
}

export function div_(a: U128, b: U128, $c: AptosDataCache): U128 {
  return $.copy(a).div($.copy(b));
}

export function mul_(a: U128, b: U128, $c: AptosDataCache): U128 {
  return $.copy(a).mul($.copy(b));
}

export function sub_(a: U128, b: U128, $c: AptosDataCache): U128 {
  return $.copy(a).sub($.copy(b));
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
