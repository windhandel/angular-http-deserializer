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
export declare type jsonKey = string | number;
export declare type indexSig = {
    [key: string]: any;
};
export declare type inputValue = indexSig | jsonKey | boolean | undefined | null;
export declare type outputValue = inputValue | Date;
export declare type inputOrArray<T extends inputValue | inputValue[]> = T;
export declare type outputOrArray<T extends outputValue | outputValue[]> = T;
export declare type deepDeserializeSig<T extends outputValue | outputValue[]> = (deserialize?: inputOrArray<inputValue>, index?: jsonKey) => T;
export declare type typeofOrDate = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'date';
export default function deserializer<T extends outputValue>(type: newable): deepDeserializeSig<T>;
export declare function deepDeserialize<T extends outputValue>(type: newable, deserialize: inputValue, mustBeArray?: boolean): T | T[];
