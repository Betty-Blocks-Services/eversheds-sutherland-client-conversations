import {
  buttongroup,
  filter,
  hideIf,
  modelAndRelation,
  option,
  property,
  showIf,
  variable,
} from '@betty-blocks/component-sdk';
import { advanced } from './advanced';
import { validation } from './validation';
import { styles } from './styles';
import { getAllowedKindsByType } from '../../../helpers/getAllowedKindsByType';

const { allowedKinds, allowedInputKinds } = getAllowedKindsByType('radio');

export const options = {
  actionVariableId: option('ACTION_JS_VARIABLE', {
    label: 'Action input variable',
    value: '',
    configuration: {
      condition: showIf('property', 'EQ', ''),
    },
  }),
  property: property('Property', {
    value: '',
    showInReconfigure: true,
    configuration: {
      allowedKinds,
      disabled: true,
      condition: hideIf('property', 'EQ', ''),
    },
  }),

  label: variable('Label', {
    value: ['Radio'],
    configuration: { allowFormatting: false, allowPropertyName: true },
  }),
  value: variable('Value', {
    value: [''],
    configuration: { allowFormatting: false },
  }),
  optionType: buttongroup(
    'Option type',
    [
      ['Model', 'model'],
      ['Manual', 'manual'],
    ],
    {
      value: 'model',
    },
  ),
  manualValues: variable('Options', {
    configuration: {
      as: 'MULTILINE',
      condition: showIf('optionType', 'EQ', 'manual'),
    },
  }),
  model: modelAndRelation('Model', {
    value: '',
    configuration: {
      condition: hideIf('optionType', 'EQ', 'manual'),
    },
  }),
  filter: filter('Filter', {
    value: {},
    configuration: {
      dependsOn: 'model',
      condition: hideIf('optionType', 'EQ', 'manual'),
    },
  }),

  orderBy: property('Order by', {
    value: '',
    configuration: {
      dependsOn: 'model',
      condition: hideIf('optionType', 'EQ', 'manual'),
    },
  }),

  labelProperty: property('Label for options', {
    value: '',
    configuration: { condition: hideIf('optionType', 'EQ', 'manual') },
  }),

  order: buttongroup(
    'Sort order',
    [
      ['Ascending', 'asc'],
      ['Descending', 'desc'],
    ],
    { value: 'asc', configuration: { condition: hideIf('orderBy', 'EQ', '') } },
  ),

  showError: buttongroup(
    'Error message',
    [
      ['Built in', 'built-in'],
      ['Interaction', 'interaction'],
    ],
    {
      value: 'built-in',
      configuration: { condition: showIf('optionType', 'EQ', 'model') },
    },
  ),
  ...validation,
  ...styles,
  ...advanced,
};
