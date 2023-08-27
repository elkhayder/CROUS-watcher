"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareObjects = void 0;
const CompareObjects = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};
exports.CompareObjects = CompareObjects;
