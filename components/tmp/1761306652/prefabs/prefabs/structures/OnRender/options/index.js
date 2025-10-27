"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRenderOptions = exports.categories = void 0;
const advanced_1 = require("../../advanced");
exports.categories = [
    {
        label: 'Advanced Options',
        expanded: false,
        members: ['dataComponentAttribute'],
    },
];
exports.onRenderOptions = {
    ...advanced_1.advanced('OnRender'),
};
