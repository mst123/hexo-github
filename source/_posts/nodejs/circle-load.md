---
title: commonjs循环加载
data: 2022-01-04 14:53:13
categories: 
  - nodejs
tags: 
  - nodejs
  - 循环加载
  - commonjs
---
## 介绍一下commonjs循环加载的处理方式

脚本文件`a.js`代码如下。

```javascript
exports.done = false;
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');
```

上面代码之中，`a.js`脚本先输出一个`done`变量，然后加载另一个脚本文件`b.js`。注意，此时`a.js`代码就停在这里，等待`b.js`执行完毕，再往下执行。

再看`b.js`的代码。

```javascript
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
```

上面代码之中，`b.js`执行到第二行，就会去加载`a.js`，这时，就发生了“循环加载”。系统会去`a.js`模块对应对象的`exports`属性取值，可是因为`a.js`还没有执行完，从`exports`属性只能取回已经执行的部分，而不是最后的值。

`a.js`已经执行的部分，只有一行。

```javascript
exports.done = false;
```

因此，对于`b.js`来说，它从`a.js`只输入一个变量`done`，值为`false`。

然后，`b.js`接着往下执行，等到全部执行完毕，再把执行权交还给`a.js`。于是，`a.js`接着往下执行，直到执行完毕。我们写一个脚本`main.js`，验证这个过程。

```javascript
var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);
```

执行`main.js`，运行结果如下。

```javascript
$ node main.js

在 b.js 之中，a.done = false
b.js 执行完毕
在 a.js 之中，b.done = true
a.js 执行完毕
在 main.js 之中, a.done=true, b.done=true
```

具体执行顺序如下

```javascript
// main.js
var a = require('./a.js'); // 1
var b = require('./b.js'); // 12
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done); // 13

// a.js
exports.done = false; // 2
var b = require('./b.js'); // 3
console.log('在 a.js 之中，b.done = %j', b.done); // 9
exports.done = true; // 10
console.log('a.js 执行完毕'); // 11

// b.js
exports.done = false; // 4
var a = require('./a.js'); // 5
console.log('在 b.js 之中，a.done = %j', a.done); // 6
exports.done = true; // 7
console.log('b.js 执行完毕'); // 8
```
