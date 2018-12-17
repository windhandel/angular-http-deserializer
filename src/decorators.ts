import 'reflect-metadata';
import { newable, converter } from './types';

const dataTypeMetadataKey = Symbol("dataType");
const isArrayMetadataKey = Symbol("isArray");
const skipMetadataKey = Symbol("skip");
const converterMetadataKey = Symbol("converters");

export function dataType(type: newable, isArray?: boolean): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(dataTypeMetadataKey, type, target, propertyKey);
        if (isArray) {
            Reflect.defineMetadata(isArrayMetadataKey, isArray, target, propertyKey);
        }
    };
}

export function converters(converters: converter): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        debugger;
        Reflect.defineMetadata(converterMetadataKey, converters, target, propertyKey);
    };
}

export function skip(): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(skipMetadataKey, true, target, propertyKey);
    };
}

export class Serializable {
    Type: newable;
    IsArray: boolean;
    Skip: boolean;

    constructor(type?: newable, isArray?: boolean, skip?: boolean) {
        this.Type = type;
        this.IsArray = isArray || false;
        this.Skip = skip || false;
    }
}

export function getSerializable(target: any, propertyKey: string): Serializable {
    return new Serializable(
        Reflect.getMetadata(dataTypeMetadataKey, target, propertyKey),
        Reflect.getMetadata(isArrayMetadataKey, target, propertyKey),
        Reflect.getMetadata(skipMetadataKey, target, propertyKey)
    );
}

export function getConverters(target: any, propertyKey: string): converter {
    return Reflect.getMetadata(converterMetadataKey, target, propertyKey) as converter;
}
