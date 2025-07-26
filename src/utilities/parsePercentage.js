"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parsePercentage(value) {
    return typeof value === 'string' && value.trim().endsWith('%')
        ? parseFloat(value.trim()) / 100
        : parseFloat(value);
}
exports.default = parsePercentage;
