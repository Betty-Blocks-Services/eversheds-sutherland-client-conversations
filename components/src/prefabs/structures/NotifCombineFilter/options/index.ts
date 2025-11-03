import { variable, toggle, model } from '@betty-blocks/component-sdk';
import { advanced } from '../../advanced';

export const categories = [
  {
    label: 'Advanced Options',
    expanded: false,
    members: ['dataComponentAttribute'],
  },
];

export const notifCombineFilterOptions = {
  modelId: model('Model'),
  debugLogging: toggle('Debug logging'),

  ...advanced('NotifCombineFilter'),
};
