import { prefab, Icon } from '@betty-blocks/component-sdk';

import { DataList } from './structures/Datalist';

const attributes = {
  category: 'CONTENT',
  icon: Icon.TitleIcon,
  keywords: [''],
};

export default prefab('Datalist', attributes, undefined, [DataList({})]);
