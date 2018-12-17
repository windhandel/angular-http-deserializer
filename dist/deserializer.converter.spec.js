"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Complex = require("./complex");
var index_1 = require("./index");
var decorators_1 = require("./decorators");
var suffixedMs = 123;
var ConverterOrder = /** @class */ (function () {
    function ConverterOrder() {
    }
    tslib_1.__decorate([
        decorators_1.dataType(Complex.OrderProduct, true),
        tslib_1.__metadata("design:type", Array)
    ], ConverterOrder.prototype, "products", void 0);
    tslib_1.__decorate([
        decorators_1.dataType(Complex.User),
        tslib_1.__metadata("design:type", Complex.User)
    ], ConverterOrder.prototype, "orderedBy", void 0);
    tslib_1.__decorate([
        decorators_1.dataType(Date),
        decorators_1.converters({
            'number': function (input) {
                var convertedDate = new Date(input);
                // Used for validation of the converter.
                convertedDate.setMilliseconds(suffixedMs);
                return convertedDate;
            }
        }),
        tslib_1.__metadata("design:type", Date)
    ], ConverterOrder.prototype, "createdDate", void 0);
    return ConverterOrder;
}());
exports.ConverterOrder = ConverterOrder;
var InvalidConverterOrder = /** @class */ (function () {
    function InvalidConverterOrder() {
    }
    tslib_1.__decorate([
        decorators_1.dataType(Complex.OrderProduct, true),
        tslib_1.__metadata("design:type", Array)
    ], InvalidConverterOrder.prototype, "products", void 0);
    tslib_1.__decorate([
        decorators_1.dataType(Complex.User),
        tslib_1.__metadata("design:type", Complex.User)
    ], InvalidConverterOrder.prototype, "orderedBy", void 0);
    tslib_1.__decorate([
        decorators_1.dataType(Date),
        decorators_1.converters({
            'number': function (input) {
                return 12; // Conversion should throw error for wrong output type.
            }
        }),
        tslib_1.__metadata("design:type", Date)
    ], InvalidConverterOrder.prototype, "createdDate", void 0);
    return InvalidConverterOrder;
}());
exports.InvalidConverterOrder = InvalidConverterOrder;
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
describe('Deserialize Converter', function () {
    var deConverterOrder = index_1.default(ConverterOrder);
    var deInvalidConverterOrder = index_1.default(InvalidConverterOrder);
    it('should deserialize Order', function () {
        var deserialized = deConverterOrder(jsonOrder);
        expect(deserialized).toBeTruthy();
        expect(deserialized.createdDate.getMilliseconds()).toEqual(suffixedMs, 'Order.createdDate not converted.');
    });
    it('should convert invalid output type throw error.', function () {
        expect(function () { return deInvalidConverterOrder(jsonOrder); }).toThrowError('Converter output type invalid for property InvalidConverterOrder.createdDate, expected date received number.');
    });
    it('should deserialize Order', function () {
        var copyJsonOrder = JSON.parse(JSON.stringify(jsonOrder));
        // No string converter supplied, throw exception.
        copyJsonOrder.createdDate = '11/1/2008 5:11:12 pm';
        expect(function () { return deConverterOrder(copyJsonOrder); }).toThrowError('Converters for property ConverterOrder.createdDate input type string required.');
    });
});
//# sourceMappingURL=deserializer.converter.spec.js.map