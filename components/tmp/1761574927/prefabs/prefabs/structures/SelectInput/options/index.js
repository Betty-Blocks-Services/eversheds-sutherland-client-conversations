"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.optionsResolver = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
const advanced_1 = require("./advanced");
const validation_1 = require("./validation");
const styles_1 = require("./styles");
const getAllowedKindsByType_1 = require("../../../helpers/getAllowedKindsByType");
exports.optionsResolver = (type) => {
    const { allowedKinds, allowedInputKinds } = getAllowedKindsByType_1.getAllowedKindsByType(type);
    return {
        actionVariableId: component_sdk_1.option('ACTION_JS_VARIABLE', {
            label: 'Action input variable',
            value: '',
            configuration: {
                allowedKinds: allowedInputKinds,
                condition: component_sdk_1.showIf('property', 'EQ', ''),
            },
        }),
        property: component_sdk_1.property('Property', {
            value: '',
            configuration: {
                allowedKinds,
                allowRelations: true,
                disabled: true,
                condition: component_sdk_1.hideIf('property', 'EQ', ''),
            },
        }),
        label: component_sdk_1.variable('Label', {
            value: ['Select'],
            configuration: { allowFormatting: false, allowPropertyName: true },
        }),
        value: component_sdk_1.variable('Value', {
            value: [''],
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
        filter: component_sdk_1.filter('Filter', {
            value: {},
            configuration: {
                dependsOn: 'model',
                condition: component_sdk_1.hideIf('optionType', 'EQ', 'property'),
            },
        }),
        orderBy: component_sdk_1.property('Order by', {
            value: '',
            configuration: {
                dependsOn: 'model',
                condition: component_sdk_1.hideIf('optionType', 'EQ', 'property'),
            },
        }),
        labelProperty: component_sdk_1.property('Label for options', {
            value: '',
            configuration: { condition: component_sdk_1.hideIf('optionType', 'EQ', 'property') },
        }),
        order: component_sdk_1.buttongroup('Sort order', [
            ['Ascending', 'asc'],
            ['Descending', 'desc'],
        ], {
            value: 'asc',
            configuration: { condition: component_sdk_1.hideIf('orderBy', 'EQ', '') },
        }),
        placeholderLabel: component_sdk_1.variable('Placeholder', { value: [''] }),
        allowClear: component_sdk_1.toggle('Allow user to empty selection'),
        clearLabel: component_sdk_1.variable('Empty selection label', {
            value: ['Clear selection'],
            configuration: { condition: component_sdk_1.showIf('allowClear', 'EQ', true) },
        }),
        ...validation_1.validation,
        ...styles_1.styles,
        ...advanced_1.advanced,
    };
};
exports.options = exports.optionsResolver('select');
