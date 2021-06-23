---
title: class 重难点
categories: 
  - ES6
tags: 
  - ES6
  - Class
---

# class 重难点

## 基本语法
```
class Point {
  bar = 'hello'; // 实例属性
  baz = 'world'; // 实例属性
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
  static myStaticProp = 42; // 提案，暂未实现
  static classMethod() {
    return 'hello';
  }
  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```
- constructor注意点
  - constructor()方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。（可以用来绑定this）
  - 一个类必须有constructor()方法，如果没有显式定义，一个空的constructor()方法会被默认添加。
  - constructor()方法默认返回实例对象（即this）
- 类必须使用new调用，否则会报错
- get set方法设置的属性为prototype上的属性
- static 可以设置静态方法 只能由原型调用，实例无法调用，可以被子类继承
- 实例属性可以写在class顶部
- 静态属性 暂时只可以 Point.prop设置 (已有提案，和静态方法类似)
- 私有属性和方法有提案，在属性和方法前面 + `#`
- 拥有新特性 `new target` （用于ES5构造函数），如果构造函数不是通过new命令或Reflect.construct()调用的，new.target会返回undefined

## class的继承

```
class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)，必须放在首行
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```
- super在constructor的作用
  - 子类必须在constructor方法中调用super方法，否则新建实例时会报错，这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。
  - ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this
  - 在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有super方法才能调用父类实例。

## `super` 关键字
除了上面的注意事项，`super` 还有其它用法
### 作为函数使用
```
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```
- super() 在这里相当于 A.prototype.constructor.call(this)
- 作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错

### 作为对象使用
#### 在普通方法中，指向父类的原型对象
```
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```
**要点**
- super在普通方法之中，指向A.prototype，所以super.p()就相当于A.prototype.p()
- 在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。
```
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2
```
- 如果通过super对某个属性赋值，这时super就是子类this，赋值的属性会变成子类实例的属性
#### 在静态方法中，指向父类
```
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg); // 静态方法 指向父类
  }

  myMethod(msg) {
    super.myMethod(msg); // 普通方法 指向父类.prototype
  }
}

Child.myMethod(1); // static 1 

var child = new Child();
child.myMethod(2); // instance 2
```
- super在静态方法之中指向父类，在普通方法之中指向父类的原型对象
- 在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例
```
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;
B.m() // 3
```

## 类的 prototype 属性和__proto__属性
```
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```
上面代码中，子类B的__proto__属性指向父类A，子类B的prototype属性的__proto__属性指向父类A的prototype属性。  

这样的结果是因为，类的继承是按照下面的模式实现的。
```
class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);

const b = new B();
```
## ES6允许继承原生构造函数定义子类
```
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```