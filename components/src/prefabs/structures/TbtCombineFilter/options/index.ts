import { toggle, model } from '@betty-blocks/component-sdk';
import { advanced } from '../../advanced';

export const categories = [
  {
    label: 'Advanced Options',
    expanded: false,
    members: ['dataComponentAttribute'],
  },
];

export const tbtCombineFilterOptions = {
  // eslint-disable-next-line no-undef
  modelId: model('Model'),
  debugLogging: toggle('Debug logging'),

  ...advanced('TbtCombineFilter'),
};
