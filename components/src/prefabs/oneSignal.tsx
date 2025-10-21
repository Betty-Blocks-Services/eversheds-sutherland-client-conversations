import { prefab, Icon } from '@betty-blocks/component-sdk';

import { OneSignal } from './structures/OneSignal';

const attributes = {
  category: 'CONTENT',
  icon: Icon.TitleIcon,
  keywords: [''],
};

export default prefab('OneSignal', attributes, undefined, [OneSignal({})]);
