import { variable, toggle } from '@betty-blocks/component-sdk';
import { advanced } from '../../advanced';

export const categories = [
  {
    label: 'Advanced Options',
    expanded: false,
    members: ['dataComponentAttribute'],
  },
];

export const oneSignalOptions = {
  appId: variable('OneSignal App ID'),
  debugLogging: toggle('Debug Logging'),

  ...advanced('OneSignal'),
};
