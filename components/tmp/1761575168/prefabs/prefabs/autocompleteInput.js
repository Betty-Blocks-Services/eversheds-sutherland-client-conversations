"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_sdk_1 = require("@betty-blocks/component-sdk");
const AutocompleteInput_1 = require("./structures/AutocompleteInput");
const attributes = {
    category: 'CONTENT',
    icon: component_sdk_1.Icon.TitleIcon,
    keywords: [''],
};
exports.default = component_sdk_1.prefab('AutocompleteInput', attributes, undefined, [AutocompleteInput_1.AutocompleteInput({})]);
