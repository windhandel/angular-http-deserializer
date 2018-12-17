import * as Complex from './complex';
export declare class ConverterOrder {
    id: number;
    products: Complex.OrderProduct[];
    orderedBy: Complex.User;
    createdDate: Date;
}
export declare class InvalidConverterOrder {
    id: number;
    products: Complex.OrderProduct[];
    orderedBy: Complex.User;
    createdDate: Date;
}
