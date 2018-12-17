"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Types = {
    string: 'string',
    object: 'object',
    undefined: 'undefined',
    number: 'number',
    bigint: 'bigint',
    boolean: 'boolean',
    symbol: 'symbol',
    date: 'date',
    function: 'function'
};
// Type Guard for typeofOrDate.
function isTypeofOrDate(type) {
    return !!exports.Types[(type || '').toLowerCase()];
}
function getTypeOfCtor(ctor) {
    if (!ctor) {
        return null;
    }
    var typeString = ctor.prototype.constructor.name.toLowerCase();
    if (ctor.prototype.constructor == Date) {
        return exports.Types.date;
    }
    else if (!isTypeofOrDate(typeString)) {
        return exports.Types.object;
    }
    return typeString;
}
exports.getTypeOfCtor = getTypeOfCtor;
function getTypeOf(deserialize) {
    var typeString = (typeof deserialize).toLowerCase();
    if (deserialize == undefined || deserialize == null) {
        return exports.Types.undefined;
    }
    else if (deserialize.constructor && deserialize.constructor == Date) {
        return exports.Types.date;
    }
    else if (deserialize.constructor && !isTypeofOrDate(deserialize.constructor.name)) {
        return exports.Types.object;
    }
    return typeString;
}
exports.getTypeOf = getTypeOf;
function checkIsObject(typeOf) {
    return typeOf == exports.Types.object;
}
exports.checkIsObject = checkIsObject;
//# sourceMappingURL=types.js.map