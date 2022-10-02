import * as $ from '@manahippo/move-to-ts';
import { AptosDataCache, AptosParserRepo, DummyCache, AptosLocalCache } from '@manahippo/move-to-ts';
import { U8, U64, U128 } from '@manahippo/move-to-ts';
import { u8, u64, u128 } from '@manahippo/move-to-ts';
import { TypeParamDeclType, FieldDeclType } from '@manahippo/move-to-ts';
import { AtomicTypeTag, StructTag, TypeTag, VectorTag, SimpleStructTag } from '@manahippo/move-to-ts';
import { HexString, AptosClient, AptosAccount, TxnBuilderTypes, Types } from 'aptos';
import * as Coin_list from '../coin_list';
import * as Stdlib from '../stdlib';
import * as Math from './math';
import * as Piece_swap from './piece_swap';
export const packageName = 'hippo-swap';
export const moduleAddress = new HexString('0x46e159be621e7493284112c551733e6378f931fd2fc851975bc36bedaae4de0f');
export const moduleName = 'piece_swap_script';

export const E_LP_TOKEN_ALREADY_IN_COIN_LIST: U64 = u64('8');
export const E_LP_TOKEN_ALREADY_REGISTERED: U64 = u64('7');
export const E_OUTPUT_LESS_THAN_MIN: U64 = u64('3');
export const E_SWAP_NONZERO_INPUT_REQUIRED: U64 = u64('2');
export const E_SWAP_ONLY_ONE_IN_ALLOWED: U64 = u64('0');
export const E_SWAP_ONLY_ONE_OUT_ALLOWED: U64 = u64('1');
export const E_TOKEN_REGISTRY_NOT_INITIALIZED: U64 = u64('4');
export const E_TOKEN_X_NOT_REGISTERED: U64 = u64('5');
export const E_TOKEN_Y_NOT_REGISTERED: U64 = u64('6');

export function add_liquidity_script_(
  sender: HexString,
  amount_x: U64,
  amount_y: U64,
  $c: AptosDataCache,
  $p: TypeTag[] /* <X, Y>*/
): void {
  Piece_swap.add_liquidity_(sender, $.copy(amount_x), $.copy(amount_y), $c, [$p[0], $p[1]]);
  return;
}

export function buildPayload_add_liquidity_script(
  amount_x: U64,
  amount_y: U64,
  $p: TypeTag[] /* <X, Y>*/,
  isJSON = false
): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map((t) => $.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString('0x46e159be621e7493284112c551733e6378f931fd2fc851975bc36bedaae4de0f'),
    'piece_swap_script',
    'add_liquidity_script',
    typeParamStrings,
    [amount_x, amount_y],
    isJSON
  );
}

export function create_new_pool_(
  admin: HexString,
  lp_name: U8[],
  lp_symbol: U8[],
  _lp_logo_url: U8[],
  _lp_project_url: U8[],
  k: U128,
  w1_numerator: U128,
  w1_denominator: U128,
  w2_numerator: U128,
  w2_denominator: U128,
  swap_fee_per_million: U64,
  protocol_fee_share_per_thousand: U64,
  $c: AptosDataCache,
  $p: TypeTag[] /* <X, Y>*/
): void {
  let decimals, decimals__1;
  decimals = Math.max_(u128(Stdlib.Coin.decimals_($c, [$p[0]])), u128(Stdlib.Coin.decimals_($c, [$p[1]])), $c);
  decimals__1 = u8($.copy(decimals));
  Piece_swap.create_new_pool_(
    admin,
    $.copy(lp_name),
    $.copy(lp_symbol),
    $.copy(decimals__1),
    $.copy(k),
    $.copy(w1_numerator),
    $.copy(w1_denominator),
    $.copy(w2_numerator),
    $.copy(w2_denominator),
    $.copy(swap_fee_per_million),
    $.copy(protocol_fee_share_per_thousand),
    $c,
    [$p[0], $p[1]]
  );
  return;
}

export function create_new_pool_script_(
  admin: HexString,
  lp_name: U8[],
  lp_symbol: U8[],
  k: U128,
  w1_numerator: U128,
  w1_denominator: U128,
  w2_numerator: U128,
  w2_denominator: U128,
  swap_fee_per_million: U64,
  protocol_fee_share_per_thousand: U64,
  $c: AptosDataCache,
  $p: TypeTag[] /* <X, Y>*/
): void {
  return create_new_pool_(
    admin,
    $.copy(lp_name),
    $.copy(lp_symbol),
    [],
    [],
    $.copy(k),
    $.copy(w1_numerator),
    $.copy(w1_denominator),
    $.copy(w2_numerator),
    $.copy(w2_denominator),
    $.copy(swap_fee_per_million),
    $.copy(protocol_fee_share_per_thousand),
    $c,
    [$p[0], $p[1]]
  );
}

export function buildPayload_create_new_pool_script(
  lp_name: U8[],
  lp_symbol: U8[],
  k: U128,
  w1_numerator: U128,
  w1_denominator: U128,
  w2_numerator: U128,
  w2_denominator: U128,
  swap_fee_per_million: U64,
  protocol_fee_share_per_thousand: U64,
  $p: TypeTag[] /* <X, Y>*/,
  isJSON = false
): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map((t) => $.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString('0x46e159be621e7493284112c551733e6378f931fd2fc851975bc36bedaae4de0f'),
    'piece_swap_script',
    'create_new_pool_script',
    typeParamStrings,
    [
      lp_name,
      lp_symbol,
      k,
      w1_numerator,
      w1_denominator,
      w2_numerator,
      w2_denominator,
      swap_fee_per_million,
      protocol_fee_share_per_thousand
    ],
    isJSON
  );
}

export function mock_deploy_script_(admin: HexString, $c: AptosDataCache): void {
  let billion, initial_amount;
  billion = u128('1000000000');
  create_new_pool_script_(
    admin,
    [
      u8('85'),
      u8('83'),
      u8('68'),
      u8('84'),
      u8('45'),
      u8('85'),
      u8('83'),
      u8('68'),
      u8('67'),
      u8('32'),
      u8('80'),
      u8('105'),
      u8('101'),
      u8('99'),
      u8('101'),
      u8('83'),
      u8('119'),
      u8('97'),
      u8('112'),
      u8('32'),
      u8('76'),
      u8('80'),
      u8('32'),
      u8('84'),
      u8('111'),
      u8('107'),
      u8('101'),
      u8('110')
    ],
    [u8('85'), u8('83'), u8('68'), u8('84'), u8('45'), u8('85'), u8('83'), u8('68'), u8('67')],
    $.copy(billion).mul($.copy(billion)),
    u128('110'),
    u128('100'),
    u128('105'),
    u128('100'),
    u64('100'),
    u64('100'),
    $c,
    [
      new StructTag(
        new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
        'devnet_coins',
        'DevnetUSDT',
        []
      ),
      new StructTag(
        new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
        'devnet_coins',
        'DevnetUSDC',
        []
      )
    ]
  );
  create_new_pool_script_(
    admin,
    [
      u8('68'),
      u8('65'),
      u8('73'),
      u8('45'),
      u8('85'),
      u8('83'),
      u8('68'),
      u8('67'),
      u8('32'),
      u8('80'),
      u8('105'),
      u8('101'),
      u8('99'),
      u8('101'),
      u8('83'),
      u8('119'),
      u8('97'),
      u8('112'),
      u8('32'),
      u8('76'),
      u8('80'),
      u8('32'),
      u8('84'),
      u8('111'),
      u8('107'),
      u8('101'),
      u8('110')
    ],
    [u8('68'), u8('65'), u8('73'), u8('45'), u8('85'), u8('83'), u8('68'), u8('67')],
    $.copy(billion).mul($.copy(billion)),
    u128('110'),
    u128('100'),
    u128('105'),
    u128('100'),
    u64('100'),
    u64('100'),
    $c,
    [
      new StructTag(
        new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
        'devnet_coins',
        'DevnetDAI',
        []
      ),
      new StructTag(
        new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
        'devnet_coins',
        'DevnetUSDC',
        []
      )
    ]
  );
  initial_amount = u64('1000000').mul(u64('100000000'));
  Coin_list.Devnet_coins.mint_to_wallet_(admin, $.copy(initial_amount), $c, [
    new StructTag(
      new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
      'devnet_coins',
      'DevnetUSDT',
      []
    )
  ]);
  Coin_list.Devnet_coins.mint_to_wallet_(admin, $.copy(initial_amount), $c, [
    new StructTag(
      new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
      'devnet_coins',
      'DevnetUSDC',
      []
    )
  ]);
  add_liquidity_script_(admin, $.copy(initial_amount), $.copy(initial_amount), $c, [
    new StructTag(
      new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
      'devnet_coins',
      'DevnetUSDT',
      []
    ),
    new StructTag(
      new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
      'devnet_coins',
      'DevnetUSDC',
      []
    )
  ]);
  Coin_list.Devnet_coins.mint_to_wallet_(admin, $.copy(initial_amount), $c, [
    new StructTag(
      new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
      'devnet_coins',
      'DevnetDAI',
      []
    )
  ]);
  Coin_list.Devnet_coins.mint_to_wallet_(admin, $.copy(initial_amount), $c, [
    new StructTag(
      new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
      'devnet_coins',
      'DevnetUSDC',
      []
    )
  ]);
  add_liquidity_script_(admin, $.copy(initial_amount), $.copy(initial_amount), $c, [
    new StructTag(
      new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
      'devnet_coins',
      'DevnetDAI',
      []
    ),
    new StructTag(
      new HexString('0x498d8926f16eb9ca90cab1b3a26aa6f97a080b3fcbe6e83ae150b7243a00fb68'),
      'devnet_coins',
      'DevnetUSDC',
      []
    )
  ]);
  return;
}

export function buildPayload_mock_deploy_script(
  isJSON = false
): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = [] as string[];
  return $.buildPayload(
    new HexString('0x46e159be621e7493284112c551733e6378f931fd2fc851975bc36bedaae4de0f'),
    'piece_swap_script',
    'mock_deploy_script',
    typeParamStrings,
    [],
    isJSON
  );
}

export function remove_liquidity_script_(
  sender: HexString,
  liquidity: U64,
  $c: AptosDataCache,
  $p: TypeTag[] /* <X, Y>*/
): void {
  Piece_swap.remove_liquidity_(sender, $.copy(liquidity), $c, [$p[0], $p[1]]);
  return;
}

export function buildPayload_remove_liquidity_script(
  liquidity: U64,
  $p: TypeTag[] /* <X, Y>*/,
  isJSON = false
): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map((t) => $.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString('0x46e159be621e7493284112c551733e6378f931fd2fc851975bc36bedaae4de0f'),
    'piece_swap_script',
    'remove_liquidity_script',
    typeParamStrings,
    [liquidity],
    isJSON
  );
}

export function swap_script_(
  sender: HexString,
  x_in: U64,
  y_in: U64,
  x_min_out: U64,
  y_min_out: U64,
  $c: AptosDataCache,
  $p: TypeTag[] /* <X, Y>*/
): void {
  let temp$1, temp$2, x_out, y_out;
  if ($.copy(x_in).gt(u64('0'))) {
    temp$1 = $.copy(y_in).gt(u64('0'));
  } else {
    temp$1 = false;
  }
  if (!!temp$1) {
    throw $.abortCode($.copy(E_SWAP_ONLY_ONE_IN_ALLOWED));
  }
  if ($.copy(x_min_out).gt(u64('0'))) {
    temp$2 = $.copy(y_min_out).gt(u64('0'));
  } else {
    temp$2 = false;
  }
  if (!!temp$2) {
    throw $.abortCode($.copy(E_SWAP_ONLY_ONE_OUT_ALLOWED));
  }
  if ($.copy(x_in).gt(u64('0'))) {
    y_out = Piece_swap.swap_x_to_y_(sender, $.copy(x_in), $c, [$p[0], $p[1]]);
    if (!$.copy(y_out).ge($.copy(y_min_out))) {
      throw $.abortCode($.copy(E_OUTPUT_LESS_THAN_MIN));
    }
  } else {
    if ($.copy(y_in).gt(u64('0'))) {
      x_out = Piece_swap.swap_y_to_x_(sender, $.copy(y_in), $c, [$p[0], $p[1]]);
      if (!$.copy(x_out).ge($.copy(x_min_out))) {
        throw $.abortCode($.copy(E_OUTPUT_LESS_THAN_MIN));
      }
    } else {
      if (!false) {
        throw $.abortCode($.copy(E_SWAP_NONZERO_INPUT_REQUIRED));
      }
    }
  }
  return;
}

export function buildPayload_swap_script(
  x_in: U64,
  y_in: U64,
  x_min_out: U64,
  y_min_out: U64,
  $p: TypeTag[] /* <X, Y>*/,
  isJSON = false
): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
  const typeParamStrings = $p.map((t) => $.getTypeTagFullname(t));
  return $.buildPayload(
    new HexString('0x46e159be621e7493284112c551733e6378f931fd2fc851975bc36bedaae4de0f'),
    'piece_swap_script',
    'swap_script',
    typeParamStrings,
    [x_in, y_in, x_min_out, y_min_out],
    isJSON
  );
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
  payload_add_liquidity_script(
    amount_x: U64,
    amount_y: U64,
    $p: TypeTag[] /* <X, Y>*/,
    isJSON = false
  ): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_add_liquidity_script(amount_x, amount_y, $p, isJSON);
  }
  async add_liquidity_script(
    _account: AptosAccount,
    amount_x: U64,
    amount_y: U64,
    $p: TypeTag[] /* <X, Y>*/,
    _maxGas = 1000,
    _isJSON = false
  ) {
    const payload = buildPayload_add_liquidity_script(amount_x, amount_y, $p, _isJSON);
    return $.sendPayloadTx(this.client, _account, payload, _maxGas);
  }
  payload_create_new_pool_script(
    lp_name: U8[],
    lp_symbol: U8[],
    k: U128,
    w1_numerator: U128,
    w1_denominator: U128,
    w2_numerator: U128,
    w2_denominator: U128,
    swap_fee_per_million: U64,
    protocol_fee_share_per_thousand: U64,
    $p: TypeTag[] /* <X, Y>*/,
    isJSON = false
  ): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_create_new_pool_script(
      lp_name,
      lp_symbol,
      k,
      w1_numerator,
      w1_denominator,
      w2_numerator,
      w2_denominator,
      swap_fee_per_million,
      protocol_fee_share_per_thousand,
      $p,
      isJSON
    );
  }
  async create_new_pool_script(
    _account: AptosAccount,
    lp_name: U8[],
    lp_symbol: U8[],
    k: U128,
    w1_numerator: U128,
    w1_denominator: U128,
    w2_numerator: U128,
    w2_denominator: U128,
    swap_fee_per_million: U64,
    protocol_fee_share_per_thousand: U64,
    $p: TypeTag[] /* <X, Y>*/,
    _maxGas = 1000,
    _isJSON = false
  ) {
    const payload = buildPayload_create_new_pool_script(
      lp_name,
      lp_symbol,
      k,
      w1_numerator,
      w1_denominator,
      w2_numerator,
      w2_denominator,
      swap_fee_per_million,
      protocol_fee_share_per_thousand,
      $p,
      _isJSON
    );
    return $.sendPayloadTx(this.client, _account, payload, _maxGas);
  }
  payload_mock_deploy_script(
    isJSON = false
  ): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_mock_deploy_script(isJSON);
  }
  async mock_deploy_script(_account: AptosAccount, _maxGas = 1000, _isJSON = false) {
    const payload = buildPayload_mock_deploy_script(_isJSON);
    return $.sendPayloadTx(this.client, _account, payload, _maxGas);
  }
  payload_remove_liquidity_script(
    liquidity: U64,
    $p: TypeTag[] /* <X, Y>*/,
    isJSON = false
  ): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_remove_liquidity_script(liquidity, $p, isJSON);
  }
  async remove_liquidity_script(
    _account: AptosAccount,
    liquidity: U64,
    $p: TypeTag[] /* <X, Y>*/,
    _maxGas = 1000,
    _isJSON = false
  ) {
    const payload = buildPayload_remove_liquidity_script(liquidity, $p, _isJSON);
    return $.sendPayloadTx(this.client, _account, payload, _maxGas);
  }
  payload_swap_script(
    x_in: U64,
    y_in: U64,
    x_min_out: U64,
    y_min_out: U64,
    $p: TypeTag[] /* <X, Y>*/,
    isJSON = false
  ): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
    return buildPayload_swap_script(x_in, y_in, x_min_out, y_min_out, $p, isJSON);
  }
  async swap_script(
    _account: AptosAccount,
    x_in: U64,
    y_in: U64,
    x_min_out: U64,
    y_min_out: U64,
    $p: TypeTag[] /* <X, Y>*/,
    _maxGas = 1000,
    _isJSON = false
  ) {
    const payload = buildPayload_swap_script(x_in, y_in, x_min_out, y_min_out, $p, _isJSON);
    return $.sendPayloadTx(this.client, _account, payload, _maxGas);
  }
}
