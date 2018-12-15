"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var index_1 = require("./index");
var User = /** @class */ (function () {
    function User() {
    }
    Object.defineProperty(User.prototype, "wasCreatedFirstOfMonth", {
        get: function () {
            return this.createdDate.getDate() == 1;
        },
        enumerable: true,
        configurable: true
    });
    tslib_1.__decorate([
        index_1.dataType(Date),
        tslib_1.__metadata("design:type", Date)
    ], User.prototype, "createdDate", void 0);
    return User;
}());
exports.User = User;
var Product = /** @class */ (function () {
    function Product() {
    }
    Object.defineProperty(Product.prototype, "hasName", {
        get: function () {
            return !!this.name;
        },
        enumerable: true,
        configurable: true
    });
    return Product;
}());
exports.Product = Product;
var OrderProduct = /** @class */ (function () {
    function OrderProduct() {
    }
    tslib_1.__decorate([
        index_1.dataType(Product),
        tslib_1.__metadata("design:type", Product)
    ], OrderProduct.prototype, "product", void 0);
    return OrderProduct;
}());
exports.OrderProduct = OrderProduct;
var Order = /** @class */ (function () {
    function Order() {
    }
    tslib_1.__decorate([
        index_1.dataType(OrderProduct, true),
        tslib_1.__metadata("design:type", Array)
    ], Order.prototype, "products", void 0);
    tslib_1.__decorate([
        index_1.dataType(User),
        tslib_1.__metadata("design:type", User)
    ], Order.prototype, "orderedBy", void 0);
    tslib_1.__decorate([
        index_1.dataType(Date),
        tslib_1.__metadata("design:type", Date)
    ], Order.prototype, "createdDate", void 0);
    return Order;
}());
exports.Order = Order;
var ErrorNotArrayOrderProduct = /** @class */ (function () {
    function ErrorNotArrayOrderProduct() {
    }
    tslib_1.__decorate([
        index_1.dataType(Product, true),
        tslib_1.__metadata("design:type", Product)
    ], ErrorNotArrayOrderProduct.prototype, "product", void 0);
    return ErrorNotArrayOrderProduct;
}());
exports.ErrorNotArrayOrderProduct = ErrorNotArrayOrderProduct;
//# sourceMappingURL=complex.js.map