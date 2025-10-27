"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionEvents = exports.addChildOptions = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
const getAllowedKindsByType_1 = require("../../../helpers/getAllowedKindsByType");
exports.addChildOptions = (type) => {
    const { allowedKinds, actionInputVariableKind, allowedInputKinds } = getAllowedKindsByType_1.getAllowedKindsByType(type);
    return component_sdk_1.optionTemplateOptions({
        propertyBased: component_sdk_1.buttongroup('Type', [
            ['Property-based', 'true'],
            ['Non-property-based', 'false'],
        ], {
            value: 'true',
        }),
        property: component_sdk_1.property('Property', {
            value: '',
            configuration: {
                allowedKinds,
                allowFormatting: false,
                allowRelations: true,
                condition: component_sdk_1.showIf('propertyBased', 'EQ', 'true'),
                createActionInputVariable: {
                    type: actionInputVariableKind,
                },
            },
        }),
        actionVariableId: component_sdk_1.option('ACTION_JS_VARIABLE', {
            label: 'Action input variable',
            value: '',
            configuration: {
                ...(allowedInputKinds
                    ? { allowedKinds: allowedInputKinds }
                    : undefined),
                condition: component_sdk_1.showIf('propertyBased', 'EQ', 'false'),
                createActionInputVariable: {
                    type: actionInputVariableKind,
                },
            },
        }),
    });
};
exports.optionEvents = {
    onChange: {
        propertyBased: [
            component_sdk_1.setOptionToDefaultValue({ target: 'property' }),
            component_sdk_1.setOptionToDefaultValue({ target: 'actionVariableId' }),
            component_sdk_1.setOptionToDefaultValue({ target: 'value' }),
            component_sdk_1.setOptionToDefaultValue({ target: 'label' }),
            component_sdk_1.setOptionToDefaultValue({ target: 'model' }),
        ],
        property: [
            component_sdk_1.setVariableOption({ target: 'value', format: 'propertyValue' }),
            component_sdk_1.setVariableOption({ target: 'label', format: 'propertyLabel' }),
            component_sdk_1.setActionJSInputVariableOption({ target: 'actionVariableId' }),
            component_sdk_1.setModelOption({ target: 'model' }),
            component_sdk_1.setButtonGroupOption({
                target: 'optionType',
                conditions: [
                    { condition: 'property_is_relation', result: 'model' },
                    { condition: 'property_is_property', result: 'property' },
                    { condition: 'value_is_empty', result: 'variable' },
                ],
            }),
        ],
        actionVariableId: [
            component_sdk_1.setVariableOption({ target: 'label', format: 'static' }),
        ],
    },
};
