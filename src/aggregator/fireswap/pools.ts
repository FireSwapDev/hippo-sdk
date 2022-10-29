import { RawStruct } from '../types';

export const POOLS: RawStruct[][] = [
  [
    { address: '0x1', module: 'aptos_coin', name: 'AptosCoin' },
    {
      address: '0x317df9dda493d7cb9b8d5597e64e0dac1a519376fa8fff9cb485a778638dedc3',
      module: 'FireMasterChefV1',
      name: 'FIRE'
    }
  ],
  [
    { address: '0x1', module: 'aptos_coin', name: 'AptosCoin' },
    {
      address: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa',
      module: 'asset',
      name: 'USDC'
    }
  ],
  [
    {
      address: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa',
      module: 'asset',
      name: 'USDC'
    },
    {
      address: '0x317df9dda493d7cb9b8d5597e64e0dac1a519376fa8fff9cb485a778638dedc3',
      module: 'FireMasterChefV1',
      name: 'FIRE'
    }
  ]
];
