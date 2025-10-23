"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oneSignalOptions = exports.categories = void 0;
const component_sdk_1 = require("@betty-blocks/component-sdk");
const advanced_1 = require("../../advanced");
exports.categories = [
    {
        label: 'Advanced Options',
        expanded: false,
        members: ['dataComponentAttribute'],
    },
];
exports.oneSignalOptions = {
    appId: component_sdk_1.variable('OneSignal App ID'),
    alreadyGrantedMessage: component_sdk_1.variable('Already granted message', {
        value: ['Notifications already granted'],
    }),
    blockedMessage: component_sdk_1.variable('Blocked message', {
        value: ['Notifications blocked'],
    }),
    ...advanced_1.advanced('OneSignal'),
};
