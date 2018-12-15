export declare class User {
    id: number;
    name: string;
    createdDate: Date;
    readonly wasCreatedFirstOfMonth: boolean;
}
export declare class Product {
    id: number;
    name: string;
    readonly hasName: boolean;
}
export declare class OrderProduct {
    product: Product;
    quantity: number;
}
export declare class Order {
    id: number;
    products: OrderProduct[];
    orderedBy: User;
    createdDate: Date;
}
export declare class ErrorNotArrayOrderProduct {
    product: Product;
    quantity: number;
}
