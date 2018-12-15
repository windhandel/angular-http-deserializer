"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Complex = require("./complex");
var index_1 = require("./index");
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
var productArrayMisplaced = {
    product: [{
            id: 5124124,
            name: 'Jeff Prod'
        }],
    quantity: 14112
};
var productNull = {
    product: null,
    quantity: 14112
};
describe('Deserialize Complex Types', function () {
    var deOrder = index_1.default(Complex.Order);
    var deFailedOrderProduct = index_1.default(Complex.ErrorNotArrayOrderProduct);
    var deOrderProduct = index_1.default(Complex.OrderProduct);
    it('should deserialize Order', function () {
        var deserialized = deOrder(jsonOrder);
        expect(deserialized).toBeTruthy();
        expect(deserialized.orderedBy.wasCreatedFirstOfMonth).toBeTruthy('wasCreatedFirstOfMonth failed.');
        expect(deserialized.products[0].product.hasName).toBeTruthy('hasName failed.');
    });
    it('should deserialize Order array', function () {
        var deserialized = deOrder([
            jsonOrder,
            jsonOrder
        ]);
        var firstOrder = deserialized[0];
        expect(firstOrder).toBeTruthy();
        expect(firstOrder.orderedBy.wasCreatedFirstOfMonth).toBeTruthy('wasCreatedFirstOfMonth failed.');
        expect(firstOrder.products[0].product.hasName).toBeTruthy('hasName failed.');
    });
    it('should deserialize OrderProduct expected array', function () {
        var errorMsg = 'Array deserialization error. ErrorNotArrayOrderProduct.product must be array.';
        expect(function () { return deFailedOrderProduct(jsonOrder.products[0]); }).toThrowError(errorMsg);
    });
    it('should deserialize OrderProduct null product', function () {
        var deserialized = deOrderProduct(productNull);
        expect(deserialized).toBeTruthy();
        expect(deserialized.product).toBeNull();
    });
    it('should deserialize OrderProduct didn\'t expect array', function () {
        //const errorMsg = 'Array deserialization error. FailedOrderProduct.product must be array.';
        expect(function () { return deOrderProduct(productArrayMisplaced); }).toThrowError('OrderProduct.product array not expected.');
    });
});
//# sourceMappingURL=deserializer.complex.spec.js.map