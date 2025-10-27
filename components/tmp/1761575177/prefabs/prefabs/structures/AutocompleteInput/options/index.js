"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
const advanced_1 = require("./advanced");
const styles_1 = require("./styles");
const validation_1 = require("./validation");
const getAllowedKindsByType_1 = require("../../../helpers/getAllowedKindsByType");
const { allowedKinds, allowedInputKinds } = getAllowedKindsByType_1.getAllowedKindsByType('autocomplete');
exports.options = {
    actionVariableId: component_sdk_1.option('ACTION_JS_VARIABLE', {
        label: 'Action input variable',
        value: '',
        configuration: {
            ...(allowedInputKinds ? { allowedKinds: allowedInputKinds } : undefined),
            condition: component_sdk_1.showIf('property', 'EQ', ''),
        },
    }),
    property: component_sdk_1.property('Property', {
        value: '',
        showInReconfigure: true,
        configuration: {
            allowedKinds,
            disabled: true,
            condition: component_sdk_1.hideIf('property', 'EQ', ''),
        },
    }),
    label: component_sdk_1.variable('Label', {
        value: [],
        configuration: { allowFormatting: false, allowPropertyName: true },
    }),
    value: component_sdk_1.variable('Value', {
        value: [],
        configuration: { allowFormatting: false },
    }),
    optionType: component_sdk_1.buttongroup('Option type', [
        ['Model', 'model'],
        ['Property', 'property'],
        ['Variable', 'variable'],
    ], {
        value: 'variable',
        configuration: {
            condition: component_sdk_1.showIf('optionType', 'EQ', 'never'),
        },
    }),
    model: component_sdk_1.modelAndRelation('Model', {
        value: '',
        configuration: {
            condition: component_sdk_1.showIf('optionType', 'EQ', 'variable'),
        },
    }),
    filter: component_sdk_1.option('FILTER', {
        label: 'Filter for options',
        value: {},
        configuration: {
            dependsOn: 'model',
            condition: component_sdk_1.hideIf('optionType', 'EQ', 'property'),
        },
    }),
    groupBy: component_sdk_1.property('Group by for options', {
        value: '',
        configuration: {
            dependsOn: 'model',
            condition: component_sdk_1.hideIf('optionType', 'EQ', 'property'),
        },
    }),
    orderBy: component_sdk_1.property('Order by for options', {
        value: '',
        configuration: {
            dependsOn: 'model',
            condition: component_sdk_1.hideIf('optionType', 'EQ', 'property'),
        },
    }),
    labelProperty: component_sdk_1.property('Label for options', {
        value: '',
        configuration: {
            allowedKinds: [
                'BELONGS_TO',
                'DECIMAL',
                'DECIMAL_EXPRESSION',
                'EMAIL',
                'EMAIL_ADDRESS',
                'IBAN',
                'INTEGER',
                'INTEGER_EXPRESSION',
                'MINUTES',
                'MINUTES_EXPRESSION',
                'PHONE_NUMBER',
                'PRICE',
                'PRICE_EXPRESSION',
                'SERIAL',
                'STRING',
                'STRING_EXPRESSION',
                'TEXT',
                'TEXT_EXPRESSION',
                'URL',
                'ZIPCODE',
            ],
            condition: component_sdk_1.hideIf('optionType', 'EQ', 'property'),
        },
    }),
    order: component_sdk_1.buttongroup('Sort order', [
        ['Ascending', 'asc'],
        ['Descending', 'desc'],
    ], {
        value: 'asc',
        configuration: {
            condition: component_sdk_1.hideIf('orderBy', 'EQ', ''),
        },
    }),
    ...validation_1.validation,
    ...styles_1.styles,
    ...advanced_1.advanced,
};
