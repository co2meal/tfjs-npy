"use strict";
/*!
Copyright 2018 Propel http://propel.site/.  All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var liltest_1 = require("liltest");
var tf = require("@tensorflow/tfjs-core");
var npy = require("./npy");
var fs_1 = require("fs");
var expectArraysClose = tf.test_util.expectArraysClose;
function load(fn) {
    return __awaiter(this, void 0, void 0, function () {
        var b, ab;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    b = fs_1.readFileSync(__dirname + "/testdata/" + fn, null);
                    ab = bufferToArrayBuffer(b);
                    return [4, npy.parse(ab)];
                case 1: return [2, _a.sent()];
            }
        });
    });
}
function bufferToArrayBuffer(b) {
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}
liltest_1.test(function npy_parse() {
    return __awaiter(this, void 0, void 0, function () {
        var t;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, load("1.npy")];
                case 1:
                    t = _a.sent();
                    liltest_1.assertEqual(t.dataSync(), [1.5, 2.5]);
                    liltest_1.assertEqual(t.shape, [2]);
                    liltest_1.assertEqual(t.dtype, "float32");
                    return [4, load("2.npy")];
                case 2:
                    t = _a.sent();
                    liltest_1.assertEqual(t.dataSync(), [1.5, 43, 13, 2.5]);
                    liltest_1.assertEqual(t.shape, [2, 2]);
                    liltest_1.assertEqual(t.dtype, "float32");
                    return [4, load("3.npy")];
                case 3:
                    t = _a.sent();
                    liltest_1.assertEqual(t.dataSync(), [1, 2, 3, 4, 5, 6]);
                    liltest_1.assertEqual(t.shape, [1, 2, 3]);
                    liltest_1.assertEqual(t.dtype, "int32");
                    return [4, load("4.npy")];
                case 4:
                    t = _a.sent();
                    expectArraysClose(t.dataSync(), new Float32Array([0.1, 0.2]));
                    liltest_1.assertEqual(t.shape, [2]);
                    liltest_1.assertEqual(t.dtype, "float32");
                    return [4, load("uint8.npy")];
                case 5:
                    t = _a.sent();
                    expectArraysClose(t.dataSync(), new Int32Array([0, 127]));
                    liltest_1.assertEqual(t.shape, [2]);
                    liltest_1.assertEqual(t.dtype, "int32");
                    return [2];
            }
        });
    });
});
liltest_1.test(function npy_serialize() {
    return __awaiter(this, void 0, void 0, function () {
        var t, ab, tt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t = tf.tensor([1.5, 2.5]);
                    return [4, npy.serialize(t)];
                case 1:
                    ab = _a.sent();
                    tt = npy.parse(ab);
                    expectArraysClose(t.dataSync(), tt.dataSync());
                    return [2];
            }
        });
    });
});
//# sourceMappingURL=npy_test.js.map