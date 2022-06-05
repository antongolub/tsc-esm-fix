"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rfoo = exports.filename = exports.dirname = exports.qux = exports.foo2 = exports.foo1 = exports.foobaz = exports.e2bar = exports.e2foo = exports.es4 = exports.es3 = exports.e2 = exports.m1x = exports.m1 = exports.e1x = exports.e1 = exports.json = void 0;
var module_1 = require("module");
var require = (0, module_1.createRequire)(import.meta.url);
var foo_1 = require("./foo");
require("./bar");
var e1def = __importStar(require("e1/a/b/c"));
var e1root = __importStar(require("e1"));
var json_data_json_1 = require("./json-data.json");
Object.defineProperty(exports, "json", { enumerable: true, get: function () { return __importDefault(json_data_json_1).default; } });
var e1 = e1def.e1;
exports.e1 = e1;
var e1x = e1root.e1;
exports.e1x = e1x;
var m1_1 = require("m1");
Object.defineProperty(exports, "m1", { enumerable: true, get: function () { return m1_1.m1; } });
var index_1 = require("m1/index");
Object.defineProperty(exports, "m1x", { enumerable: true, get: function () { return index_1.m1; } });
var e2_1 = require("e2");
Object.defineProperty(exports, "e2", { enumerable: true, get: function () { return e2_1.e2; } });
var index_2 = require("e2/index");
Object.defineProperty(exports, "es3", { enumerable: true, get: function () { return index_2.e2; } });
var alias_1 = require("e2/alias");
Object.defineProperty(exports, "es4", { enumerable: true, get: function () { return alias_1.e2; } });
var foo_2 = require("e2/foo");
Object.defineProperty(exports, "e2foo", { enumerable: true, get: function () { return foo_2.e2foo; } });
var bar_bundle_1 = require("e2/bar-bundle");
Object.defineProperty(exports, "e2bar", { enumerable: true, get: function () { return bar_bundle_1.e2bar; } });
__exportStar(require("./foo"), exports);
__exportStar(require("./baz"), exports);
__exportStar(require("./q/u/x"), exports);
exports.foobaz = foo_1.foo + 'baz';
var foo_js_1 = require("./foo.js");
Object.defineProperty(exports, "foo1", { enumerable: true, get: function () { return foo_js_1.foo; } });
exports.foo2 = await Promise.resolve().then(function () { return __importStar(require('./foo')); });
var qux_js_1 = require("./qux.js");
Object.defineProperty(exports, "qux", { enumerable: true, get: function () { return qux_js_1.qux; } });
exports.dirname = __dirname;
exports.filename = __filename;
exports.rfoo = require('e1/a/b/c');
__exportStar(require("./only-types"), exports);
console.log(exports.foobaz);
