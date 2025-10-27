import { prefab, Icon } from '@betty-blocks/component-sdk';

import { AutocompleteInput } from './structures/AutocompleteInput';

const attributes = {
  category: 'CONTENT',
  icon: Icon.TitleIcon,
  keywords: [''],
};

export default prefab('AutocompleteInput', attributes, undefined, [AutocompleteInput({})]);
