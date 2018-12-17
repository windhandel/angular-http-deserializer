import * as Complex from './complex';
import deserializer from './index';

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

describe('Deserialize Complex Types', () => {
    let deOrder = deserializer<Complex.Order>(Complex.Order);
    let deOrderArray = deserializer<Complex.Order[]>(Complex.Order);
    let deOrderProduct = deserializer<Complex.OrderProduct>(Complex.OrderProduct);

    it('should deserialize Order', () => {
        let deserialized: Complex.Order = deOrder(jsonOrder);
        
        expect(deserialized).toBeTruthy();
        expect(deserialized.orderedBy.wasCreatedFirstOfMonth).toBeTruthy('wasCreatedFirstOfMonth failed.');
        expect(deserialized.products[0].product.hasName).toBeTruthy('hasName failed.');
        let orderCreatedDate = new Date(orderCreated);
        expect(deserialized.createdDate).toEqual(orderCreatedDate, 'Order.createdDate invalid');
    });

    it('should deserialize null', () => {
        let deserialized: Complex.Order = deOrder(null);
        
        expect(deserialized).toBeNull();
    });

    it('should deserialize undefined', () => {
        let deserialized: Complex.Order = deOrder(undefined);
        
        expect(deserialized).toBeUndefined();
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

    it('should deserialize OrderProduct null product', () => {
        let orderNullProduct = JSON.parse(JSON.stringify(jsonOrder.products[0]));
        orderNullProduct.product = null;
        let deserialized: Complex.OrderProduct = <Complex.OrderProduct>deOrderProduct(orderNullProduct);
        expect(deserialized).toBeTruthy();
        expect(deserialized.product).toBeNull();
    });

    it('should deserialize OrderProduct expected array exception', () => {
        let orderMissingArray = JSON.parse(JSON.stringify(jsonOrder));
        // Assign invalid array to product object.
        orderMissingArray.products = orderMissingArray.products[0];
        const errorMsg = 'Array deserialization error. Order.products must be array.';
        expect(() => deOrder(orderMissingArray)).toThrowError(errorMsg);
    });

    it('should deserialize OrderProduct didn\'t expect array', () => {
        let productArrayMisplaced = JSON.parse(JSON.stringify(jsonOrder.products[0]));
        // Assign invalid array to product object.
        productArrayMisplaced.product = [{
            id: 5124124,
            name: 'Jeff Prod'
        }];

        const errorMsg = 'OrderProduct.product array not expected.';
        expect(() => deOrderProduct(productArrayMisplaced)).toThrowError(errorMsg);
    });

    it('should deserialize OrderProduct missing object annotation.', () => {
        const errorMsg = 'DataType annotation missing on Type OrderProductMissingAnnotation.product';
        expect(() => deserializer<Complex.OrderProductMissingAnnotation>(Complex.OrderProductMissingAnnotation)(jsonOrder.products[0])).toThrowError(errorMsg);
    });

    it('should deserialize OrderProduct missing object annotation can skip.', () => {
        expect(deserializer<Complex.OrderProductMissingAnnotationSkipped>(Complex.OrderProductMissingAnnotationSkipped)(jsonOrder.products[0])).toBeTruthy();
    });
    
});
