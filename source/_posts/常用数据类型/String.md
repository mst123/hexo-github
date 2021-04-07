---
title: String
categories: 
  - 数据类型
tags: 
  - String
  - 数据类型
---

# String

String（字符串）数据类型表示零或多个 16 位 Unicode 字符序列。

>  ECMAScript 中的字符串是不可变的，要修改 某个变量中的字符串值，必须先销毁原始的字符串，然后将包含新值的另一个字符串保存到该变量

## 转换为字符串

几乎所有值都有的 `toString()`方法。这个方法唯 一的用途就是返回当前值的字符串等价物。

> 用加号操作符给一个值加上一个空字符串""也可以将其转换为字符串

toString()方法可见于数值、布尔值、对象和字符串值。null 和 undefined 值没有 toString()方法（直接返回这两个值的字面量文本）

>  没错，字符串值也有 toString()方法， 该方法只是简单地返回自身的一个副本。

> 多数情况下，toString()不接收任何参数。不过，在对数值调用这个方法时，toString()可以接受以什么底数来输出数值的字符串表示
>
> ```
> let num = 10; 
> console.log(num.toString()); // "10" 
> console.log(num.toString(2)); // "1010" 
> console.log(num.toString(8)); // "12" 
> console.log(num.toString(10)); // "10" 
> console.log(num.toString(16)); // "a" 
> ```

