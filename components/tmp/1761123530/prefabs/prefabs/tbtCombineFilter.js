"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_sdk_1 = require("@betty-blocks/component-sdk");
const TbtCombineFilter_1 = require("./structures/TbtCombineFilter");
const attributes = {
    category: 'CONTENT',
    icon: component_sdk_1.Icon.TitleIcon,
    keywords: [''],
};
exports.default = component_sdk_1.prefab('TbtCombineFilter', attributes, undefined, [TbtCombineFilter_1.TbtCombineFilter({})]);
