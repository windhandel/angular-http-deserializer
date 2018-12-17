import * as Complex from './complex';
import deserializer, { convert } from './index';
import { dataType, skip, converters } from './decorators';

export class SkippedOrder {
    id: number;
    @dataType(Complex.OrderProduct, true)
    products: Complex.OrderProduct[];
    @dataType(Complex.User)
    orderedBy: Complex.User;
    @skip()
    createdDate: Date;
}

let suffixedMs = 123;
export class SkippedConverterOrder {
    id: number;
    @dataType(Complex.OrderProduct, true)
    products: Complex.OrderProduct[];
    @dataType(Complex.User)
    orderedBy: Complex.User;
    @dataType(Date)
    @skip()
    @converters({
        'number': (input: number) => {
            let convertedDate = new Date(input);
            // Used for validation of the converter.
            convertedDate.setMilliseconds(suffixedMs);
            return convertedDate;
        }
    })
    createdDate: Date;
}


let orderCreated = 1545070509727;
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
    createdDate: orderCreated
};

describe('Deserialize Skipped', () => {
    let deSkippedOrder = deserializer<SkippedOrder>(SkippedOrder);
    let deSkippedConverterOrder = deserializer<SkippedConverterOrder>(SkippedConverterOrder);

    it('should skip', () => {
        let deserialized: SkippedOrder = deSkippedOrder(jsonOrder);
        
        expect(deserialized).toBeTruthy();
        expect(deserialized.createdDate).toBeUndefined('Order.createdDate should be skipped.');
    });

    it('should fail Skip w/ Converter', () => {
        expect(() => deSkippedConverterOrder(jsonOrder)).toThrow(new Error('Converters cannot be skipped for property SkippedConverterOrder.createdDate.'));
    });

});
