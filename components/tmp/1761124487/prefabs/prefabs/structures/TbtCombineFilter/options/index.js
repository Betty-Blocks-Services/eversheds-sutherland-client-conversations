"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tbtCombineFilterOptions = exports.categories = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
const advanced_1 = require("../../advanced");
exports.categories = [
    {
        label: 'Advanced Options',
        expanded: false,
        members: ['dataComponentAttribute'],
    },
];
exports.tbtCombineFilterOptions = {
    // eslint-disable-next-line no-undef
    debugLogging: component_sdk_1.toggle('Debug Logging'),
    ...advanced_1.advanced('TbtCombineFilter'),
};
