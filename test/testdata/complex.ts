import * as Complex from '../testclass/complex';
import { deserializer } from '../../src/deserializer';

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

console.log('Order', 
    deserializer<Complex.Order>(Complex.Order)(jsonOrder)
);
