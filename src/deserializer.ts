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

function getDataType(target: any, propertyKey: string): DataType {
    return new DataType(
        Reflect.getMetadata(dataTypeMetadataKey, target, propertyKey),
        Reflect.getMetadata(isArrayMetadataKey, target, propertyKey)
    );
}

export type jsonKey = String | Number;
export type indexSig = { [ key: string]: any };
export type inputValue = indexSig | jsonKey | Boolean | undefined | null;
export type outputValue = inputValue | Date; // Dates don't come in Json.
export type primitiveObjectOrArray<T extends inputValue | outputValue> = T | ArrayLike<T>;
export type deepDeserializeSig<T extends outputValue> = (deserialize?: primitiveObjectOrArray<inputValue>, index?: jsonKey) => primitiveObjectOrArray<T>;
export type converter<T extends outputValue> = {
    convert(type: newable, deserialize?: primitiveObjectOrArray<inputValue>, mustBeArray?: boolean): primitiveObjectOrArray<T>
}
export type typeofOrDate = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'date';

function factory<T>(class_: newable): T {
    return new class_() as T;
}

export function deserializer<T extends outputValue>(type: newable): deepDeserializeSig<T> {
    return deepDeserialize.bind(this, type);
}

export function getConverter<T extends outputValue>(typeString: typeofOrDate): any {
    switch (typeString) {
        case 'boolean':
        case 'number':
        case 'bigint':
        case 'string':
            // Straight mapping from json to real value.
            return {
                convert: (t, v, ik) => v as unknown as T
            };
        case 'date':
            return {
                convert: (t, v, mustBeArray) => new Date(v.toString())
            }
        case 'undefined': // null comes across as typeof undefined
            return {
                convert: (t, v, mustBeArray) => v as any
            };
        case 'object':
            return {
                convert: deepDeserialize
            };
        default:
            return null;
    }
}

const objectType = 'object';
const dateType = 'date';
function getTypeString(type: newable, typeValue: any): typeofOrDate {
    if (type == Date) {
        return dateType;
    }

    return typeof typeValue;
}

export function deepDeserialize<T extends outputValue>(type: newable,
    deserialize?: primitiveObjectOrArray<inputValue>, mustBeArray: boolean = false): primitiveObjectOrArray<T> {
    const isArray = Array.isArray(deserialize);
    let typeCheckValue: inputValue = isArray ? (<any>deserialize)[0] : deserialize;
    let typeString: typeofOrDate = getTypeString(type, typeCheckValue);
    let converter: converter<any> = getConverter(typeString);
    let isObject = typeString == objectType;

    if (mustBeArray && (!isArray || typeString == 'undefined')) {
        throw new Error('Array deserialization error. Object must be array.');
    }

    if (isArray) {
        return (<Array<any>>deserialize).map((v, i, arr) => {
            return converter.convert(type, v, false)
        });
    } else if (isObject) {
        let newO: T = factory<T>(type);

        // We need to perfor the 
        for (let key of Object.keys(deserialize)) {
            let keyValue = deserialize[key];
            let dataType: DataType = getDataType(newO, key);
            let typeString: typeofOrDate = getTypeString(dataType.Type, keyValue);

            // If this is an object type, we need to ensure we picked up the constructor for it.
            if (typeString == objectType && !dataType.Type) {
                throw new Error(`DataType annotation missing on Type ${type.prototype.constructor.name} field ${key}`);
            }

            let converter: converter<any> = getConverter(typeString);

            newO[key] = converter.convert(dataType.Type, keyValue, dataType.IsArray);
        }

        return newO;
    } else { // primitives
        converter.convert(type, deserialize);
    }
}
