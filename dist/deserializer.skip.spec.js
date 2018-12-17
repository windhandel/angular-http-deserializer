"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Complex = require("./complex");
var index_1 = require("./index");
var decorators_1 = require("./decorators");
var SkippedOrder = /** @class */ (function () {
    function SkippedOrder() {
    }
    tslib_1.__decorate([
        decorators_1.dataType(Complex.OrderProduct, true),
        tslib_1.__metadata("design:type", Array)
    ], SkippedOrder.prototype, "products", void 0);
    tslib_1.__decorate([
        decorators_1.dataType(Complex.User),
        tslib_1.__metadata("design:type", Complex.User)
    ], SkippedOrder.prototype, "orderedBy", void 0);
    tslib_1.__decorate([
        decorators_1.skip(),
        tslib_1.__metadata("design:type", Date)
    ], SkippedOrder.prototype, "createdDate", void 0);
    return SkippedOrder;
}());
exports.SkippedOrder = SkippedOrder;
var suffixedMs = 123;
var SkippedConverterOrder = /** @class */ (function () {
    function SkippedConverterOrder() {
    }
    tslib_1.__decorate([
        decorators_1.dataType(Complex.OrderProduct, true),
        tslib_1.__metadata("design:type", Array)
    ], SkippedConverterOrder.prototype, "products", void 0);
    tslib_1.__decorate([
        decorators_1.dataType(Complex.User),
        tslib_1.__metadata("design:type", Complex.User)
    ], SkippedConverterOrder.prototype, "orderedBy", void 0);
    tslib_1.__decorate([
        decorators_1.dataType(Date),
        decorators_1.skip(),
        decorators_1.converters({
            'number': function (input) {
                var convertedDate = new Date(input);
                // Used for validation of the converter.
                convertedDate.setMilliseconds(suffixedMs);
                return convertedDate;
            }
        }),
        tslib_1.__metadata("design:type", Date)
    ], SkippedConverterOrder.prototype, "createdDate", void 0);
    return SkippedConverterOrder;
}());
exports.SkippedConverterOrder = SkippedConverterOrder;
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
describe('Deserialize Skipped', function () {
    var deSkippedOrder = index_1.default(SkippedOrder);
    var deSkippedConverterOrder = index_1.default(SkippedConverterOrder);
    it('should skip', function () {
        var deserialized = deSkippedOrder(jsonOrder);
        expect(deserialized).toBeTruthy();
        expect(deserialized.createdDate).toBeUndefined('Order.createdDate should be skipped.');
    });
    it('should fail Skip w/ Converter', function () {
        expect(function () { return deSkippedConverterOrder(jsonOrder); }).toThrow(new Error('Converters cannot be skipped for property SkippedConverterOrder.createdDate.'));
    });
});
//# sourceMappingURL=deserializer.skip.spec.js.map