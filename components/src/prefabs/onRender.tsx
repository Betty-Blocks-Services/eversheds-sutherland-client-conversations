import { prefab, Icon } from '@betty-blocks/component-sdk';

import { OnRender } from './structures/OnRender';

const attributes = {
  category: 'CONTENT',
  icon: Icon.TitleIcon,
  keywords: [''],
};

export default prefab('OnRender', attributes, undefined, [OnRender({})]);
