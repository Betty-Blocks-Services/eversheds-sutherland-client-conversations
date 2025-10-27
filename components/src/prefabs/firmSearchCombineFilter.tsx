import { prefab, Icon } from '@betty-blocks/component-sdk';

import { FirmSearchCombineFilter } from './structures/FirmSearchCombineFilter';

const attributes = {
  category: 'CONTENT',
  icon: Icon.TitleIcon,
  keywords: [''],
};

export default prefab('FirmSearchCombineFilter', attributes, undefined, [FirmSearchCombineFilter({})]);
