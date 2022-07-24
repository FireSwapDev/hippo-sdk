import { StructTag, getTypeTagFullname, parseTypeTagOrThrow, TypeTag, u8str, strToU8 } from "@manahippo/move-to-ts";
import { HexString } from "aptos";
import * as AptosFramework from "./generated/aptos_framework";


export function typeInfoToTypeTag(typeInfo: AptosFramework.type_info$_.TypeInfo) {
  const fullname =  `${typeInfo.account_address.hex()}::${u8str(typeInfo.module_name)}::${u8str(typeInfo.struct_name)}`;
  return parseTypeTagOrThrow(fullname);
}

export function typeTagToTypeInfo(tag: TypeTag): AptosFramework.type_info$_.TypeInfo {
  const fullname = getTypeTagFullname(tag);
  const [addr, modName, structName] = fullname.split("::");
  return new AptosFramework.type_info$_.TypeInfo({
    account_address: new HexString(addr),
    module_name: strToU8(modName),
    struct_name: strToU8(structName),
  }, new StructTag(AptosFramework.type_info$_.moduleAddress, AptosFramework.type_info$_.moduleName, AptosFramework.type_info$_.TypeInfo.structName, []))
}

export function isTypeInfoSame(ti1: AptosFramework.type_info$_.TypeInfo, ti2: AptosFramework.type_info$_.TypeInfo) {
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