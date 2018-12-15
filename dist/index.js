"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var dataTypeMetadataKey = Symbol("dataType");
var isArrayMetadataKey = Symbol("isArray");
function dataType(type, isArray) {
    return function (target, propertyKey, descriptor) {
        Reflect.defineMetadata(dataTypeMetadataKey, type, target, propertyKey);
        if (isArray) {
            Reflect.defineMetadata(isArrayMetadataKey, isArray, target, propertyKey);
        }
    };
}
exports.dataType = dataType;
var DataType = /** @class */ (function () {
    function DataType(type, isArray) {
        this.Type = type;
        this.IsArray = isArray || false;
    }
    return DataType;
}());
exports.DataType = DataType;
function getDataType(target, propertyKey) {
    return new DataType(Reflect.getMetadata(dataTypeMetadataKey, target, propertyKey), Reflect.getMetadata(isArrayMetadataKey, target, propertyKey));
}
exports.getDataType = getDataType;
// Type Guard for typeofOrDate.
function isTypeofOrDate(type) {
    return [
        'string',
        'number',
        'bigint',
        'boolean',
        'symbol',
        'undefined',
        'object',
        'function',
        'date'
    ].find(function (v) { return v === type; }) != null;
}
function factory(class_) {
    return new class_();
}
function deserializer(type) {
    return deepDeserialize.bind(this, type);
}
exports.default = deserializer;
var stringType = 'string';
var objectType = 'object';
var undefinedType = 'undefined';
function converter(type, valueTypeString, deserializeValue, mustBeArray) {
    var typeString = type ? type.prototype.constructor.name.toLowerCase() : valueTypeString;
    // if it doesn't match one of the types, then the constructor is a custom object type.
    var isType = isTypeofOrDate(typeString);
    if (!isType) {
        typeString = objectType;
    }
    var stringValue = deserializeValue;
    switch (typeString) {
        case 'boolean':
            if (valueTypeString == stringType) {
                return (stringValue.toLowerCase() == 'true');
            }
        case 'number':
            if (valueTypeString == stringType) {
                return (stringValue.indexOf('.') ? parseFloat(stringValue) : parseInt(stringValue));
            }
        case 'bigint':
            // By default, cast values to their type if we get strings.
            if (valueTypeString == stringType) {
                return parseInt(stringValue);
            }
        case 'string':
            // Straight mapping from string to string.
            // Expects strings to not come in with some other data type.
            return deserializeValue;
        case 'date':
            switch (valueTypeString) {
                case 'number':
                    return new Date(deserializeValue);
                case 'string':
                    return new Date(stringValue);
                case 'undefined':
                    return deserializeValue;
                default:
                    throw new Error("Date cannot be cast from type " + typeString);
            }
        case 'undefined': // null comes across as typeof undefined
            return deserializeValue;
        case 'object':
            if (valueTypeString == undefinedType) {
                return deserializeValue;
            }
            return deepDeserialize(type, deserializeValue, mustBeArray);
        default: // symbol, function
            return null;
    }
}
function deepDeserialize(type, deserialize, mustBeArray) {
    var isArray = Array.isArray(deserialize);
    var typeCheckValue = isArray ? deserialize[0] : deserialize;
    var typeString = typeof typeCheckValue;
    // "Correct" typeof return object.
    if (typeCheckValue == null || typeCheckValue == undefined) {
        typeString = 'undefined';
    }
    var isObject = typeString == objectType;
    if (mustBeArray != undefined && mustBeArray && (!isArray || typeString == 'undefined')) {
        throw new Error('Array deserialization error. Object must be array.');
    }
    if (Array.isArray(deserialize)) {
        return deserialize.map(function (v, i, arr) {
            return converter(type, typeString, v, false);
        });
    }
    else if (isObject) {
        var newO = factory(type);
        // We need to perfor the 
        for (var _i = 0, _a = Object.keys(deserialize); _i < _a.length; _i++) {
            var key = _a[_i];
            var keyValue = deserialize[key];
            var dataType_1 = getDataType(newO, key);
            var propTypeString = typeof keyValue;
            // If this is an object type, we need to ensure we picked up the constructor for it.
            if (propTypeString == objectType && !dataType_1.Type) {
                throw new Error("DataType annotation missing on Type " + type.prototype.constructor.name + " field " + key);
            }
            if (dataType_1.IsArray && (!Array.isArray(keyValue) || propTypeString == 'undefined')) {
                throw new Error("Array deserialization error. " + type.prototype.constructor.name + "." + key + " must be array.");
            }
            if (!dataType_1.IsArray && Array.isArray(keyValue)) {
                throw new Error(type.prototype.constructor.name + "." + key + " array not expected.");
            }
            newO[key] = converter(dataType_1.Type, propTypeString, keyValue, dataType_1.IsArray);
        }
        return newO;
    }
    else { // primitives
        var primitiveValue = converter(type, typeString, deserialize, false);
        return primitiveValue;
    }
}
exports.deepDeserialize = deepDeserialize;
//# sourceMappingURL=index.js.map