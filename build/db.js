"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const DB = {
    file: path_1.default.join(__dirname, "..", "db.json"),
    data: undefined,
    admin: undefined,
    read: function () {
        const raw = (0, fs_1.readFileSync)(this.file, "utf-8");
        this.data = JSON.parse(raw);
        this.admin = this.data.users.find((x) => x.isAdmin === true);
        return this.data;
    },
    save: function () {
        (0, promises_1.writeFile)(this.file, JSON.stringify(this.data, null, 2));
    },
};
exports.default = DB;
