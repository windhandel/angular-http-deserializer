# angular-http-deserializer
Angular Http Deserializer

The current Angular Http Client, since it uses typescript, uses duck typing for returning objects.  i.e. The object being returned is not a constructed version of the object which you wish to have returned.

Therefore, any gettors, methods, etc on the model object being returned will not exist.  This library was built specifically in order to eliminate this problem and provide a way of easily returning constructed instances of the model objects from the Angular Http Client.

# Problem Statement

Without the use of this module, the objects being created by the angular http client are not **instances of the model**.

```
showConfig() {
  this.configService.getConfig()
    .subscribe((data: Config) => {
        if (!(data instanceof Config)) {
            throw new Error('data is not instance of Config.');
        }
    });
}
```

# Usage

The following are the required prerequisites:

1. [Use TypeScript](https://www.typescriptlang.org/docs/handbook/angular.html)
2. [Installation](#installation)
3. [Configuration Completed](#configuration)
4. [Model Annotation](#model-annotation)
5. [Http Client Deserializer Injection](#http-client-deserializer-injection)
6. [Test Updates](#test-updates)
7. [Expected Exceptions](#expected-exceptions)

# Installation

`npm install angular-http-deserializer --save`

# Configuration

In order to utilize and emit the necessary @dataType annotation you have to setup typescript within [tsconfig.json](https://www.typescriptlang.org/docs/handbook/compiler-options.html).

```
{
    ...
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
}
```

# Model Annotation

This library uses a minimalistic model annotation methodology in order to reduce the amount of effort involved in annotating the model object.  This was one of the perceived downsides of existing deserialization libraries on npm.

```
import { dataType } from 'angular-http-deserializer';

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

export class ErrorNotArrayOrderProduct {
    @dataType(Product, true)
    product: Product;
    quantity: number;
}
```

# Http Client Deserialization Injection

You'll need to first import the deserializer into your service.

`import deserializer from "angular-http-deserializer";`

From the angular http client examples:

```
showConfig() {
  this.configService.getConfig()**.map(deserialize<Config>(Config))**
    .subscribe((data: Config) => this.config = {
        heroesUrl: data['heroesUrl'],
        textfile:  data['textfile']
    });
}
```

Without the mapping and proper deserialization, the objects coming out of the Http Client will fail instanceof checks.

# Test Updates

Since your view can now expect non-duck typed objects (*real*) you'll likely want to change around some test code.  You'll want to take your regular json objects within your tests and convert them into real objects.  There's two ways you can do that, you can construct the normal deserializer as you would within a service that uses the Http Client or you can use the deepDeserializer.  This is an example of how this would work.

```
import { deepDeserializer } from "angular-http-deserializer";

let productQtyJson  {
    product: null,
    quantity: 14112
};
let productQty: ProductQuantity = deepDeserializer<ProductQuantity>(ProductQuantity, productQtyJson);
```

This way, within your tests the proper objects will now be available and property getters and methods will be accessible.

# Expected Exceptions

The deserializer is built fairly resiliently so that most things pass.  Currently, no custom deserialization is built into the annotation to enable overriding how deserialization works.  Ya get what ya get.

There are 4 expected exceptions within this module. They are the following:

1. Missing necessary dataType annotation.
Reason: When a property is an object, but offers no @dataType annotation to deserialize object.
Message: DataType annotation missing on Type ${type.prototype.constructor.name} field ${key}
2. Expected array.
Reason: When a data annotation is marked as array, but the data is not an array.
Messages:
  Array deserialization error. ${type.prototype.constructor.name}.${key} must be array.
  Array deserialization error. Object must be array.
3. Array not expected.
Reason: When a data annotation is **not** marked as array, but the data is.
Message: ${type.prototype.constructor.name}.${key} array not expected.
4. Invalid Date cast type.
Readon: Dates may be cast from 2 types, string and number.  Null or undefined are simply returned.
 If an unexpected data type is found, an exception is thrown. 
Message: Date cannot be cast from type ${typeString}
