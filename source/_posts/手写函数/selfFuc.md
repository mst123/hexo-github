---
title: 常用手写函数
categories: 
  - 面试
tags: 
  - 面试
  - 手写函数
---

## call函数
```
Function.prototype.selfCall = function(context) {
  const ctx = context || window;
  // 去除第一个参数
  const arg = [...arguments].slice(1);
  // const arg = Array.slice.call(arguments, 1);
  // 将函数赋值给ctx.fnc 
  ctx.fnc = this;
  // 执行函数
  ctx.fnc(...arg);
  Reflect.deleteProperty(ctx, "fnc")
}
```
## apply函数
```
Function.prototype.selfApply = function (context) {
  const ctx = context || window;
  ctx.fnc = this;
  const arg = [...arguments].slice(1)[0];
  // const arg = Array.slice.call(arguments, 1)[0];
  ctx.fnc(...arg)
  Reflect.deleteProperty(ctx, "fnc")
}
```

## bind函数
- 首先书写了一个简单的bind函数，并不包括 new 操作
```
Function.prototype.selfBind = function (context) {
  const ctx = context || window;
  ctx.fnc = this;
  const arg = [...arguments].slice(1);
  return function () {
    ctx.fnc(...arg)
  }
} 
```
- bind函数还有合并参数的功能

```
var a = {
  a: 1
}
function ceShi(x, y){
  console.log(this.a);
  console.log(x);
  console.log(y);
}
Function.prototype.myBind = function(ctx) {
  var context = ctx || window;
  context.fnc = this;
  var args = [...arguments].slice(1);
  return function(){
    context.fnc(...args.concat([...arguments]))
  }
}
var bindFnc1 = ceShi.bind(a, 2)
var bindFnc2 = ceShi.myBind(a, 2)
bindFnc1(3); // 1 2 3
bindFnc2(3); // 1 2 3
```
## new 操作符
首先分析一下 new 操作符
```
function Student(name, age) {
  this.name = name
  this.age = age
}
Student.prototype.say = function () {
  console.log(this.name);
}
var jojo = new Student("jsd", 23);
```
从结果分析
- 返回了一个对象，其实例属性是通过构造函数(Student)生成的
- 对象的`__proto__`指向Student.prototype
从过程分析
- 创建一个空对象obj（{}）
- 将obj的[[prototype]]属性指向构造函数constrc的原型（即obj.[[prototype]] = constrc.prototype）。
- 将构造函数constrc内部的this绑定到新建的对象obj，执行constrc（也就是跟调用普通函数一样，只是此时函数的this为新创建的对象obj而已，就好像执行obj.constrc()一样）；
- 若构造函数没有返回非原始值（即不是引用类型的值），则返回该新建的对象obj（默认会添加return this）。否则，返回引用类型的值。
实现方式如下：
```
function newFactor(ctor) {
  const arg = [...arguments].slice(1);
  var obj = {}
  ctor.call(obj, ...arg);
  obj.__proto__ = ctor.prototype;
  return obj;
}
```
利用Object.create稍微简化一下
```
function newFactorSimple(ctor) {
  const arg = [...arguments].slice(1);
  // 生成一个__proto__指向ctor.prototype的对象
  var obj = Object.create(ctor.prototype);
  ctor.call(obj, ...arg);
  return obj;
}
```
> 其实构造函数内含有return语句时，结果会出现差异
```
// 例子4
function Student(name){
    this.name = name;
    // Null（空） null
    // Undefined（未定义） undefined
    // Number（数字） 1
    // String（字符串）'1'
    // Boolean（布尔） true
    // Symbol（符号）（第六版新增） symbol
    
    // Object（对象） {}
        // Function（函数） function(){}
        // Array（数组） []
        // Date（日期） new Date()
        // RegExp（正则表达式）/a/
        // Error （错误） new Error() 
    // return /a/;
}
var student = new Student('若川');
console.log(student); {name: '若川'}
```
前面六种基本类型都会正常返回{name: '若川'}，后面的Object(包含Functoin, Array, Date, RegExg, Error)都会直接返回这些值  
**下面是考虑到各种情况后的new实现**  
```
/**
 * 模拟实现 new 操作符
 * @param  {Function} ctor [构造函数]
 * @return {Object|Function|Regex|Date|Error}      [返回结果]
 */
function newOperator(ctor){
    if(typeof ctor !== 'function'){
      throw 'newOperator function the first param must be a function';
    }
    // ES6 new.target 是指向构造函数
    newOperator.target = ctor;
    var newObj = Object.create(ctor.prototype);
    // ES5 arguments转成数组 当然也可以用ES6 [...arguments], Aarry.from(arguments);
    // 除去ctor构造函数的其余参数
    var argsArr = [].slice.call(arguments, 1);
    // 3.生成的新对象会绑定到函数调用的`this`。
    // 获取到ctor函数返回结果
    var ctorReturnResult = ctor.apply(newObj, argsArr);
    // 小结4 中这些类型中合并起来只有Object和Function两种类型 typeof null 也是'object'所以要不等于null，排除null
    var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
    var isFunction = typeof ctorReturnResult === 'function';
    if(isObject || isFunction){
      return ctorReturnResult;
    }
    // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。
    return newObj;
}
```
## create函数
很多框架源码作者使用它来初始化一个新的对象，难道是最佳实践？  
原因有二  
- 通过Object.create(null)创建出来的对象，没有任何属性，显示No properties。我们可以将其当成一个干净的 map 来使用，自主定义 toString,hasOwnProperty等方法，并且不必担心将原型链上的同名方法被覆盖。
- {...}创建的对象，使用for in遍历对象的时候，会遍历原型链上的属性，带来性能上的损耗。使用Object.create(null)则不必再对其进行遍历了。
![两种方式的比较](write1.png)  

手写Object.create
```
function ObjCreate(proto, properties) {
  // 判断类型，第一个参数传入的必须是 object, function
  if (typeof proto !== "object" && typeof proto !== "function") {
    throw new TypeError("Object prototype may only be an Object: " + proto);
  } 
  // 简单的实现的过程，忽略了properties
  var func = function() {};
  func.prototype = proto; // 将fn的原型指向传入的proto
  return new func();  // 返回创建的新对象，这里思考下，new func() 又做了什么事情呢？且往下看！
};
```
new func()的作用是创建一个新的对象，其中func是一个构造函数，在这个过程中，主要包含了如下步骤：  

- 创建空对象obj;
- 将obj的原型设置为构造函数的原型，obj.__proto__= func.prototype;
- 以obj为上下文执行构造函数，func.call(obj);
- 返回obj对象。
## 手写promise
所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。
- 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。
> 摘自阮一峰ES6深入理解

先写一个简单的promise
```
function MyPromise(executor) {
  var _this = this;
  this._status = "pending";
  this._successCallBack = null;
  this._errorCallBack = null;
  var resolve = function (res) {
    if (_this._status === "pending") {
      _this._status = "fulfilled";
      // 运行then函数传递过来的成功函数
      // 并将结果作为参数回传
      _this._successCallBack(res);
    }
  }
  var reject = function (res) {
    if (_this._status === "pending") {
      _this._status = "rejected";
      // 运行then函数传递过来的错误函数
      // 并将结果作为参数回传
      _this._errorCallBack(res);
    }
  }
  // 把内部函数resolve, reject作为参数，把传进来的函数执行一遍
  setTimeout(() => { // 使用setTimeout 是让resolve晚于then方法赋值
    executor(resolve, reject)
  }, 0)
}
MyPromise.prototype.then = function (sucess, error) {
  this._successCallBack = sucess;
  this._errorCallBack = error;
}
```