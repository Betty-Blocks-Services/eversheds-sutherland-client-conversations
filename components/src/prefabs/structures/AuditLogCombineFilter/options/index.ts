import { variable, model, toggle } from '@betty-blocks/component-sdk';
import { advanced } from '../../advanced';

export const categories = [
  {
    label: 'Advanced Options',
    expanded: false,
    members: ['dataComponentAttribute'],
  },
];

export const auditLogCombineFilterOptions = {
  modelId: model('Model'),
  debugLogging: toggle('Debug logging'),

  ...advanced('AuditLogCombineFilter'),
};
