import { deserializer, deepDeserializeSig, primitiveObjectOrArray, outputValue, inputValue } from "./deserializer";

function be<T extends outputValue>(deserializer: deepDeserializeSig<T>, input: primitiveObjectOrArray<inputValue>, output: primitiveObjectOrArray<T>) : void {
    expect(deserializer(input.toString())).toBe(output);
};

describe('Deserialize Basic Types', () => {
    let deString = deserializer<String>(String);
    let deNumber = deserializer<Number>(Number);
    let deDate = deserializer<Date>(Date);
    let deBool = deserializer<Boolean>(Boolean);

    it('should deserialize string', () => {
        let input = '2';
        be(deString, input, input);
    });

    // it('should deserialize string array', () => {
    //     let input = [ '2', '4' ];
    //     be(deString, input, input);
    // });


    // it('should deserialize number', () => {
    //     let input = 2;
    //     be(deNumber, input.toString(), input);
    // });

    // it('should deserialize number array', () => {
    //     let input = [ 2, 4 ];
    //     be(deNumber, input.map(v => v.toString()), input);
    // });

    // it('should deserialize date', () => {
    //     let input = new Date();
    //     be(deDate, input.toString(), input);
    // });

    // it('should deserialize date array', () => {
    //     let diffDate = new Date();
    //     diffDate.setHours(diffDate.getHours() - 4);
    //     let input = [ new Date(), diffDate ];
    //     be(deDate, input.map(v => v.toString()), input);
    // });

    // it('should deserialize boolean true', () => {
    //     let input = true;
    //     be(deBool, input.toString(), input);
    // });

    // it('should deserialize boolean false', () => {
    //     let input = false;
    //     be(deBool, input.toString(), input);
    // });

    // it('should deserialize boolean string true', () => {
    //     let input = true;
    //     be(deBool, input.toString(), input);
    // });

    // it('should deserialize boolean string false', () => {
    //     let input = false;
    //     be(deBool, input.toString(), input);
    // });

    // it('should deserialize boolean array', () => {
    //     let input = [ true, false, true ];
    //     be(deBool, input, input);
    // });
});
