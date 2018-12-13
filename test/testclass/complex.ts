import { dataType } from '../deserializer';

export class User {
    id: number;
    name: string;
    @dataType(Date)
    createdDate: Date;
}

export class Product {
    id: number;
    name: string;
}

export class OrderProduct {
    @dataType(Product)
    product: Product;
    quantity: number;
}

export class Order {
    id: number;
    @dataType(OrderProduct, true)
    products: OrderProduct[];
    @dataType(User)
    orderedBy: User;
    @dataType(Date)
    createdDate: Date;
}
