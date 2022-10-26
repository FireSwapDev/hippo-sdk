import {
  AtomicTypeTag,
  TypeTag,
  u64,
  u8,
  U64,
  U8,
  parseTypeTagOrThrow,
  getTypeTagFullname,
  StructTag
} from '@manahippo/move-to-ts';
import { Types, TxnBuilderTypes } from 'aptos';
import { Aggregator } from '../generated/hippo_aggregator';
import { App, stdlib } from '../generated';
import { CONFIGS } from '../config';
import { coinInfoToTag, CoinListClient, RawCoinInfo } from '@manahippo/coin-list';

export type UITokenAmount = number;
export type UITokenAmountRatio = number;

export type PriceType = {
  xToY: UITokenAmountRatio;
  yToX: UITokenAmountRatio;
};

export type QuoteType = {
  inputSymbol: string;
  outputSymbol: string;
  inputUiAmt: UITokenAmount;
  outputUiAmt: UITokenAmount;
  avgPrice: UITokenAmountRatio;
  initialPrice?: UITokenAmountRatio;
  finalPrice?: UITokenAmountRatio;
  priceImpact?: number;
};

export enum DexType {
  // eslint-disable-next-line no-unused-vars
  Hippo = 1,
  // eslint-disable-next-line no-unused-vars
  Econia = 2,
  // eslint-disable-next-line no-unused-vars
  Pontem = 3,
  // eslint-disable-next-line no-unused-vars
  Basiq = 4,
  // eslint-disable-next-line no-unused-vars
  Ditto = 5,
  // eslint-disable-next-line no-unused-vars
  Tortuga = 6,
  // eslint-disable-next-line no-unused-vars
  Aptoswap = 7,
  // eslint-disable-next-line no-unused-vars
  Aux = 8,
  // eslint-disable-next-line no-unused-vars
  AnimeSwap = 9,
  // eslint-disable-next-line no-unused-vars
  Cetus = 10
}
export const DEX_TYPE_NAME: Record<DexType, string> = {
  [DexType.Hippo]: 'Hippo',
  [DexType.Econia]: 'Econia',
  [DexType.Pontem]: 'Pontem',
  [DexType.Basiq]: 'Basiq',
  [DexType.Ditto]: 'Ditto',
  [DexType.Tortuga]: 'Tortuga',
  [DexType.Aptoswap]: 'Aptoswap',
  [DexType.Aux]: 'Aux',
  [DexType.AnimeSwap]: 'AnimeSwap',
  [DexType.Cetus]: 'Cetus'
};
export type PoolType = U64;
export type RawStruct = {
  address: string;
  module: string;
  name: string;
};

// An AMM pool or ohchain orderbook that supports trading directly between X and Y
export abstract class TradingPool {
  private _xTag: StructTag | undefined;
  private _yTag: StructTag | undefined;
  constructor(public readonly reloadMinInterval = 10_000) {}
  // poolType
  abstract get dexType(): DexType;
  abstract get poolType(): PoolType;
  abstract get isRoutable(): boolean;
  // X-Y
  abstract get xCoinInfo(): RawCoinInfo;
  abstract get yCoinInfo(): RawCoinInfo;
  get xTag() {
    if (this._xTag == undefined) {
      this._xTag = coinInfoToTag(this.xCoinInfo);
    }
    return this._xTag;
  }
  get yTag() {
    if (this._yTag == undefined) {
      this._yTag = coinInfoToTag(this.yCoinInfo);
    }
    return this._yTag;
  }
  // functions that depend on pool's onchain state
  abstract isStateLoaded(): boolean;
  abstract reloadStateInternal(app: App): Promise<void>;
  private lastReloadTs: number = 0;
  async reloadState(app: App, isForce = false): Promise<void> {
    const now = Date.now();
    if (now - this.lastReloadTs > this.reloadMinInterval || isForce) {
      await this.reloadStateInternal(app);
      this.lastReloadTs = now;
    }
  }
  abstract getPrice(): PriceType;
  abstract getQuote(inputUiAmt: UITokenAmount, isXtoY: boolean): QuoteType;
  // build payload directly if not routable
  abstract makePayload(inputUiAmt: UITokenAmount, minOutAmt: UITokenAmount): Types.EntryFunctionPayload;
  getTagE(): TypeTag {
    return AtomicTypeTag.U8;
  }
}

// a single trade step involving a Pool and a direction (X-to-Y or Y-to-X)
export class TradeStep {
  constructor(public readonly pool: TradingPool, public readonly isXtoY: boolean) {}
  get xCoinInfo() {
    return this.isXtoY ? this.pool.xCoinInfo : this.pool.yCoinInfo;
  }
  get yCoinInfo() {
    return this.isXtoY ? this.pool.yCoinInfo : this.pool.xCoinInfo;
  }
  get xTag() {
    return coinInfoToTag(this.xCoinInfo);
  }
  get yTag() {
    return coinInfoToTag(this.yCoinInfo);
  }

  getPrice(): PriceType {
    const price = this.pool.getPrice();
    if (this.isXtoY) {
      return price;
    } else {
      return {
        xToY: price.yToX,
        yToX: price.xToY
      };
    }
  }
  getQuote(inputUiAmt: UITokenAmount) {
    return this.pool.getQuote(inputUiAmt, this.isXtoY);
  }
  getTagE(): TypeTag {
    return this.pool.getTagE();
  }

  toStepSnippetJSON(): IStepSnippetJSON {
    return {
      dexType: this.pool.dexType as number,
      poolType: this.pool.poolType.toBigInt().toString(),
      isXToY: this.isXtoY,
      tagE: getTypeTagFullname(this.getTagE())
    };
  }

  toStepSnippet(): StepSnippet {
    return new StepSnippet(this.pool.dexType, this.pool.poolType, this.isXtoY, this.getTagE());
  }
}

export type SwapParamType = {
  numSteps: U8;
  firstDexType: U8;
  firstPoolType: U64;
  firstIsReversed: boolean;
  secondDexType: U8;
  secondPoolType: U64;
  secondIsReversed: boolean;
  thirdDexType: U8;
  thirdPoolType: U64;
  thirdIsReversed: boolean;
  inAmt: U64;
  minOutAmt: U64;
  types: [TypeTag, TypeTag, TypeTag, TypeTag, TypeTag, TypeTag, TypeTag];
};

export class TradeRoute {
  tokens: RawCoinInfo[];
  constructor(public readonly steps: TradeStep[]) {
    // at least 1 step
    if (steps.length < 1) {
      throw new Error('A TradeRoute requires at least one TradeStep');
    }
    this.tokens = [];
    // steps have matching ends
    let tokenType = steps[0].xCoinInfo.token_type.type;
    this.tokens.push(steps[0].xCoinInfo);
    for (const step of steps) {
      const xType = step.xCoinInfo.token_type.type;
      const yType = step.yCoinInfo.token_type.type;
      // make sure LHS matches tokFullname
      if (xType !== tokenType) {
        throw new Error(`Mismatching tokens in route. Expected ${tokenType} but received ${xType}`);
      }
      tokenType = yType;
      this.tokens.push(step.yCoinInfo);
    }
  }

  get xCoinInfo() {
    return this.steps[0].xCoinInfo;
  }

  get yCoinInfo() {
    return this.steps[this.steps.length - 1].yCoinInfo;
  }
  get xTag() {
    return coinInfoToTag(this.xCoinInfo);
  }
  get yTag() {
    return coinInfoToTag(this.yCoinInfo);
  }

  getPrice(): PriceType {
    let xToY = 1;
    let yToX = 1;
    for (const step of this.steps) {
      const price = step.pool.getPrice();
      xToY *= price.xToY;
      yToX *= price.yToX;
    }
    return { xToY, yToX };
  }

  getQuote(inputUiAmt: UITokenAmount): QuoteType {
    let outputUiAmt = inputUiAmt;
    for (const step of this.steps) {
      outputUiAmt = step.getQuote(outputUiAmt).outputUiAmt;
    }
    return {
      inputSymbol: this.xCoinInfo.symbol,
      outputSymbol: this.yCoinInfo.symbol,
      inputUiAmt,
      outputUiAmt,
      avgPrice: outputUiAmt / inputUiAmt
    };
  }

  hasRoundTrip() {
    // whether something like A -> B -> A or A -> B -> C -> B happens
    const fullnameSet = new Set(this.tokens.map((ti) => ti.token_type.type));
    return fullnameSet.size < this.tokens.length;
  }

  getSwapParams(inputUiAmt: UITokenAmount, minOutAmt: UITokenAmount): SwapParamType {
    const inputSize = Math.floor(inputUiAmt * Math.pow(10, this.xCoinInfo.decimals));
    const minOutputSize = Math.floor(minOutAmt * Math.pow(10, this.yCoinInfo.decimals));
    const dummyTag = stdlib.String.String.getTag();
    if (this.steps.length === 1) {
      const step0 = this.steps[0];
      return {
        numSteps: u8(1),
        // first
        firstDexType: u8(step0.pool.dexType),
        firstPoolType: step0.pool.poolType,
        firstIsReversed: step0.isXtoY,
        // second
        secondDexType: u8(0),
        secondPoolType: u64(0),
        secondIsReversed: false,
        // third
        thirdDexType: u8(0),
        thirdPoolType: u64(0),
        thirdIsReversed: false,
        // sizes
        inAmt: u64(inputSize),
        minOutAmt: u64(minOutputSize),
        types: [
          this.xTag, // X
          dummyTag, // Y
          dummyTag, // Z
          this.yTag, // CoinOut
          step0.getTagE(), // E1
          dummyTag, // E2
          dummyTag // E3
        ]
      };
    } else if (this.steps.length === 2) {
      const step0 = this.steps[0];
      const step1 = this.steps[1];
      return {
        numSteps: u8(2),
        // first
        firstDexType: u8(step0.pool.dexType),
        firstPoolType: step0.pool.poolType,
        firstIsReversed: step0.isXtoY,
        // second
        secondDexType: u8(step1.pool.dexType),
        secondPoolType: step1.pool.poolType,
        secondIsReversed: step1.isXtoY,
        // third
        thirdDexType: u8(0),
        thirdPoolType: u64(0),
        thirdIsReversed: false,
        // sizes
        inAmt: u64(inputSize),
        minOutAmt: u64(minOutputSize),
        types: [
          coinInfoToTag(this.tokens[0]), // X
          coinInfoToTag(this.tokens[1]), // Y
          dummyTag, // Z
          coinInfoToTag(this.tokens[2]), // CoinOut
          step0.getTagE(), // E1
          step1.getTagE(), // E2
          dummyTag // E3
        ]
      };
    } else if (this.steps.length === 3) {
      const step0 = this.steps[0];
      const step1 = this.steps[1];
      const step2 = this.steps[2];
      return {
        numSteps: u8(3),
        // first
        firstDexType: u8(step0.pool.dexType),
        firstPoolType: step0.pool.poolType,
        firstIsReversed: step0.isXtoY,
        // second
        secondDexType: u8(step1.pool.dexType),
        secondPoolType: step1.pool.poolType,
        secondIsReversed: step1.isXtoY,
        // third
        thirdDexType: u8(step2.pool.dexType),
        thirdPoolType: step2.pool.poolType,
        thirdIsReversed: step2.isXtoY,
        // sizes
        inAmt: u64(inputSize),
        minOutAmt: u64(minOutputSize),
        types: [
          coinInfoToTag(this.tokens[0]), // X
          coinInfoToTag(this.tokens[1]), // Y
          coinInfoToTag(this.tokens[2]), // Z
          coinInfoToTag(this.tokens[3]), // CoinOut
          step0.getTagE(), // E1
          step1.getTagE(), // E2
          step2.getTagE() // E3
        ]
      };
    } else {
      throw new Error('Unreachable');
    }
  }

  makeSwapPayload(
    inputUiAmt: UITokenAmount,
    minOutAmt: UITokenAmount,
    isJSONPayload = false
  ): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
    const params = this.getSwapParams(inputUiAmt, minOutAmt);
    return Aggregator.buildPayload_swap(
      params.numSteps,
      // first
      params.firstDexType,
      params.firstPoolType,
      params.firstIsReversed,
      // second
      params.secondDexType,
      params.secondPoolType,
      params.secondIsReversed,
      // third
      params.thirdDexType,
      params.thirdPoolType,
      params.thirdIsReversed,
      // sizes
      params.inAmt,
      params.minOutAmt,
      params.types,
      isJSONPayload
    );
  }

  makePayload(
    inputUiAmt: UITokenAmount,
    minOutAmt: UITokenAmount,
    isJSONPayload = false
  ): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
    // not implement a function twice to avoid inconsistency
    const routeSnippet = this.toRouteSnippet();
    return routeSnippet.makePayload(inputUiAmt, minOutAmt, isJSONPayload);
  }

  debugPrint() {
    const lastSymbol = this.steps[this.steps.length - 1].yCoinInfo.symbol;
    console.log(`Route: ${this.steps.map((step) => step.xCoinInfo.symbol).join(' -> ')} -> ${lastSymbol}`);
    this.steps.forEach((step, i) => {
      console.log(
        `Step ${i}: ${step.xCoinInfo.symbol} -> ${step.yCoinInfo.symbol} (via ${DEX_TYPE_NAME[step.pool.dexType]})`
      );
    });
  }

  toJSON(): IRouteSnippetJSON {
    const tokens = this.tokens.map((t) => t.token_type.type); // full name
    const steps = this.steps.map((s) => s.toStepSnippetJSON());
    return {
      tokens,
      steps
    };
  }

  toRouteSnippet(): RouteSnippet {
    const steps = this.steps.map((s) => s.toStepSnippet());
    return new RouteSnippet(this.tokens, steps);
  }
}

class StepSnippet {
  constructor(public dexType: DexType, public poolType: PoolType, public isXtoY: boolean, public tagE: TypeTag) {}

  static fromJSON(json: IStepSnippetJSON) {
    const dexType = json.dexType as DexType;
    const poolType = new U64(json.poolType);
    const isXtoY = json.isXToY;
    const tagE = parseTypeTagOrThrow(json.tagE);

    return new StepSnippet(dexType, poolType, isXtoY, tagE);
  }
}

export interface IStepSnippetJSON {
  dexType: number;
  poolType: string;
  isXToY: boolean;
  tagE: string;
}

export interface IRouteSnippetJSON {
  tokens: string[];
  steps: IStepSnippetJSON[];
}

export class RouteSnippet {
  constructor(public tokens: RawCoinInfo[], public steps: StepSnippet[]) {}

  get xCoinInfo(): RawCoinInfo {
    return this.tokens[0];
  }
  get yCoinInfo(): RawCoinInfo {
    return this.tokens.slice(-1)[0];
  }

  static fromJSON(json: IRouteSnippetJSON, registry: CoinListClient) {
    const tokens = json.tokens.map((t) => registry.fullnameToCoinInfo[t]);
    const steps = json.steps.map((s) => StepSnippet.fromJSON(s));
    return new RouteSnippet(tokens, steps);
  }

  makePayload(
    inputUiAmt: UITokenAmount,
    minOutAmt: UITokenAmount,
    isJSONPayload = false
  ): TxnBuilderTypes.TransactionPayloadEntryFunction | Types.TransactionPayload_EntryFunctionPayload {
    const inputSize = Math.floor(inputUiAmt * Math.pow(10, this.xCoinInfo.decimals));
    const minOutputSize = Math.floor(minOutAmt * Math.pow(10, this.yCoinInfo.decimals));
    if (this.steps.length === 1) {
      const step0 = this.steps[0];
      return Aggregator.buildPayload_one_step_route(
        u8(step0.dexType),
        step0.poolType,
        step0.isXtoY,
        u64(inputSize),
        u64(minOutputSize),
        [coinInfoToTag(this.xCoinInfo), coinInfoToTag(this.yCoinInfo), step0.tagE], // X, Y, E
        isJSONPayload
      );
    } else if (this.steps.length === 2) {
      const step0 = this.steps[0];
      const step1 = this.steps[1];
      return Aggregator.buildPayload_two_step_route(
        u8(step0.dexType),
        step0.poolType,
        step0.isXtoY,
        u8(step1.dexType),
        step1.poolType,
        step1.isXtoY,
        u64(inputSize),
        u64(minOutputSize),
        [
          coinInfoToTag(this.tokens[0]),
          coinInfoToTag(this.tokens[1]),
          coinInfoToTag(this.tokens[2]),
          step0.tagE,
          step1.tagE
        ], // X, Y, Z, E1, E2
        isJSONPayload
      );
    } else if (this.steps.length === 3) {
      const step0 = this.steps[0];
      const step1 = this.steps[1];
      const step2 = this.steps[2];
      return Aggregator.buildPayload_three_step_route(
        u8(step0.dexType),
        step0.poolType,
        step0.isXtoY,
        u8(step1.dexType),
        step1.poolType,
        step1.isXtoY,
        u8(step2.dexType),
        step2.poolType,
        step2.isXtoY,
        u64(inputSize),
        u64(minOutputSize),
        [
          coinInfoToTag(this.tokens[0]),
          coinInfoToTag(this.tokens[1]),
          coinInfoToTag(this.tokens[2]),
          coinInfoToTag(this.tokens[3]),
          step0.tagE,
          step1.tagE,
          step2.tagE
        ], // X, Y, Z, M, E1, E2, E3
        isJSONPayload
      );
    } else {
      throw new Error('Unreachable');
    }
  }
}

export interface RouteAndQuote {
  route: TradeRoute;
  quote: QuoteType;
}

export interface IRouteSnippetAndQuote {
  route: RouteSnippet;
  quote: QuoteType;
}

export interface IUiQuotesResult {
  allRoutesCount: number;
  routes: IRouteSnippetAndQuote[];
}

export interface IRouteSnippetAndQuoteJSON {
  route: IRouteSnippetJSON;
  quote: QuoteType;
}

export interface IUiQuotesResultJSON {
  allRoutesCount: number;
  routes: IRouteSnippetAndQuoteJSON[];
}

// Each DEX is a TradeStepProvider
export abstract class TradingPoolProvider {
  constructor(public app: App, public netConfig = CONFIGS.testnet, public coinList: CoinListClient) {}
  abstract getDefaultPoolList(): TradingPool[];
  abstract loadPoolList(): Promise<TradingPool[]>;

  async reloadAllPoolState() {
    const pools = await this.loadPoolList();
    const promises = pools.map((pool) => pool.reloadState(this.app));
    await Promise.all(promises);
  }
}

export type TokenTypeFullname = string;
