"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
exports.validation = {
    required: component_sdk_1.toggle('Required'),
    validationValueMissing: component_sdk_1.variable('Value required message', {
        value: ['This field is required'],
        configuration: {
            condition: component_sdk_1.showIfTrue('required'),
        },
    }),
    disabled: component_sdk_1.toggle('Disabled'),
    helperText: component_sdk_1.variable('Helper text'),
};
