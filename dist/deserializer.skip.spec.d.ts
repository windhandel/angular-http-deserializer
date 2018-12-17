import * as Complex from './complex';
export declare class SkippedOrder {
    id: number;
    products: Complex.OrderProduct[];
    orderedBy: Complex.User;
    createdDate: Date;
}
export declare class SkippedConverterOrder {
    id: number;
    products: Complex.OrderProduct[];
    orderedBy: Complex.User;
    createdDate: Date;
}
