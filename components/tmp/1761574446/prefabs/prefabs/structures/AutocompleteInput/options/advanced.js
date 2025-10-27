"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advanced = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
// eslint-disable-next-line import/prefer-default-export
exports.advanced = {
    errorType: component_sdk_1.buttongroup('Error message', [
        ['Built in', 'built-in'],
        ['Interaction', 'interaction'],
    ], { value: 'built-in' }),
    nameAttribute: component_sdk_1.variable('name attribute', {
        value: [],
        configuration: { condition: component_sdk_1.showIf('nameAttribute', 'EQ', 'never') },
    }),
    dataComponentAttribute: component_sdk_1.variable('Test attribute', {
        value: [],
    }),
};
