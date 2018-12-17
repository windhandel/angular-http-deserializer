"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var dataTypeMetadataKey = Symbol("dataType");
var isArrayMetadataKey = Symbol("isArray");
var skipMetadataKey = Symbol("skip");
var converterMetadataKey = Symbol("converters");
function dataType(type, isArray) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(dataTypeMetadataKey, type, target, propertyKey);
        if (isArray) {
            Reflect.defineMetadata(isArrayMetadataKey, isArray, target, propertyKey);
        }
    };
}
exports.dataType = dataType;
function converters(converters) {
    return function (target, propertyKey, descriptor) {
        debugger;
        Reflect.defineMetadata(converterMetadataKey, converters, target, propertyKey);
    };
}
exports.converters = converters;
function skip() {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(skipMetadataKey, true, target, propertyKey);
    };
}
exports.skip = skip;
var Serializable = /** @class */ (function () {
    function Serializable(type, isArray, skip) {
        this.Type = type;
        this.IsArray = isArray || false;
        this.Skip = skip || false;
    }
    return Serializable;
}());
exports.Serializable = Serializable;
function getSerializable(target, propertyKey) {
    return new Serializable(Reflect.getMetadata(dataTypeMetadataKey, target, propertyKey), Reflect.getMetadata(isArrayMetadataKey, target, propertyKey), Reflect.getMetadata(skipMetadataKey, target, propertyKey));
}
exports.getSerializable = getSerializable;
function getConverters(target, propertyKey) {
    return Reflect.getMetadata(converterMetadataKey, target, propertyKey);
}
exports.getConverters = getConverters;
//# sourceMappingURL=decorators.js.map