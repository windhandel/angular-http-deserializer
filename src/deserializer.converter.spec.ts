import * as Complex from './complex';
import deserializer, { convert } from './index';
import { dataType, converters } from './decorators';

let suffixedMs = 123;
export class ConverterOrder {
    id: number;
    @dataType(Complex.OrderProduct, true)
    products: Complex.OrderProduct[];
    @dataType(Complex.User)
    orderedBy: Complex.User;
    @dataType(Date)
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

export class InvalidConverterOrder {
    id: number;
    @dataType(Complex.OrderProduct, true)
    products: Complex.OrderProduct[];
    @dataType(Complex.User)
    orderedBy: Complex.User;
    @dataType(Date)
    @converters({
        'number': (input: number) => {
            return 12; // Conversion should throw error for wrong output type.
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

describe('Deserialize Converter', () => {
    let deConverterOrder = deserializer<ConverterOrder>(ConverterOrder);
    let deInvalidConverterOrder = deserializer<InvalidConverterOrder>(InvalidConverterOrder);

    it('should deserialize Order', () => {
        let deserialized: ConverterOrder = deConverterOrder(jsonOrder);
        
        expect(deserialized).toBeTruthy();
        expect(deserialized.createdDate.getMilliseconds()).toEqual(suffixedMs, 'Order.createdDate not converted.');
    });

    it('should convert invalid output type throw error.', () => {
        expect(() => deInvalidConverterOrder(jsonOrder)).toThrowError('Converter output type invalid for property InvalidConverterOrder.createdDate, expected date received number.');
    });

    it('should deserialize Order', () => {
        let copyJsonOrder = JSON.parse(JSON.stringify(jsonOrder));
        // No string converter supplied, throw exception.
        copyJsonOrder.createdDate = '11/1/2008 5:11:12 pm';
        
        expect(() => deConverterOrder(copyJsonOrder)).toThrowError('Converters for property ConverterOrder.createdDate input type string required.');
    });

});
