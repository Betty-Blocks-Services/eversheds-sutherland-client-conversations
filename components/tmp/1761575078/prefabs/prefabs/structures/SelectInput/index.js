"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectInput = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
const index_1 = require("./options/index");
const utils_1 = require("../../../utils");
const addChild_1 = require("./options/addChild");
exports.SelectInput = (config, children = []) => {
    const options = { ...(config.options || index_1.options) };
    const style = { ...config.style };
    const ref = config.ref ? { ...config.ref } : undefined;
    const label = config.label ? config.label : 'Select';
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
                'borderColor',
                'borderHoverColor',
                'borderFocusColor',
                'labelColor',
                'textColor',
                'placeholderColor',
                'helperColor',
                'errorColor',
            ],
        },
        {
            label: 'Advanced Options',
            expanded: false,
            members: ['dataComponentAttribute'],
        },
    ];
    if (config.inputLabel) {
        options.label = utils_1.updateOption(options.label, { value: [config.inputLabel] });
    }
    return component_sdk_1.component('SelectInput', {
        options,
        style,
        ref,
        label,
        optionCategories: categories,
        optionTemplates: {
            addChild: {
                options: addChild_1.addChildOptions('select'),
                optionEvents: addChild_1.optionEvents,
            },
        },
    }, children);
};
