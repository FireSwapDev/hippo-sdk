import * as $ from '@manahippo/move-to-ts';
import { AptosDataCache, AptosParserRepo, DummyCache, AptosLocalCache } from '@manahippo/move-to-ts';
import { U8, U64, U128 } from '@manahippo/move-to-ts';
import { u8, u64, u128 } from '@manahippo/move-to-ts';
import { TypeParamDeclType, FieldDeclType } from '@manahippo/move-to-ts';
import { AtomicTypeTag, StructTag, TypeTag, VectorTag, SimpleStructTag } from '@manahippo/move-to-ts';
import { HexString, AptosClient, AptosAccount, TxnBuilderTypes, Types } from 'aptos';
import * as Stdlib from '../stdlib';
export const packageName = 'Econia';
export const moduleAddress = new HexString('0xa61e1e86e9f596e483283727d2739ba24b919012720648c29380f9cd0a96c11a');
export const moduleName = 'capability';

export const E_NOT_ECONIA: U64 = u64('0');

export class EconiaCapability {
  static moduleAddress = moduleAddress;
  static moduleName = moduleName;
  __app: $.AppType | null = null;
  static structName: string = 'EconiaCapability';
  static typeParameters: TypeParamDeclType[] = [];
  static fields: FieldDeclType[] = [];

  constructor(proto: any, public typeTag: TypeTag) {}

  static EconiaCapabilityParser(data: any, typeTag: TypeTag, repo: AptosParserRepo): EconiaCapability {
    const proto = $.parseStructProto(data, typeTag, repo, EconiaCapability);
    return new EconiaCapability(proto, typeTag);
  }

  static getTag(): StructTag {
    return new StructTag(moduleAddress, moduleName, 'EconiaCapability', []);
  }
  async loadFullState(app: $.AppType) {
    this.__app = app;
  }
}
export function get_econia_capability_(account: HexString, $c: AptosDataCache): EconiaCapability {
  if (
    !(
      Stdlib.Signer.address_of_(account, $c).hex() ===
      new HexString('0xa61e1e86e9f596e483283727d2739ba24b919012720648c29380f9cd0a96c11a').hex()
    )
  ) {
    throw $.abortCode($.copy(E_NOT_ECONIA));
  }
  return new EconiaCapability({}, new SimpleStructTag(EconiaCapability));
}

export function loadParsers(repo: AptosParserRepo) {
  repo.addParser(
    '0xa61e1e86e9f596e483283727d2739ba24b919012720648c29380f9cd0a96c11a::capability::EconiaCapability',
    EconiaCapability.EconiaCapabilityParser
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
  get EconiaCapability() {
    return EconiaCapability;
  }
}
