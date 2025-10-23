import { toggle } from '@betty-blocks/component-sdk';
import { advanced } from '../../advanced';

export const categories = [
  {
    label: 'Advanced Options',
    expanded: false,
    members: ['dataComponentAttribute'],
  },
];

export const tbtCombineFilterAdminOptions = {
  debugLoggin: toggle('Debug Logging'),
  ...advanced('TbtCombineFilterAdmin'),
};
