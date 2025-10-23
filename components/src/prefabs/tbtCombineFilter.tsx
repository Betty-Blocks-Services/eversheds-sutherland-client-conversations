import { prefab, Icon } from '@betty-blocks/component-sdk';

import { TbtCombineFilter } from './structures/TbtCombineFilter';

const attributes = {
  category: 'CONTENT',
  icon: Icon.TitleIcon,
  keywords: [''],
};

export default prefab('TbtCombineFilter', attributes, undefined, [TbtCombineFilter({})]);
