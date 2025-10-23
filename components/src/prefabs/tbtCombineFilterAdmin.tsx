import { prefab, Icon } from '@betty-blocks/component-sdk';

import { TbtCombineFilterAdmin } from './structures/TbtCombineFilterAdmin';

const attributes = {
  category: 'CONTENT',
  icon: Icon.TitleIcon,
  keywords: [''],
};

export default prefab('TbtCombineFilterAdmin', attributes, undefined, [TbtCombineFilterAdmin({})]);
