import { dataType } from './deserializer';

export class User {
    id: number;
    name: string;
    @dataType(Date)
    createdDate: Date;
    get wasCreatedFirstOfMonth() : boolean {
        return this.createdDate.getDate() == 1;
    }
}

export class Product {
    id: number;
    name: string;

    get hasName(): boolean {
        return !!this.name;
    }
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
