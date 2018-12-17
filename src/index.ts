import 'reflect-metadata';
import { Serializable, getSerializable, getConverters } from './decorators';
import { getTypeOf, checkIsObject, newable, inputValue, outputValue, deserializeSig, Types, getTypeOfCtor, converter } from './types';

function factory<T>(class_: newable): T {
    return new class_() as T;
}

export default function deserializer<T extends outputValue>(type: newable): deserializeSig<T> {
    return deserialize.bind(this, type);
}

export function convert<T extends outputValue>(deserializeValue: inputValue, expectedType?: string | newable, valueTypeString?: string): T {
    // If not passed, then derive from value.
    if (!valueTypeString) {
        valueTypeString = getTypeOf(deserializeValue);
    }

    let expectedTypeString;
    // If expectedType is newable, convert to string.
    if (expectedType && expectedType.prototype) {
        expectedTypeString = getTypeOfCtor(expectedType);
    } else if (!expectedType) {
        // Optional based on dataType only has to be specified on object types and primitives requiring casting.
        expectedTypeString = valueTypeString;    
    } else {
        expectedTypeString = expectedType;
    }

    let stringValue = <string>deserializeValue;
    switch (expectedTypeString) {
        // Fall thru boolean, number, bigint, undefined and string
        case 'boolean':
            if (valueTypeString == Types.string) {
                return (stringValue.toLowerCase() == 'true') as T;
            }
        case 'number':
            if (valueTypeString == Types.string) {
                return (stringValue.indexOf('.') ? parseFloat(stringValue) : parseInt(stringValue)) as T;
            }
        case 'bigint':
            // By default, cast values to their type if we get strings.
            if (valueTypeString == Types.string) {
                return parseInt(stringValue) as T;
            }
        case 'undefined': // null comes across as typeof undefined
        case 'string':
            // Straight mapping from string to string.
            // Expects strings to not come in with some other data type.
            return deserializeValue as T;
        case 'date':
            switch (valueTypeString) {
                case 'number':
                    return new Date(<number>deserializeValue) as T;
                case 'string':
                    return new Date(stringValue) as T;
                case 'undefined':
                    return deserializeValue as T;
                default:
                    throw new Error(`Date cannot be cast from type ${expectedType}`);
            }
        case 'object':
        default: // symbol, function
            throw new Error(`Unknown expected output type '${expectedType}' found.`);
    }
}

export function deserialize<T extends outputValue>(type: newable, deserializeData: inputValue, mustBeArray?: boolean | number): T | T[] {
    // Overloaded to make it passable directly to map operator.  Reset to be specific to boolean.
    mustBeArray = mustBeArray == true;
    const isArray = Array.isArray(deserializeData);
    const typeCheckValue: inputValue = isArray ? (<any>deserializeData)[0] : deserializeData;
    let valueTypeString: string = getTypeOf(typeCheckValue);
    let objectTypeString = getTypeOfCtor(type);
    const isTypeObject = checkIsObject(valueTypeString) || ((deserializeData == null || deserializeData == undefined) && checkIsObject(objectTypeString));

    if (mustBeArray && (!isArray || valueTypeString == 'undefined')) {
        throw new Error('Array deserialization error. Object must be array.');
    }

    if (Array.isArray(deserializeData)) {
        return deserializeData.map((v, i, arr) => {
            if (isTypeObject) {
                return deserialize(type, v, false);
            }
            return convert(v, type, valueTypeString);
        });
    } else if (isTypeObject) {
        if (deserializeData == null || deserializeData == undefined) {
            return deserializeData as T;
        }

        let newO: T = factory<T>(type);

        // We need to perfor the 
        for (let key of Object.keys(deserializeData)) {
            let keyValue = deserializeData[key];
            let dataType: Serializable = getSerializable(newO, key);
            let converters: converter = getConverters(newO, key);
            let propTypeString: string = getTypeOf(keyValue);
            let isValueArray = Array.isArray(keyValue);
            let dataTypeString = getTypeOfCtor(dataType.Type);
            let isPropObject = checkIsObject(propTypeString) || ((keyValue == null || keyValue == undefined) && checkIsObject(dataTypeString));
            let propertyName = `${type.prototype.constructor.name}.${key}`;

            if (!dataType.Skip) {
                // If this is an object type, we need to ensure we picked up the constructor for it.
                if (isPropObject && !dataType.Type) {
                    throw new Error(`DataType annotation missing on Type ${propertyName}`);
                }

                if (dataType.IsArray && (!isValueArray || propTypeString == Types.undefined)) {
                    throw new Error(`Array deserialization error. ${propertyName} must be array.`);
                }

                if (!dataType.IsArray && isValueArray) {
                    throw new Error(`${propertyName} array not expected.`);
                }
                
                if (isPropObject) {
                    newO[key] = deserialize(dataType.Type, keyValue, dataType.IsArray);
                } else if (converters) {
                    let converter = converters[propTypeString];
                    if (converter) {
                        newO[key] = converter(keyValue);
                        let outputTypeString = getTypeOf(newO[key]);
                        let coarcedTypeString = dataTypeString || propTypeString;
                        if (coarcedTypeString != outputTypeString) {
                            throw new Error(`Converter output type invalid for property ${propertyName}, expected ${coarcedTypeString} received ${outputTypeString}.`);
                        }
                    } else {
                        throw new Error(`Converters for property ${propertyName} input type ${propTypeString} required.`);
                    }
                } else {
                    newO[key] = convert(keyValue, dataType.Type, propTypeString);
                }
            } else if (converters) {
                throw new Error(`Converters cannot be skipped for property ${propertyName}.`);
            }
        }

        return newO;
    } else { // primitives
        let primitiveValue = convert<T>(deserializeData, type, valueTypeString);
        return primitiveValue;
    }
}
