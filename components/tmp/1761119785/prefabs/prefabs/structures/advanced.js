"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advanced = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
exports.advanced = (value) => {
    return {
        dataComponentAttribute: component_sdk_1.variable('Test attribute', {
            value: [value],
        }),
    };
};
