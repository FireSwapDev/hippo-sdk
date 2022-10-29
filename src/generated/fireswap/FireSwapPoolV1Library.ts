import * as $ from '@manahippo/move-to-ts';
import { AptosDataCache, AptosParserRepo, DummyCache, AptosLocalCache } from '@manahippo/move-to-ts';
import { U8, U64, U128 } from '@manahippo/move-to-ts';
import { u8, u64, u128 } from '@manahippo/move-to-ts';
import { TypeParamDeclType, FieldDeclType } from '@manahippo/move-to-ts';
import { AtomicTypeTag, StructTag, TypeTag, VectorTag, SimpleStructTag } from '@manahippo/move-to-ts';
import { OptionTransaction } from '@manahippo/move-to-ts';
import { HexString, AptosClient, AptosAccount, TxnBuilderTypes, Types } from 'aptos';
export const packageName = 'FireSwapV1';
export const moduleAddress = new HexString('0xa525a3e28af5d79fb7d0c6571f80f9b50481633a69434ff13a8a6157cf7c7cd0');
export const moduleName = 'FireSwapPoolV1Library';

export const ERR_COIN_TYPE_SAME_ERROR: U64 = u64('205');
export const ERR_INSUFFICIENT_AMOUNT: U64 = u64('201');
export const ERR_INSUFFICIENT_INPUT_AMOUNT: U64 = u64('203');
export const ERR_INSUFFICIENT_LIQUIDITY: U64 = u64('202');
export const ERR_INSUFFICIENT_OUTPUT_AMOUNT: U64 = u64('204');
export const MAX_U128: U128 = u128('340282366920938463463374607431768211455');

export function get_amount_out_(
  amount_in: U64,
  reserve_in: U64,
  reserve_out: U64,
  swap_fee: U64,
  $c: AptosDataCache
): U64 {
  let temp$1, amount_in_with_fee, amount_out, denominator, numerator;
  if (!$.copy(amount_in).gt(u64('0'))) {
    throw $.abortCode($.copy(ERR_INSUFFICIENT_INPUT_AMOUNT));
  }
  if ($.copy(reserve_in).gt(u64('0'))) {
    temp$1 = $.copy(reserve_out).gt(u64('0'));
  } else {
    temp$1 = false;
  }
  if (!temp$1) {
    throw $.abortCode($.copy(ERR_INSUFFICIENT_LIQUIDITY));
  }
  amount_in_with_fee = u128($.copy(amount_in)).mul(u128(u64('10000').sub($.copy(swap_fee))));
  numerator = $.copy(amount_in_with_fee).mul(u128($.copy(reserve_out)));
  denominator = u128($.copy(reserve_in)).mul(u128('10000')).add($.copy(amount_in_with_fee));
  amount_out = $.copy(numerator).div($.copy(denominator));
  return u64($.copy(amount_out));
}

export function quote_(amount_x: U64, reserve_x: U64, reserve_y: U64, $c: AptosDataCache): U64 {
  let temp$1, amount_y;
  if (!$.copy(amount_x).gt(u64('0'))) {
    throw $.abortCode($.copy(ERR_INSUFFICIENT_AMOUNT));
  }
  if ($.copy(reserve_x).gt(u64('0'))) {
    temp$1 = $.copy(reserve_y).gt(u64('0'));
  } else {
    temp$1 = false;
  }
  if (!temp$1) {
    throw $.abortCode($.copy(ERR_INSUFFICIENT_LIQUIDITY));
  }
  amount_y = u64(
    u128($.copy(amount_x))
      .mul(u128($.copy(reserve_y)))
      .div(u128($.copy(reserve_x)))
  );
  return $.copy(amount_y);
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
