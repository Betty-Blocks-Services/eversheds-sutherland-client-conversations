import { prefab, Icon } from '@betty-blocks/component-sdk';

import { AuditLogCombineFilter } from './structures/AuditLogCombineFilter';

const attributes = {
  category: 'CONTENT',
  icon: Icon.TitleIcon,
  keywords: [''],
};

export default prefab('AuditLogCombineFilter', attributes, undefined, [AuditLogCombineFilter({})]);
