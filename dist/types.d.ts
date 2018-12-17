export declare type newable = {
    new (value?: string | any): any;
    prototype: {
        constructor: {
            name: string;
        };
    };
} | any;
export declare type jsonKey = string | number;
export declare type convertInput = jsonKey | boolean | undefined | null;
export declare type indexSig = {
    [key: string]: any;
    constructor: Function;
};
export declare type inputValue = indexSig | convertInput;
export declare type outputValue = inputValue | Date;
export declare type deserializeSig<T extends outputValue | outputValue[]> = (deserialize: inputValue | inputValue[], mustBeArray?: boolean | number) => T;
export declare type converter = {
    [key: string]: (deserializeValue: inputValue, expectedType?: string | newable, valueTypeString?: string) => outputValue;
};
export declare const Types: {
    string: string;
    object: string;
    undefined: string;
    number: string;
    bigint: string;
    boolean: string;
    symbol: string;
    date: string;
    function: string;
};
export declare function getTypeOfCtor(ctor: {
    prototype: {
        constructor: Function;
    };
}): string;
export declare function getTypeOf(deserialize: inputValue): string;
export declare function checkIsObject(typeOf: string): boolean;
