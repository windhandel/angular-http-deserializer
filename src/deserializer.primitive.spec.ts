import deserializer from './index';
import { deserializeSig, outputValue, inputValue } from './types';
import dateFormat from 'dateformat';

function be(deserializer: deserializeSig<any>, input: inputValue, output?: outputValue, comparisonConverter?: (v) => any) : void {
    let value = deserializer(input);
    if (comparisonConverter) {
        expect(comparisonConverter(value)).toEqual(comparisonConverter(output));
    } else {
        if (output != undefined) {
            expect(value).toEqual(output);
        } else {
            expect(value).toBe(null);
        }
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
    let deStringArray = deserializer<String[]>(String);
    let deNumber = deserializer<Number>(Number);
    let deNumberArray = deserializer<Number[]>(Number);
    let deDate = deserializer<Date>(Date);
    let deDateArray = deserializer<Date[]>(Date);
    let deBool = deserializer<Boolean>(Boolean);
    let deBoolArray = deserializer<Boolean[]>(Boolean);

    it('should deserialize string', () => {
        let input = '2';
        be(deString, input, input);
    });

    it('should deserialize null string', () => {
        be(deString, null);
    });

    it('should deserialize string array', () => {
        let input = [ '2', '4' ];
        be(deStringArray, input, input);
    });

    it('should deserialize number', () => {
        let input = 2;
        be(deNumber, input.toString(), input);
    });

    it('should deserialize null number', () => {
        be(deNumber, null);
    });

    it('should deserialize number array', () => {
        let output = [ 2, 4 ];
        let input = output.map(v => v.toString())
        be(deNumberArray, input, output);
    });

    it('should deserialize string date', () => {
        let input = new Date();
        be(deDate, dateFormat(input, 'yyyy-mm-dd HH:MM:ss.l'), input, dateComparer);
    });

    it('should deserialize null date', () => {
        be(deDate, null);
    });

    it('should deserialize string date array', () => {
        let diffDate = new Date();
        diffDate.setHours(diffDate.getHours() - 4);
        let output = [ new Date(), diffDate ];
        let input = output.map(v => dateFormat(v, 'yyyy-mm-dd HH:MM:ss.l'));
        be(deDateArray, input, output, dateArrayComparer);
    });

    it('should deserialize boolean true', () => {
        let input = true;
        be(deBool, input.toString(), input);
    });

    it('should deserialize boolean false', () => {
        let input = false;
        be(deBool, input.toString(), input);
    });

    it('should deserialize null boolean', () => {
        be(deBool, null);
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
        be(deBoolArray, input, input);
    });
});
