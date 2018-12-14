import * as Complex from './complex';
import { deserializer } from "./deserializer";

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

describe('Deserialize Complex Types', () => {
    let deOrder = deserializer<Complex.Order>(Complex.Order);

    it('should deserialize Order', () => {
        let deserialized: Complex.Order = <Complex.Order>deOrder(jsonOrder);
        
        expect(deserialized).toBeTruthy();
        expect(deserialized.orderedBy.wasCreatedFirstOfMonth).toBeTruthy('wasCreatedFirstOfMonth failed.');
        expect(deserialized.products[0].product.hasName).toBeTruthy('hasName failed.');
    });
});
