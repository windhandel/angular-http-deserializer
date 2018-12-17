import 'reflect-metadata';
import { newable, inputValue, outputValue, deserializeSig } from './types';
export default function deserializer<T extends outputValue>(type: newable): deserializeSig<T>;
export declare function convert<T extends outputValue>(deserializeValue: inputValue, expectedType?: string | newable, valueTypeString?: string): T;
export declare function deserialize<T extends outputValue>(type: newable, deserializeData: inputValue, mustBeArray?: boolean): T | T[];
