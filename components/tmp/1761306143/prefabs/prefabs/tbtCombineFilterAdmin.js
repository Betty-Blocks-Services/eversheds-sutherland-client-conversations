"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_sdk_1 = require("@betty-blocks/component-sdk");
const TbtCombineFilterAdmin_1 = require("./structures/TbtCombineFilterAdmin");
const attributes = {
    category: 'CONTENT',
    icon: component_sdk_1.Icon.TitleIcon,
    keywords: [''],
};
exports.default = component_sdk_1.prefab('TbtCombineFilterAdmin', attributes, undefined, [TbtCombineFilterAdmin_1.TbtCombineFilterAdmin({})]);
