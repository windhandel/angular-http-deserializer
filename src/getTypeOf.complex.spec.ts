import * as Complex from './complex';
import { getTypeOf, Types } from './types';

let jsonOrder = {
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

describe('getTypeOf', () => {
    it('should getTypeOf number', () => {
        expect(getTypeOf(2)).toBe(Types.number);
    });

    it('should getTypeOf boolean', () => {
        expect(getTypeOf(true)).toBe(Types.boolean);
    });

    it('should getTypeOf date', () => {
        expect(getTypeOf(new Date())).toBe(Types.date);
    });

    it('should getTypeOf string', () => {
        expect(getTypeOf('Test value.')).toBe(Types.string);
    });

    it('should getTypeOf undefined', () => {
        expect(getTypeOf(undefined)).toBe(Types.undefined);
    });

    it('should getTypeOf null', () => {
        expect(getTypeOf(null)).toBe(Types.undefined);
    });

    it('should getTypeOf json object', () => {
        expect(getTypeOf(jsonOrder)).toBe(Types.object);
    });

    it('should getTypeOf instantiated object', () => {
        expect(getTypeOf(new Complex.Order())).toBe(Types.object);
    });
});
