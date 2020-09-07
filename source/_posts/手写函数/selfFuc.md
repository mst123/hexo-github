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
  const arg = [...arguments].slice(1);
  // const arg = Array.slice.call(arguments, 1);
  ctx.fnc(arg)
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