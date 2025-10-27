"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutocompleteInput = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
const utils_1 = require("../../../utils");
const index_1 = require("./options/index");
const addChild_1 = require("../SelectInput/options/addChild");
exports.AutocompleteInput = (config, descendants = []) => {
    const options = { ...(config.options || index_1.options) };
    const style = { ...config.style };
    const ref = config.ref ? { ...config.ref } : undefined;
    const label = config.label ? config.label : undefined;
    const categories = [
        {
            label: 'Validation Options',
            expanded: false,
            members: ['required', 'validationValueMissing'],
        },
        {
            label: 'Styling',
            expanded: false,
            members: [
                'hideLabel',
                'backgroundColor',
                'backgroundColorChip',
                'borderColor',
                'borderHoverColor',
                'borderFocusColor',
                'labelColor',
                'textColor',
                'textColorChip',
                'placeHolderColor',
                'helperColor',
                'errorColor',
            ],
        },
        {
            label: 'Advanced Options',
            expanded: false,
            members: ['errorType', 'nameAttribute', 'dataComponentAttribute'],
        },
    ];
    if (config.type) {
        options.type = utils_1.updateOption(options.type, { value: config.type });
    }
    if (config.inputLabel) {
        options.label = utils_1.updateOption(options.label, { value: [config.inputLabel] });
    }
    return component_sdk_1.component('AutocompleteInput', {
        options,
        style,
        ref,
        label,
        optionCategories: categories,
        optionTemplates: {
            addChild: {
                options: addChild_1.addChildOptions('autocomplete'),
                optionEvents: addChild_1.optionEvents,
            },
        },
    }, descendants);
};
