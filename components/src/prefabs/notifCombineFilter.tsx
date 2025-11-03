import { prefab, Icon } from '@betty-blocks/component-sdk';

import { NotifCombineFilter } from './structures/NotifCombineFilter';

const attributes = {
  category: 'CONTENT',
  icon: Icon.TitleIcon,
  keywords: [''],
};

export default prefab('NotifCombineFilter', attributes, undefined, [NotifCombineFilter({})]);
