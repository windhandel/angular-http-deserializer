"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var dateformat_1 = require("dateformat");
function be(deserializer, input, output, comparisonConverter) {
    var value = deserializer(input);
    if (comparisonConverter) {
        expect(comparisonConverter(value)).toEqual(comparisonConverter(output));
    }
    else {
        if (output != undefined) {
            expect(value).toEqual(output);
        }
        else {
            expect(value).toBe(null);
        }
    }
}
;
function dateComparer(input) {
    var comparison = input.getTime();
    return comparison;
}
function dateArrayComparer(input) {
    var comparison = input.map(function (d) { return d.getTime(); });
    return comparison;
}
describe('Deserialize Basic Types', function () {
    var deString = index_1.default(String);
    var deNumber = index_1.default(Number);
    var deDate = index_1.default(Date);
    var deBool = index_1.default(Boolean);
    it('should deserialize string', function () {
        var input = '2';
        be(deString, input, input);
    });
    it('should deserialize null string', function () {
        be(deString, null);
    });
    it('should deserialize string array', function () {
        var input = ['2', '4'];
        be(deString, input, input);
    });
    it('should deserialize number', function () {
        var input = 2;
        be(deNumber, input.toString(), input);
    });
    it('should deserialize null number', function () {
        be(deNumber, null);
    });
    it('should deserialize number array', function () {
        var output = [2, 4];
        var input = output.map(function (v) { return v.toString(); });
        be(deNumber, input, output);
    });
    it('should deserialize string date', function () {
        var input = new Date();
        be(deDate, dateformat_1.default(input, 'yyyy-mm-dd HH:MM:ss.l'), input, dateComparer);
    });
    it('should deserialize null date', function () {
        be(deDate, null);
    });
    it('should deserialize string date array', function () {
        var diffDate = new Date();
        diffDate.setHours(diffDate.getHours() - 4);
        var output = [new Date(), diffDate];
        var input = output.map(function (v) { return dateformat_1.default(v, 'yyyy-mm-dd HH:MM:ss.l'); });
        be(deDate, input, output, dateArrayComparer);
    });
    it('should deserialize boolean true', function () {
        var input = true;
        be(deBool, input.toString(), input);
    });
    it('should deserialize boolean false', function () {
        var input = false;
        be(deBool, input.toString(), input);
    });
    it('should deserialize null boolean', function () {
        be(deBool, null);
    });
    it('should deserialize boolean string true', function () {
        var input = true;
        be(deBool, input.toString(), input);
    });
    it('should deserialize boolean string false', function () {
        var input = false;
        be(deBool, input.toString(), input);
    });
    it('should deserialize boolean array', function () {
        var input = [true, false, true];
        be(deBool, input, input);
    });
});
//# sourceMappingURL=deserializer.primitive.spec.js.map