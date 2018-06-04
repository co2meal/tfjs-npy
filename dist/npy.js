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
var tf = require("@tensorflow/tfjs-core");
function serialize(tensor) {
    return __awaiter(this, void 0, void 0, function () {
        var descr, magicStr, versionStr, shapeStr, _a, d, fo, s, header, unpaddedLength, padding, bytesPerElement, dataLen, totalSize, ab, view, pos, data, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    descr = new Map([["float32", "<f4"], ["int32", "<i4"]]).get(tensor.dtype);
                    magicStr = "NUMPY";
                    versionStr = "\x01\x00";
                    shapeStr = String(tensor.shape.join(",")) + ",";
                    _a = [descr, "False", shapeStr], d = _a[0], fo = _a[1], s = _a[2];
                    header = "{'descr': '" + d + "', 'fortran_order': " + fo + ", 'shape': (" + s + "), }";
                    unpaddedLength = 1 + magicStr.length + versionStr.length + 2 + header.length;
                    padding = " ".repeat((16 - unpaddedLength % 16) % 16);
                    header += padding;
                    assertEqual((unpaddedLength + padding.length) % 16, 0);
                    bytesPerElement = 4;
                    dataLen = bytesPerElement * numEls(tensor.shape);
                    totalSize = unpaddedLength + padding.length + dataLen;
                    ab = new ArrayBuffer(totalSize);
                    view = new DataView(ab);
                    pos = 0;
                    view.setUint8(pos++, 0x93);
                    pos = writeStrToDataView(view, magicStr + versionStr, pos);
                    view.setUint16(pos, header.length, true);
                    pos += 2;
                    pos = writeStrToDataView(view, header, pos);
                    return [4, tensor.data()];
                case 1:
                    data = _b.sent();
                    assertEqual(data.length, numEls(tensor.shape));
                    for (i = 0; i < data.length; i++) {
                        switch (tensor.dtype) {
                            case "float32":
                                view.setFloat32(pos, data[i], true);
                                pos += 4;
                                break;
                            case "int32":
                                view.setInt32(pos, data[i], true);
                                pos += 4;
                                break;
                            default:
                                throw Error("dtype " + tensor.dtype + " not yet supported.");
                        }
                    }
                    return [2, ab];
            }
        });
    });
}
exports.serialize = serialize;
function parse(ab) {
    assert(ab.byteLength > 5);
    var view = new DataView(ab);
    var pos = 0;
    var byte0 = view.getUint8(pos++);
    var magicStr = dataViewToAscii(new DataView(ab, pos, 5));
    pos += 5;
    if (byte0 !== 0x93 || magicStr !== "NUMPY") {
        throw Error("Not a numpy file.");
    }
    var version = [view.getUint8(pos++), view.getUint8(pos++)].join(".");
    if (version !== "1.0") {
        throw Error("Unsupported version.");
    }
    var headerLen = view.getUint16(pos, true);
    pos += 2;
    var headerPy = dataViewToAscii(new DataView(ab, pos, headerLen));
    pos += headerLen;
    var bytesLeft = view.byteLength - pos;
    var headerJson = headerPy
        .replace("True", "true")
        .replace("False", "false")
        .replace(/'/g, "\"")
        .replace(/,\s*}/, " }")
        .replace(/,?\)/, "]")
        .replace("(", "[");
    var header = JSON.parse(headerJson);
    if (header.fortran_order) {
        throw Error("NPY parse error. Implement me.");
    }
    var size = numEls(header.shape);
    if (header["descr"] === "<f8") {
        assertEqual(bytesLeft, size * 8);
        var s = ab.slice(pos, pos + size * 8);
        var ta = new Float32Array(new Float64Array(s));
        return tf.tensor(ta, header.shape, "float32");
    }
    else if (header["descr"] === "<f4") {
        assertEqual(bytesLeft, size * 4);
        var s = ab.slice(pos, pos + size * 4);
        var ta = new Float32Array(s);
        return tf.tensor(ta, header.shape, "float32");
    }
    else if (header["descr"] === "<i8") {
        assertEqual(bytesLeft, size * 8);
        var s = ab.slice(pos, pos + size * 8);
        var ta = new Int32Array(s).filter(function (val, i) { return i % 2 === 0; });
        return tf.tensor(ta, header.shape, "int32");
    }
    else if (header["descr"] === "|u1") {
        assertEqual(bytesLeft, size);
        var s = ab.slice(pos, pos + size);
        var ta = new Uint8Array(s);
        return tf.tensor(ta, header.shape, "int32");
    }
    else {
        throw Error("Unknown dtype \"" + header["descr"] + "\". Implement me.");
    }
}
exports.parse = parse;
function numEls(shape) {
    if (shape.length === 0) {
        return 1;
    }
    else {
        return shape.reduce(function (a, b) { return a * b; });
    }
}
function writeStrToDataView(view, str, pos) {
    for (var i = 0; i < str.length; i++) {
        view.setInt8(pos + i, str.charCodeAt(i));
    }
    return pos + str.length;
}
function assertEqual(actual, expected) {
    assert(actual === expected, "actual " + actual + " not equal to expected " + expected);
}
function assert(cond, msg) {
    if (!cond) {
        throw Error(msg || "assert failed");
    }
}
function dataViewToAscii(dv) {
    var out = "";
    for (var i = 0; i < dv.byteLength; i++) {
        var val = dv.getUint8(i);
        if (val === 0) {
            break;
        }
        out += String.fromCharCode(val);
    }
    return out;
}
//# sourceMappingURL=npy.js.map