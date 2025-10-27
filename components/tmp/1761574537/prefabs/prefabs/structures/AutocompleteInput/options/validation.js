"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
exports.validation = {
    required: component_sdk_1.toggle('Required', { value: false }),
    validationValueMissing: component_sdk_1.variable('Value required message', {
        value: ['This field is required'],
        configuration: {
            condition: component_sdk_1.showIfTrue('required'),
        },
    }),
    closeOnSelect: component_sdk_1.toggle('Close dropdown after select', { value: true }),
    disabled: component_sdk_1.toggle('Disabled', { value: false }),
    placeholder: component_sdk_1.variable('Placeholder'),
    helperText: component_sdk_1.variable('Helper text'),
    noOptionsText: component_sdk_1.variable('No options text', { value: ['No options'] }),
    type: component_sdk_1.text('Type', {
        value: '',
        configuration: { condition: component_sdk_1.showIf('type', 'EQ', 'never') },
    }),
};
