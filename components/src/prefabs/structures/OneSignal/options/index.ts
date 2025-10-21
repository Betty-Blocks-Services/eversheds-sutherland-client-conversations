import { variable } from '@betty-blocks/component-sdk';
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

  alreadyGrantedMessage: variable('Already granted message', {
    value: ['Notifications already granted'],
  }),
  blockedMessage: variable('Blocked message', {
    value: ['Notifications blocked'],
  }),

  ...advanced('OneSignal'),
};
