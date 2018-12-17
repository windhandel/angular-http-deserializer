"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Complex = require("./complex");
var types_1 = require("./types");
var jsonOrder = {
    id: 1234142,
    products: [
        {
            product: {
                id: 5124124,
                name: 'Jeff Prod'
            },
            quantity: 14112
        }
    ],
    orderedBy: {
        id: 54645,
        name: 'Jeff Fischer',
        createdDate: '11/1/2008 5:11:12 pm'
    },
    createdDate: '5/1/2000 5:10:00 am'
};
describe('getTypeOf', function () {
    it('should getTypeOf number', function () {
        expect(types_1.getTypeOf(2)).toBe(types_1.Types.number);
    });
    it('should getTypeOf boolean', function () {
        expect(types_1.getTypeOf(true)).toBe(types_1.Types.boolean);
    });
    it('should getTypeOf date', function () {
        expect(types_1.getTypeOf(new Date())).toBe(types_1.Types.date);
    });
    it('should getTypeOf string', function () {
        expect(types_1.getTypeOf('Test value.')).toBe(types_1.Types.string);
    });
    it('should getTypeOf undefined', function () {
        expect(types_1.getTypeOf(undefined)).toBe(types_1.Types.undefined);
    });
    it('should getTypeOf null', function () {
        expect(types_1.getTypeOf(null)).toBe(types_1.Types.undefined);
    });
    it('should getTypeOf json object', function () {
        expect(types_1.getTypeOf(jsonOrder)).toBe(types_1.Types.object);
    });
    it('should getTypeOf instantiated object', function () {
        expect(types_1.getTypeOf(new Complex.Order())).toBe(types_1.Types.object);
    });
});
//# sourceMappingURL=getTypeOf.complex.spec.js.map