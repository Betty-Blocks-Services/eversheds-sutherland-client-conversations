"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirmSearchCombineFilter = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
const options_1 = require("./options");
exports.FirmSearchCombineFilter = (config, descendants = []) => {
    const options = { ...(config.options || options_1.firmSearchCombineFilterOptions) };
    const style = { ...config.style };
    const ref = config.ref ? { ...config.ref } : undefined;
    const label = config.label ? config.label : undefined;
    const optionCategories = config.optionCategories
        ? { ...config.optionCategories }
        : options_1.categories;
    return component_sdk_1.component('FirmSearchCombineFilter', { options, ref, style, label, optionCategories }, descendants);
};
