export type newable = {
    new(value?: string | any): any;
    prototype: { constructor: { name: string; } }
} | any;

export type jsonKey = string | number;
export type convertInput = jsonKey | boolean | undefined | null;
export type indexSig = { [ key: string ]: any, constructor: Function };
export type inputValue = indexSig | convertInput;
export type outputValue = inputValue | Date; // Dates don't come in Json.
export type deserializeSig<T extends outputValue | outputValue[]> = (deserialize: inputValue | inputValue[], mustBeArray?: boolean) => T;
export type converter = { [ key: string]: (deserializeValue: inputValue, expectedType?: string | newable, valueTypeString?: string) => outputValue };
export const Types = {
    string: 'string',
    object: 'object',
    undefined: 'undefined',
    number :'number',
    bigint: 'bigint',
    boolean: 'boolean',
    symbol: 'symbol',
    date: 'date',
    function: 'function'
};

// Type Guard for typeofOrDate.
function isTypeofOrDate(type: string) : boolean {
    return !!Types[(type || '').toLowerCase()];
}

export function getTypeOfCtor(ctor: { prototype: { constructor: Function }}): string {
    if (!ctor) {
        return null;
    }
    
    let typeString = ctor.prototype.constructor.name.toLowerCase();

    if (ctor.prototype.constructor == Date) {
        return Types.date;
    } else if (!isTypeofOrDate(typeString)) {
        return Types.object;
    }

    return typeString;
}

export function getTypeOf(deserialize: inputValue): string {
    let typeString = (typeof deserialize).toLowerCase();

    if (deserialize == undefined || deserialize == null) {
        return Types.undefined;
    } else if (deserialize.constructor && deserialize.constructor == Date) {
        return Types.date;
    } else if (deserialize.constructor && !isTypeofOrDate(deserialize.constructor.name)) {
        return Types.object;
    }

    return typeString;
}

export function checkIsObject(typeOf: string): boolean {
    return typeOf == Types.object
}