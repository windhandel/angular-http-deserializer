import 'reflect-metadata';
import { newable, converter } from './types';
export declare function dataType(type: newable, isArray?: boolean): Function;
export declare function converters(converters: converter): Function;
export declare function skip(): Function;
export declare class Serializable {
    Type: newable;
    IsArray: boolean;
    Skip: boolean;
    constructor(type?: newable, isArray?: boolean, skip?: boolean);
}
export declare function getSerializable(target: any, propertyKey: string): Serializable;
export declare function getConverters(target: any, propertyKey: string): converter;
