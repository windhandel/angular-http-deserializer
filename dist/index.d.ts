import 'reflect-metadata';
export declare type newable = {
    new (value?: string | any): any;
    prototype: {
        constructor: {
            name: string;
        };
    };
} | any;
export declare function dataType(type: newable, isArray?: boolean): Function;
export declare class DataType {
    Type: newable;
    IsArray: boolean;
    constructor(type: newable, isArray?: boolean);
}
export declare function getDataType(target: any, propertyKey: string): DataType;
export declare type jsonKey = String | Number;
export declare type indexSig = {
    [key: string]: any;
};
export declare type inputValue = indexSig | jsonKey | Boolean | undefined | null;
export declare type outputValue = inputValue | Date;
export declare type primitiveObjectOrArray<T extends inputValue | outputValue> = T | ArrayLike<T>;
export declare type deepDeserializeSig<T extends outputValue> = (deserialize?: primitiveObjectOrArray<inputValue>, index?: jsonKey) => primitiveObjectOrArray<T>;
export declare type typeofOrDate = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'date';
export default function deserializer<T extends outputValue>(type: newable): deepDeserializeSig<T>;
export declare function deepDeserialize<T extends outputValue>(type: newable, deserialize: primitiveObjectOrArray<inputValue>, mustBeArray?: boolean): primitiveObjectOrArray<T>;
