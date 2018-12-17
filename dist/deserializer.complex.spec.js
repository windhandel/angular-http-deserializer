"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Complex = require("./complex");
var index_1 = require("./index");
var orderCreated = 1545070509727;
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
    createdDate: orderCreated
};
describe('Deserialize Complex Types', function () {
    var deOrder = index_1.default(Complex.Order);
    var deOrderArray = index_1.default(Complex.Order);
    var deOrderProduct = index_1.default(Complex.OrderProduct);
    it('should deserialize Order', function () {
        var deserialized = deOrder(jsonOrder);
        expect(deserialized).toBeTruthy();
        expect(deserialized.orderedBy.wasCreatedFirstOfMonth).toBeTruthy('wasCreatedFirstOfMonth failed.');
        expect(deserialized.products[0].product.hasName).toBeTruthy('hasName failed.');
        var orderCreatedDate = new Date(orderCreated);
        expect(deserialized.createdDate).toEqual(orderCreatedDate, 'Order.createdDate invalid');
    });
    it('should deserialize null', function () {
        var deserialized = deOrder(null);
        expect(deserialized).toBeNull();
    });
    it('should deserialize undefined', function () {
        var deserialized = deOrder(undefined);
        expect(deserialized).toBeUndefined();
    });
    it('should deserialize Order array', function () {
        var deserialized = deOrderArray([
            jsonOrder,
            jsonOrder
        ]);
        var firstOrder = deserialized[0];
        expect(firstOrder).toBeTruthy();
        expect(firstOrder.orderedBy.wasCreatedFirstOfMonth).toBeTruthy('wasCreatedFirstOfMonth failed.');
        expect(firstOrder.products[0].product.hasName).toBeTruthy('hasName failed.');
    });
    it('should deserialize OrderProduct null product', function () {
        var orderNullProduct = JSON.parse(JSON.stringify(jsonOrder.products[0]));
        orderNullProduct.product = null;
        var deserialized = deOrderProduct(orderNullProduct);
        expect(deserialized).toBeTruthy();
        expect(deserialized.product).toBeNull();
    });
    it('should deserialize OrderProduct expected array exception', function () {
        var orderMissingArray = JSON.parse(JSON.stringify(jsonOrder));
        // Assign invalid array to product object.
        orderMissingArray.products = orderMissingArray.products[0];
        var errorMsg = 'Array deserialization error. Order.products must be array.';
        expect(function () { return deOrder(orderMissingArray); }).toThrowError(errorMsg);
    });
    it('should deserialize OrderProduct didn\'t expect array', function () {
        var productArrayMisplaced = JSON.parse(JSON.stringify(jsonOrder.products[0]));
        // Assign invalid array to product object.
        productArrayMisplaced.product = [{
                id: 5124124,
                name: 'Jeff Prod'
            }];
        var errorMsg = 'OrderProduct.product array not expected.';
        expect(function () { return deOrderProduct(productArrayMisplaced); }).toThrowError(errorMsg);
    });
    it('should deserialize OrderProduct missing object annotation.', function () {
        var errorMsg = 'DataType annotation missing on Type OrderProductMissingAnnotation.product';
        expect(function () { return index_1.default(Complex.OrderProductMissingAnnotation)(jsonOrder.products[0]); }).toThrowError(errorMsg);
    });
    it('should deserialize OrderProduct missing object annotation can skip.', function () {
        expect(index_1.default(Complex.OrderProductMissingAnnotationSkipped)(jsonOrder.products[0])).toBeTruthy();
    });
});
//# sourceMappingURL=deserializer.complex.spec.js.map