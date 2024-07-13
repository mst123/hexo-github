---
title: 常用手写函数
data: 2020-12-08
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
  const res = ctx.fnc(...arg);
  Reflect.deleteProperty(ctx, "fnc")
  return res
}
```

上面的方法借用了很多ES6的方法，让我们看一下比较原始的方法

```
Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}
```

## apply函数

```
Function.prototype.selfApply = function (context) {
  const ctx = context || window;
  ctx.fnc = this;
  const arg = [...arguments].slice(1)[0];
  // const arg = Array.slice.call(arguments, 1)[0];
  const res = ctx.fnc(...arg)
  Reflect.deleteProperty(ctx, "fnc")
  return res
}
```

不借用ES6

```
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    } else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```

> 关于 Object(context) 原文是这么说的：
>
> 非严格模式下，指定为 null 或 undefined 时会自动指向全局对象，郑航写的是严格模式下的，我写的是非严格模式下的，实际上现在的模拟代码有一点没有覆盖，就是当值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的自动包装对象。

## bind函数

- 首先书写了一个简单的bind函数，并不包括 new 操作

```
Function.prototype.myBind = function (ctx) {
  const args = [...arguments].slice(1)
  const self = this
  return function () {
    return self.apply(ctx, [...args, ...arguments])   
  }
}
```

构造函数效果的模拟实现 // TODO

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
- 创建一个空对象obj（{}）
- 将obj的[[prototype]]属性指向构造函数constrc的原型（即obj.[[prototype]] = constrc.prototype）。
- 将构造函数constrc内部的this绑定到新建的对象obj，执行constrc（也就是跟调用普通函数一样，只是此时函数的this为新创建的对象obj而已，就好像执行obj.constrc()一样）；
- 若构造函数没有返回非原始值（即不是引用类型的值），则返回该新建的对象obj（默认会添加return this）。否则，返回引用类型的值。

官方解释

- 创建一个空的简单JavaScript对象（即{}）；
- 链接该对象（设置该对象的constructor）到另一个对象 ；
- 将步骤1新创建的对象作为this的上下文 ；
- 如果该函数没有返回对象，则返回this。
  实现方式如下：

```
function createClass(_Class, ...rest) {
  const obj = {}
  const res = _Class.apply(obj, rest)
  obj.__proto__ = _Class.prototype
  return typeof res === "object" ? res : obj
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
- 将obj的原型设置为构造函数的原型，obj.**proto**= func.prototype;
- 以obj为上下文执行构造函数，func.call(obj);
- 返回obj对象。

## 手写promise

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

- 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

> 摘自阮一峰ES6深入理解

### 引入三个问题

这三个问题可以帮助理解

1、Promise 中为什么要引入微任务？

由于promise采用.then延时绑定回调机制，而new Promise时又需要直接执行promise中的方法，即发生了先执行方法后添加回调的过程，此时需等待then方法绑定两个回调后才能继续执行方法回调，便可将回调添加到当前js调用栈中执行结束后的任务队列中，由于宏任务较多容易堵塞，则采用了微任务

2、Promise 中是如何实现回调函数返回值穿透的？

首先Promise的执行结果保存在promise的data变量中，然后是.then方法返回值为使用resolved或rejected回调方法新建的一个promise对象，即例如成功则返回new Promise（resolved），将前一个promise的data值赋给新建的promise

3、Promise 出错后，是怎么通过“冒泡”传递给最后那个捕获

promise内部有resolved_和rejected_变量保存成功和失败的回调，进入.then（resolved，rejected）时会判断rejected参数是否为函数，若是函数，错误时使用rejected处理错误；若不是，则错误时直接throw错误，一直传递到最后的捕获，若最后没有被捕获，则会报错。可通过监听unhandledrejection事件捕获未处理的promise错误

### 简单的promise

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

### 进阶的promise 

实现then的链式调用

```
class MyPromise {
  PromiseResult = null; // 终值
  PromiseState = "pending"; // 状态
  toDoFulFilled = null;
  toDoRejected = null;
  // 构造方法
  constructor(executor) {
    const resolve = (value) => {
      setTimeout(() => {
        console.log("resolve");
        if (this.PromiseState !== "pending") return;
        this.PromiseState = "fulfilled";
        this.PromiseResult = value;

        if (this.toDoFulFilled) {
          this.toDoFulFilled(this.PromiseResult);
        }
      }, 0);
    };
    const reject = (reason) => {
      setTimeout(() => {
        if (this.PromiseState !== "pending") return;
        this.PromiseState = "rejected";
        this.PromiseResult = reason;

        if (this.toDoRejected) {
          this.toDoRejected(this.PromiseResult);
        }
      }, 0);
    };
    // 执行传进来的函数
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        try {
          // 这个prevRes 就是本次then的返回值
          // cb 就是 onFulfilled  onRejected
          const prevRes = cb(this.PromiseResult);
          // TODO
          if (prevRes instanceof MyPromise) {
            prevRes.then(resolve, reject);
          } else {
            resolve(prevRes);
          }
        } catch (err) {
          reject(err);
          throw new Error(err);
        }
      };

      this.toDoFulFilled = resolvePromise.bind(this, onFulfilled);
      this.toDoRejected = resolvePromise.bind(this, onRejected);
    });
  }
}

/* const test1 = new MyPromise((resolve, reject) => {
  resolve("成功");
}).then(
  (res) => {
    console.log(res);
  },
  (error) => {
    console.log(error);
  }
); */

const test2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("定时器");
  }, 2000);
})
  .then(
    (res) => {
      console.log(res);
      return res + "链式调用";
    },
    (error) => {
      console.log(error);
    }
  )
  .then(
    (res) => {
      console.log(res);
    },
    (error) => {
      console.log(error);
    }
  );
```



### 限制promise并发

主要的点

- 在then方法里启动下一次任务
- while为了塞满队列
- task是一个待启动的promise

```
class MaxDuty{
  used = 0
  tasks = []
  constructor(max) {
    this.max = max
  }
  addTask(task) {
    this.tasks.push(task)
  }
  walk() {
    if (this.tasks.length && this.used < this.max) {
      this.used++
      const task = this.tasks.shift()
      task().then(res => {
        console.log(res);
        this.used--
        this.walk()
      })
    }
  }
  start() {
    // 需要塞满
    while (this.used < this.max) {
      this.walk()
    }
  }
}
// 返回一个待启动的promise
function createTask(time, order) {
  return () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(order)
      }, time);
    })
  }
}

const maxDuty = new MaxDuty(2)

maxDuty.addTask(createTask(1000, 1))
maxDuty.addTask(createTask(500, 2))
maxDuty.addTask(createTask(300, 3))
maxDuty.addTask(createTask(400, 4))

maxDuty.start()
```



## 珂里化

第一版 比较简单，也好理解

```
var curry = function (fn) {
  // 取到fn之后的参数
  var args = [].slice.call(arguments, 1);
  // 返回一个待使用的新函数
  return function () {
    // 将新函数的参数 和 之前生成珂里化函数的参数合并
    var newArgs = args.concat([].slice.call(arguments));
    // 不改变this，使用所有参数进行调用
    return fn.apply(this, newArgs);
  };
};

function add(a, b) {
  return a + b;
}

var addCurry = curry(add, 1, 2);
addCurry() // 3
//或者
var addCurry = curry(add, 1);
addCurry(2) // 3
//或者
var addCurry = curry(add);
addCurry(1, 2) // 3
```

### 固定参数

第二版 稍微复杂一些，先看实现的效果会比较好理解一点

```
var fn = curry(function (a, b, c) {
  console.log([a, b, c]);
});

fn("a", "b", "c"); // ["a", "b", "c"]
fn("a", "b")("c"); // ["a", "b", "c"]
fn("a")("b")("c"); // ["a", "b", "c"]
fn("a")("b", "c"); // ["a", "b", "c"]
```

**首先需要明确1点**

- 参数的个数是确定的，这也是递归调用的截止条件

来看实现过程

```javascript
function curry(fn) {
  // 形参的个数 
  const length = fn.length
  let args = [].slice.call(arguments, 1)
  return function () {
    const argChild = [...args,...arguments]
    if (argChild.length === length) {
      return fn.apply(this, argChild)
    } else {
      // console.log(argChild);
      return curry.call(this, fn, ...argChild)
      // return curry.apply(this, fn, argChild)
    }
  }
}


var fn1 = curry(function(a, b, c) {
  console.log([a, b, c]);
});

fn1("a", "b", "c") // ["a", "b", "c"]
fn1("a", "b")("c") // ["a", "b", "c"]
fn1("a")("b")("c") // ["a", "b", "c"]
fn1("a")("b", "c") // ["a", "b", "c"]

var fn2 = curry(function(a, b, c) {
  console.log([a, b, c]);
}, "a");

fn2("b", "c") // ["a", "b", "c"]
fn2("b")("c") // ["a", "b", "c"]

```



### 不固定参数

这种方法太刻意了，建议闲下来的时候看看

```
// fn(a,b,c) = fn(a)(b)(c)
function curry(fn) {
    return function core(...args) {
        let params = []
        params = params.concat(args)
        let inner = function(...args2) {
            params = params.concat(args2)
            return core.apply(this, params)
        }
        inner.toString = ()=>{
            return fn.apply(null, params)
        }
        return inner
    }
}

function add(...args) {
    return args.reduce((prev,curr)=>prev + curr, 0)
}
let curriedAdd = curry(add)
alert(curriedAdd(1,2,3))

alert(curriedAdd(1, 2)(1, 2, 3))
curriedAdd(1)(2)(3)(4)(5)
```



## 防抖

[参考](https://github.com/mqyqingfeng/Blog/issues/22)

有一些需要注意的点，可以帮助理解函数，重点看代码中注释的地方

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    html, body {
      height: 100%;
      width: 100%;
    }
  </style>
</head>
<body>
  <script>
    var count = 1
    function handle(event) {
      console.log(this);
    }
    document.onmousemove = debounce(handle, 400)

    function debounce(fn, wait) {
      var timer = null
      return function () {
        clearTimeout(timer)
        timer = setTimeout(
         // 这么写 实际上没有效果
          fn.apply(this, arguments),
          // 下面的写法均有效果
          fn.bind(this, arguments),
     fn,
          wait
        )
      }
    }
  </script>
</body>
</html>
```

需要注意的是，setTimeout第一个参数需要是一个函数，而`fn.apply(this, arguments)`不能算一个函数

下面写一个比较标准的debounce，可以正确响应参数和this

```
 function debounce(fn, wait) {
      var timer = null
      return function () {
        clearTimeout(timer)
        timer = setTimeout(
          fn.bind(this, ...arguments),
          wait
        )
      }
    }
 // 不使用es6
function debounce(func, wait) {
    var timeout;

    return function () {
        var context = this;
        var args = arguments;

        clearTimeout(timeout)
        timeout = setTimeout(function(){
            func.apply(context, args)
        }, wait);
    }
}
```

### 立刻执行

这个时候，代码已经很是完善了，但是为了让这个函数更加完善，我们接下来思考一个新的需求。

这个需求就是：

我不希望非要等到事件停止触发后才执行，我希望**立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行**。

其实这个实现也算简单，主要是理解需求

```
function immedia(fn, wait) {
      var flag = true
      var timer = null
      return function () {
        clearTimeout(timer)
        // 保证不在触发后wait时间后，可以再次被触发
        timer = setTimeout(
          function () {
            flag = true
          },
          wait
        )
        if(flag){
         // 触发后 开启保护
          flag = false
          fn.apply(this, arguments)
        }
      }
    }
```

写在一个函数里，也很简单

```
 function debounce(fn, wait, immediate) {
      var timer = null
      if(immediate){
        var flag = true
        return function () {
          clearTimeout(timer)
          timer = setTimeout(
            function () {
              flag = true
            },
            wait
          )
          if(flag){
            flag = false
            fn.apply(this, arguments)
          }
        }
      }else{
        return function () {
          clearTimeout(timer)
          timer = setTimeout(
            fn.bind(this, ...arguments),
            wait
          )
        }
      }
    }
```

## 节流

节流的原理很简单：

如果你持续触发事件，每隔一段时间，只执行一次事件。

关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。

### 时间戳

```
function throttle(fn, wait) {
  const previous = 0;
  return function () {
    const now = new Date().getTime()
    if (now - previous > wait) {
      previous = now
    }
    fn.apply(this, arguments)
  }
}
```

### 定时器

```
 function throttle(fn, wait) {
      let flag = true
      return function () {
        if (flag) {
          flag = false
          fn.apply(this, arguments)
          setTimeouto=(function () {
            flag = true
          },wait)
        }
      }
    }
```

## deepclone

先看一个足够用的版本

```
function deepClone(obj) {
  if (obj === 'null') return null
  if (typeof obj !== 'object') return obj
  if (obj instanceof RegExp) return new RegExp(obj)
  if (obj instanceof Date) return new Date(obj)
  let result = new obj.constructor
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
    	result[key] = deepClone(obj[key]) 
    }
  }
  // 上面的for循环可以改成
  // Reflect.ownKeys(key => result[key] = deepClone(obj[key])
  return result
}
```



首先实现一个简单clone，包括对象 数组和基本类型的clone

```
function deepClone(target) {
  if (typeof target !== "object") {
    return target
  } else {
    const copy = Array.isArray(target) ? [] : {}
    for (const key in target) {
      copy[key] = deepClone(target[key])
    }
    return copy
  }
}
```

如果出现循环引用，就会栈溢出，如何解决这个问题呢，需要借助map数据结构

解决循环引用问题，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。

这个存储空间，需要可以存储`key-value`形式的数据，且`key`可以是一个引用类型，我们可以选择`Map`这种数据结构：

- 检查`map`中有无克隆过的对象
- 有 - 直接返回
- 没有 - 将当前对象作为`key`，克隆对象作为`value`进行存储
- 继续克隆

```
function deepClone(target) {
  const map = new Map();
  return (function _clone(target) {
    if (typeof target !== "object") {
      return target
    } else {
      if (map.has(target)) {
        return target
      }
      map.set(target, null)
      const copy = Array.isArray(target) ? [] : {}
      for (const key in target) {
        copy[key] = _clone(target[key])
      }
      return copy
    }
  })(target)
}

const target = {
  field1: 1,
  field2: undefined,
  field3: {
      child: 'child'
  },
  field4: [2, 4, 8]
};
target.target = target
console.log(deepClone(target));
```

控制台结果如下

```
{
  field1: 1,
  field2: undefined,
  field3: { child: 'child' },
  field4: [ 2, 4, 8 ],
  target: <ref *1> {
    field1: 1,
    field2: undefined,
    field3: { child: 'child' },
    field4: [ 2, 4, 8 ],
    target: [Circular *1]
  }
}
```

`circular`表示循环引用的意思，把Map换成weakMap，Map有强引用，不利用垃圾收集
