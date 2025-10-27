"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_sdk_1 = require("@betty-blocks/component-sdk");
const SelectInput_1 = require("./structures/SelectInput");
const attributes = {
    category: 'FORM',
    icon: component_sdk_1.Icon.SelectIcon,
    keywords: ['Form', 'input'],
};
exports.default = component_sdk_1.prefab('Select', attributes, undefined, [
    SelectInput_1.SelectInput({
        inputLabel: 'Select option',
    }),
]);
