import * as Complex from './complex';
import deserializer from './index';

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

let productArrayMisplaced = {
    product: [{
        id: 5124124,
        name: 'Jeff Prod'
    }],
    quantity: 14112
};

let productNull = {
    product: null,
    quantity: 14112
};

describe('Deserialize Complex Types', () => {
    let deOrder = deserializer<Complex.Order>(Complex.Order);
    let deOrderArray = deserializer<Complex.Order[]>(Complex.Order);
    let deFailedOrderProduct = deserializer<Complex.ErrorNotArrayOrderProduct>(Complex.ErrorNotArrayOrderProduct);
    let deOrderProduct = deserializer<Complex.OrderProduct>(Complex.OrderProduct);

    it('should deserialize Order', () => {
        let deserialized: Complex.Order = deOrder(jsonOrder);
        
        expect(deserialized).toBeTruthy();
        expect(deserialized.orderedBy.wasCreatedFirstOfMonth).toBeTruthy('wasCreatedFirstOfMonth failed.');
        expect(deserialized.products[0].product.hasName).toBeTruthy('hasName failed.');
    });

    it('should deserialize Order array', () => {
        let deserialized: Complex.Order[] = deOrderArray([
            jsonOrder,
            jsonOrder
        ]);
        
        let firstOrder = deserialized[0];
        expect(firstOrder).toBeTruthy();
        expect(firstOrder.orderedBy.wasCreatedFirstOfMonth).toBeTruthy('wasCreatedFirstOfMonth failed.');
        expect(firstOrder.products[0].product.hasName).toBeTruthy('hasName failed.');
    });

    it('should deserialize OrderProduct expected array', () => {
        const errorMsg = 'Array deserialization error. ErrorNotArrayOrderProduct.product must be array.';
        expect(() => deFailedOrderProduct(jsonOrder.products[0])).toThrowError(errorMsg);
    });

    it('should deserialize OrderProduct null product', () => {
        let deserialized: Complex.OrderProduct = <Complex.OrderProduct>deOrderProduct(productNull);
        expect(deserialized).toBeTruthy();
        expect(deserialized.product).toBeNull();
    });

    it('should deserialize OrderProduct didn\'t expect array', () => {
        //const errorMsg = 'Array deserialization error. FailedOrderProduct.product must be array.';
        expect(() => deOrderProduct(productArrayMisplaced)).toThrowError('OrderProduct.product array not expected.');
    });
});
