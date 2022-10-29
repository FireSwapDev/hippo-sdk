import * as $ from '@manahippo/move-to-ts';
import { AptosDataCache, AptosParserRepo, DummyCache, AptosLocalCache } from '@manahippo/move-to-ts';
import { U8, U64, U128 } from '@manahippo/move-to-ts';
import { u8, u64, u128 } from '@manahippo/move-to-ts';
import { TypeParamDeclType, FieldDeclType } from '@manahippo/move-to-ts';
import { AtomicTypeTag, StructTag, TypeTag, VectorTag, SimpleStructTag } from '@manahippo/move-to-ts';
import { OptionTransaction } from '@manahippo/move-to-ts';
import { HexString, AptosClient, AptosAccount, TxnBuilderTypes, Types } from 'aptos';
export const packageName = 'LPCoin';
export const moduleAddress = new HexString('0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf');
export const moduleName = 'LPCoinV1';

export class LPCoin {
  static moduleAddress = moduleAddress;
  static moduleName = moduleName;
  __app: $.AppType | null = null;
  static structName: string = 'LPCoin';
  static typeParameters: TypeParamDeclType[] = [
    { name: 'CoinType1', isPhantom: true },
    { name: 'CoinType2', isPhantom: true }
  ];
  static fields: FieldDeclType[] = [];

  constructor(proto: any, public typeTag: TypeTag) {}

  static LPCoinParser(data: any, typeTag: TypeTag, repo: AptosParserRepo): LPCoin {
    const proto = $.parseStructProto(data, typeTag, repo, LPCoin);
    return new LPCoin(proto, typeTag);
  }

  static makeTag($p: TypeTag[]): StructTag {
    return new StructTag(moduleAddress, moduleName, 'LPCoin', $p);
  }
  async loadFullState(app: $.AppType) {
    this.__app = app;
  }
}
export function loadParsers(repo: AptosParserRepo) {
  repo.addParser(
    '0x796900ebe1a1a54ff9e932f19c548f5c1af5c6e7d34965857ac2f7b1d1ab2cbf::LPCoinV1::LPCoin',
    LPCoin.LPCoinParser
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
  get LPCoin() {
    return LPCoin;
  }
}
