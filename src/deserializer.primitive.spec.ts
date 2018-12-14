import { deserializer, deepDeserializeSig, primitiveObjectOrArray, outputValue, inputValue } from "./deserializer";
import dateFormat from 'dateformat';

function be<T extends outputValue>(deserializer: deepDeserializeSig<T>, input: primitiveObjectOrArray<inputValue>, output: primitiveObjectOrArray<T>, comparisonConverter?: (v) => any) : void {
    let value = deserializer(input);
    if (comparisonConverter) {
        expect(comparisonConverter(value)).toEqual(comparisonConverter(output));
    } else {
        expect(value).toEqual(output);
    }
};

function dateComparer(input: Date): number {
    let comparison = input.getTime();
    return comparison;
}

function dateArrayComparer(input: Date[]): number[] {
    let comparison = input.map(d => d.getTime());
    return comparison;
}

describe('Deserialize Basic Types', () => {
    let deString = deserializer<String>(String);
    let deNumber = deserializer<Number>(Number);
    let deDate = deserializer<Date>(Date);
    let deBool = deserializer<Boolean>(Boolean);

    it('should deserialize string', () => {
        let input = '2';
        be(deString, input, input);
    });

    it('should deserialize string array', () => {
        let input = [ '2', '4' ];
        be(deString, input, input);
    });

    it('should deserialize number', () => {
        let input = 2;
        be(deNumber, input.toString(), input);
    });

    it('should deserialize number array', () => {
        let output = [ 2, 4 ];
        let input = output.map(v => v.toString())
        be(deNumber, input, output);
    });

    it('should deserialize string date', () => {
        let input = new Date();
        be(deDate, dateFormat(input, 'yyyy-mm-dd HH:MM:ss.l'), input, dateComparer);
    });

    it('should deserialize string date array', () => {
        let diffDate = new Date();
        diffDate.setHours(diffDate.getHours() - 4);
        let output = [ new Date(), diffDate ];
        let input = output.map(v => dateFormat(v, 'yyyy-mm-dd HH:MM:ss.l'));
        be(deDate, input, output, dateArrayComparer);
    });

    it('should deserialize boolean true', () => {
        let input = true;
        be(deBool, input.toString(), input);
    });

    it('should deserialize boolean false', () => {
        let input = false;
        be(deBool, input.toString(), input);
    });

    it('should deserialize boolean string true', () => {
        let input = true;
        be(deBool, input.toString(), input);
    });

    it('should deserialize boolean string false', () => {
        let input = false;
        be(deBool, input.toString(), input);
    });

    it('should deserialize boolean array', () => {
        let input = [ true, false, true ];
        be(deBool, input, input);
    });
});
