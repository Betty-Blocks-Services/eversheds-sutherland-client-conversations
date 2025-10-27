"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_sdk_1 = require("@betty-blocks/component-sdk");
const FirmSearchCombineFilter_1 = require("./structures/FirmSearchCombineFilter");
const attributes = {
    category: 'CONTENT',
    icon: component_sdk_1.Icon.TitleIcon,
    keywords: [''],
};
exports.default = component_sdk_1.prefab('FirmSearchCombineFilter', attributes, undefined, [FirmSearchCombineFilter_1.FirmSearchCombineFilter({})]);
