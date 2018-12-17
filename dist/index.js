"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var decorators_1 = require("./decorators");
var types_1 = require("./types");
function factory(class_) {
    return new class_();
}
function deserializer(type) {
    return deserialize.bind(this, type);
}
exports.default = deserializer;
function convert(deserializeValue, expectedType, valueTypeString) {
    // If not passed, then derive from value.
    if (!valueTypeString) {
        valueTypeString = types_1.getTypeOf(deserializeValue);
    }
    var expectedTypeString;
    // If expectedType is newable, convert to string.
    if (expectedType && expectedType.prototype) {
        expectedTypeString = types_1.getTypeOfCtor(expectedType);
    }
    else if (!expectedType) {
        // Optional based on dataType only has to be specified on object types and primitives requiring casting.
        expectedTypeString = valueTypeString;
    }
    else {
        expectedTypeString = expectedType;
    }
    var stringValue = deserializeValue;
    switch (expectedTypeString) {
        // Fall thru boolean, number, bigint, undefined and string
        case 'boolean':
            if (valueTypeString == types_1.Types.string) {
                return (stringValue.toLowerCase() == 'true');
            }
        case 'number':
            if (valueTypeString == types_1.Types.string) {
                return (stringValue.indexOf('.') ? parseFloat(stringValue) : parseInt(stringValue));
            }
        case 'bigint':
            // By default, cast values to their type if we get strings.
            if (valueTypeString == types_1.Types.string) {
                return parseInt(stringValue);
            }
        case 'undefined': // null comes across as typeof undefined
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
                    throw new Error("Date cannot be cast from type " + expectedType);
            }
        case 'object':
        default: // symbol, function
            throw new Error("Unknown expected output type '" + expectedType + "' found.");
    }
}
exports.convert = convert;
function deserialize(type, deserializeData, mustBeArray) {
    var isArray = Array.isArray(deserializeData);
    var typeCheckValue = isArray ? deserializeData[0] : deserializeData;
    var valueTypeString = types_1.getTypeOf(typeCheckValue);
    var objectTypeString = types_1.getTypeOfCtor(type);
    var isTypeObject = types_1.checkIsObject(valueTypeString) || ((deserializeData == null || deserializeData == undefined) && types_1.checkIsObject(objectTypeString));
    if (mustBeArray != undefined && mustBeArray && (!isArray || valueTypeString == 'undefined')) {
        debugger;
        throw new Error('Array deserialization error. Object must be array.');
    }
    if (Array.isArray(deserializeData)) {
        return deserializeData.map(function (v, i, arr) {
            if (isTypeObject) {
                return deserialize(type, v, false);
            }
            return convert(v, type, valueTypeString);
        });
    }
    else if (isTypeObject) {
        if (deserializeData == null || deserializeData == undefined) {
            return deserializeData;
        }
        var newO = factory(type);
        // We need to perfor the 
        for (var _i = 0, _a = Object.keys(deserializeData); _i < _a.length; _i++) {
            var key = _a[_i];
            var keyValue = deserializeData[key];
            var dataType = decorators_1.getSerializable(newO, key);
            var converters = decorators_1.getConverters(newO, key);
            var propTypeString = types_1.getTypeOf(keyValue);
            var isValueArray = Array.isArray(keyValue);
            var dataTypeString = types_1.getTypeOfCtor(dataType.Type);
            var isPropObject = types_1.checkIsObject(propTypeString) || ((keyValue == null || keyValue == undefined) && types_1.checkIsObject(dataTypeString));
            var propertyName = type.prototype.constructor.name + "." + key;
            if (!dataType.Skip) {
                // If this is an object type, we need to ensure we picked up the constructor for it.
                if (isPropObject && !dataType.Type) {
                    throw new Error("DataType annotation missing on Type " + propertyName);
                }
                if (dataType.IsArray && (!isValueArray || propTypeString == types_1.Types.undefined)) {
                    throw new Error("Array deserialization error. " + propertyName + " must be array.");
                }
                if (!dataType.IsArray && isValueArray) {
                    throw new Error(propertyName + " array not expected.");
                }
                // debugger;
                if (isPropObject) {
                    newO[key] = deserialize(dataType.Type, keyValue, dataType.IsArray);
                }
                else if (converters) {
                    var converter = converters[propTypeString];
                    if (converter) {
                        newO[key] = converter(keyValue);
                        var outputTypeString = types_1.getTypeOf(newO[key]);
                        var coarcedTypeString = dataTypeString || propTypeString;
                        if (coarcedTypeString != outputTypeString) {
                            throw new Error("Converter output type invalid for property " + propertyName + ", expected " + coarcedTypeString + " received " + outputTypeString + ".");
                        }
                    }
                    else {
                        throw new Error("Converters for property " + propertyName + " input type " + propTypeString + " required.");
                    }
                }
                else {
                    newO[key] = convert(keyValue, dataType.Type, propTypeString);
                }
            }
            else if (converters) {
                throw new Error("Converters cannot be skipped for property " + propertyName + ".");
            }
        }
        return newO;
    }
    else { // primitives
        var primitiveValue = convert(deserializeData, type, valueTypeString);
        return primitiveValue;
    }
}
exports.deserialize = deserialize;
//# sourceMappingURL=index.js.map