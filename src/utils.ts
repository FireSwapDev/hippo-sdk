import {
  StructTag,
  getTypeTagFullname,
  parseTypeTagOrThrow,
  TypeTag,
  u8str,
  strToU8,
  AptosParserRepo, parseMoveStructTag, SimpleStructTag, AptosLocalCache
} from "@manahippo/move-to-ts";
import {AptosClient, HexString} from "aptos";
import * as AptosStdlib from "./generated/stdlib";
import * as AptosFramework from "./generated/stdlib";
import {Coin_list} from "./generated/coin_list"
import * as Aptos_std from "./generated/stdlib";
import {Nothing} from "./generated/coin_list/coin_list";
import * as Std from "./generated/stdlib";
import * as $ from "@manahippo/move-to-ts";
import {CoinInfo} from "./generated/stdlib/coin";

export function typeInfoToTypeTag(typeInfo: AptosStdlib.Type_info.TypeInfo) {
  const fullname =  `${typeInfo.account_address.hex()}::${u8str(typeInfo.module_name)}::${u8str(typeInfo.struct_name)}`;
  return parseTypeTagOrThrow(fullname);
}

export function typeTagToTypeInfo(tag: StructTag): AptosStdlib.Type_info.TypeInfo {
  return new AptosStdlib.Type_info.TypeInfo({
    account_address: tag.address,
    module_name: strToU8(tag.module),
    struct_name: strToU8(tag.name),
  }, new StructTag(AptosStdlib.Type_info.moduleAddress, AptosStdlib.Type_info.moduleName, AptosStdlib.Type_info.TypeInfo.structName, []))
}

export function isTypeInfoSame(ti1: AptosStdlib.Type_info.TypeInfo, ti2: AptosStdlib.Type_info.TypeInfo) {
  return ti1.account_address.toShortString() === ti2.account_address.toShortString() &&
    u8str(ti1.module_name) === u8str(ti2.module_name) && 
    u8str(ti1.struct_name) === u8str(ti2.struct_name);
}

export function printResource(resource: any) {
  console.log(JSON.stringify(resource, null, 2));
}

export function printResources(resources: any[]) {
  let i = 0;
  console.log(`Total resource count: ${resources.length}`);
  for (const resource of resources) {
    console.log(`##################${i}`);
    printResource(resource);
    i++;
  }
}
export async function getCoinStoresForAddress(client: AptosClient, address: HexString, repo: AptosParserRepo) {
  const walletResources = await client.getAccountResources(address);
  const stores: AptosFramework.Coin.CoinStore[] = [];
  for(const resource of walletResources) {
    try{
      const typeTag = parseMoveStructTag(resource.type);
      // we only looking for 0x1::Coin::CoinStore
      if(
          typeTag.address.hex() !== AptosFramework.Coin.moduleAddress.hex() ||
          typeTag.module !== AptosFramework.Coin.moduleName ||
          typeTag.name !== AptosFramework.Coin.CoinStore.structName
      ) {
        continue;
      }
      const store = repo.parse(resource.data, typeTag) as unknown as AptosFramework.Coin.CoinStore;
      stores.push(store);
    }
    catch(e) {
      console.warn(`Failed to parse resource of type: ${resource.type}`);
      continue;
    }
  }
  return stores;
}
export function parseCoinInfoListFromCoinList(registry: Coin_list.CoinRegistry, coinList: Coin_list.CoinList,cache: AptosLocalCache):Coin_list.CoinInfo[]{
  const structTag = new StructTag(new HexString("0x1"), "type_info", "TypeInfo", [])
  let coinInfo, coinInfoList, prev, tail, tailKey;
  tail = Aptos_std.Iterable_table.tail_key_(coinList.coin_types, cache, [structTag, new SimpleStructTag(Nothing)]);
  coinInfoList = []
  while (Std.Option.is_some_(tail, cache, [structTag])) {
    {
      tailKey = $.copy(Std.Option.borrow_(tail, cache, [structTag]));
      coinInfo = Aptos_std.Iterable_table.borrow_(registry.type_to_coin_info, $.copy(tailKey), cache, [structTag, new SimpleStructTag(CoinInfo)]);
      coinInfoList.push(coinInfo);
      [, prev, ] = Aptos_std.Iterable_table.borrow_iter_(coinList.coin_types, $.copy(tailKey), cache, [structTag, new SimpleStructTag(Nothing)]);
      tail = $.copy(prev);
    }
  }
  return coinInfoList
}
