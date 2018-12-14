import 'reflect-metadata';

export type newable = {
    new(value?: string | any): any;
    prototype: { constructor: { name: string; } }
} | any;
const dataTypeMetadataKey = Symbol("dataType");
const isArrayMetadataKey = Symbol("isArray");

export function dataType(type: newable, isArray?: boolean): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(dataTypeMetadataKey, type, target, propertyKey);
        if (isArray) {
            Reflect.defineMetadata(isArrayMetadataKey, isArray, target, propertyKey);
        }
    };
}

export class DataType {
    Type: newable;
    IsArray: boolean;

    constructor(type: newable, isArray?: boolean) {
        this.Type = type;
        this.IsArray = isArray || false;
    }
}

export function getDataType(target: any, propertyKey: string): DataType {
    return new DataType(
        Reflect.getMetadata(dataTypeMetadataKey, target, propertyKey),
        Reflect.getMetadata(isArrayMetadataKey, target, propertyKey)
    );
}

export type jsonKey = String | Number;
export type indexSig = { [key: string]: any };
export type inputValue = indexSig | jsonKey | Boolean | undefined | null;
export type outputValue = inputValue | Date; // Dates don't come in Json.
export type primitiveObjectOrArray<T extends inputValue | outputValue> = T | ArrayLike<T>;
export type deepDeserializeSig<T extends outputValue> = (deserialize?: primitiveObjectOrArray<inputValue>, index?: jsonKey) => primitiveObjectOrArray<T>;
export type typeofOrDate = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'date';

// Type Guard for typeofOrDate.
function isTypeofOrDate(type: string) : boolean {
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
    ].find(v => v === type) != null;
}

function factory<T>(class_: newable): T {
    return new class_() as T;
}

export default function deserializer<T extends outputValue>(type: newable): deepDeserializeSig<T> {
    return deepDeserialize.bind(this, type);
}

const stringType = 'string';
const objectType = 'object';
const undefinedType = 'undefined';
function converter<T extends outputValue>(type: newable, valueTypeString: typeofOrDate, deserializeValue: primitiveObjectOrArray<inputValue>, mustBeArray: boolean): any {
    let typeString = type ? type.prototype.constructor.name.toLowerCase() : valueTypeString;

    // if it doesn't match one of the types, then the constructor is a custom object type.
    let isType = isTypeofOrDate(typeString);
    if (!isType) {
        typeString = objectType;
    }
    
    let stringValue = <string>deserializeValue;
    switch (typeString) {
        case 'boolean':
            if (valueTypeString == stringType) {
                return stringValue.toLowerCase() == 'true';
            }
        case 'number':
            if (valueTypeString == stringType) {
                return stringValue.indexOf('.') ? parseFloat(stringValue) : parseInt(stringValue);
            }
        case 'bigint':
            // By default, cast values to their type if we get strings.
            if (valueTypeString == stringType) {
                return parseInt(stringValue);
            }
        case 'string':
            // Straight mapping from string to string.
            // Expects strings to not come in with some other data type.
            return deserializeValue as unknown as T;
        case 'date':
            switch (valueTypeString) {
                case 'number':
                    return new Date(<number>deserializeValue);
                case 'string':
                    return new Date(stringValue);
                case 'undefined':
                    return deserializeValue;
                default:
                    throw new Error(`Date cannot be cast from type ${typeString}`);
            }
        case 'undefined': // null comes across as typeof undefined
            return deserializeValue as any;
        case 'object':
            if (valueTypeString == undefinedType) {
                return deserializeValue;
            }
            return deepDeserialize(type, deserializeValue, mustBeArray);
        default:
            return null;
    }
}

export function deepDeserialize<T extends outputValue>(type: newable,
    deserialize: primitiveObjectOrArray<inputValue>, mustBeArray?: boolean): primitiveObjectOrArray<T> {
    //debugger;
    const isArray = Array.isArray(deserialize);
    const typeCheckValue: inputValue = isArray ? (<any>deserialize)[0] : deserialize;
    let typeString: typeofOrDate = typeof typeCheckValue;
    // "Correct" typeof return object.
    if (typeCheckValue == null || typeCheckValue == undefined) {
        typeString = 'undefined';
    }
    const isObject = typeString == objectType;

    if (mustBeArray != undefined && mustBeArray && (!isArray || typeString == 'undefined')) {
        throw new Error('Array deserialization error. Object must be array.');
    }

    if (isArray) {
        return (<Array<any>>deserialize).map((v, i, arr) => {
            return converter<T>(type, typeString, v, false)
        });
    } else if (isObject) {
        let newO: T = factory<T>(type);

        // We need to perfor the 
        for (let key of Object.keys(deserialize)) {
            let keyValue = deserialize[key];
            let dataType: DataType = getDataType(newO, key);
            let propTypeString: typeofOrDate = typeof keyValue;

            // If this is an object type, we need to ensure we picked up the constructor for it.
            if (propTypeString == objectType && !dataType.Type) {
                throw new Error(`DataType annotation missing on Type ${type.prototype.constructor.name} field ${key}`);
            }

            if (dataType.IsArray && (!Array.isArray(keyValue) || propTypeString == 'undefined')) {
                throw new Error(`Array deserialization error. ${type.prototype.constructor.name}.${key} must be array.`);
            }

            if (!dataType.IsArray && Array.isArray(keyValue)) {
                throw new Error(`${type.prototype.constructor.name}.${key} array not expected.`);
            }

            newO[key] = converter<T>(dataType.Type, propTypeString, keyValue, dataType.IsArray);
        }

        return newO;
    } else { // primitives
        let primitiveValue = converter<T>(type, typeString, deserialize, false);
        return primitiveValue;
    }
}
