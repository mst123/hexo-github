---
title: 项目中遇到的问题记录
categories: 
  - javascript
  - 问题记录
tags: 
  - 问题记录
---
## 1 有效解决setTimeout跨级传参数
```
功能：修改 window.setTimeout，使之可以传递参数和对象参数 
使用方法： setTimeout(回调函数,时间,参数1,...,参数n)
```
## 2 单击和双击的冲突问题
在一个对象同时绑定单击和双击事件时，当双击该对象时，事件发生顺序为 单击-单击-双击。
解决该问题可以通过定时器解决
```        
var TimeFn = null;
$('#box').click(function () {
    clearTimeout(TimeFn);
    TimeFn = setTimeout(function(){
        console.log('click')
    },100);
});
$('#box').dblclick(function () {
    clearTimeout(TimeFn);
    console.log('dbclick');
})
```
当定时器延迟启动的时间小于300毫秒，第一个单击事件无法被抹消，发生事件为 单击-双击
（第二个单击事件和双击事件触发的时间隔间几乎为0，延迟时间对它没有影响）
当定时器延迟启动的事件大于300毫秒，第一个单击事件可以被抹消，发生事件为 双击
## 3 jQuery 事件传参   
```
  <script src="js/jquery-2.1.1.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
      function Ceshi(){
        this.a=1;
        this.b=2;
        this.c=3;
        this.d=4;    
      }
      Ceshi.prototype.aa=function(){
        var _this=this;
  //    $('input').on('click',{e:_this},this.bb) 用此方法可以拿到
        $('input').on('click',this.bb).bind(this)
      }
      Ceshi.prototype.bb=function(evt){               
        console.log(this.b)// undefined
  //    console.log(_this.b) // _this is not defined
  //    console.log(evt.data.e.b)   //用此方法可以拿到
  //    console.log(evt.clientX)
      }
      var demo=new Ceshi()
      demo.aa()
  </script>  
```
## 4 ajax 同步异步
ajax异步请求，不会按上下顺序执行，注意数组操作，以防错位，可以使用同步
## 5 利用元素记录信息
利用JSON.stringfiy 可以将复杂json数据存入元素中，利用JSON.parse可以拿出
## 6 窗口大小改变事件
window.onresize以最后一个函数为准， $(window).resize(function(){})，可以同时存在多个
## 7 判断一个对象是否存在的方法
```
if (typeof myObj == "undefined") {
　var myObj = { };
}
```
> 这是目前使用最广泛的判断javascript对象是否存在的方法。
## 8 深拷贝函数，可以复制对象中的函数及数组（很全面）
```
function deepCopy(p, c) {
  var c = c || {};
  for (var i in p) {
    if(! p.hasOwnProperty(i)){
      continue;
    }
    if (typeof p[i] === 'object') {
      c[i] = (p[i].constructor === Array) ? [] : {};
      deepCopy(p[i], c[i]);
    } else {
      c[i] = p[i];
    }
  }
  return c;
}

Parent = {name: 'foo', birthPlaces: ['北京','上海','香港']}
var Child = deepCopy(Parent);
```
## 9  'undefined' 和 undefined 使用区别
```
var obj = {
     a:1, 
}
console.log(obj.b == 'undefined') //  false
console.log(obj.b == undefined) //  true 判断元素属性是否存在的常用方法
console.log(typeof obj.b =='undefined')  //true
console.log(typeof ob)        //  'undefined'
console.log(typeof ob == 'undefined') // true  此为最常用的判断元素是否存在的方法
console.log(typeof ob == undefined) //  false
```
## 10 padding-bottom 
占位防止图片加载过程中的抖动 % 定义基于父元素宽度的百分比下内边距
## 11 siblings() 兄弟元素 且包括它本身
## 12 撑开父元素宽度超过父元素外层宽度的方法  
父元素 white-space: nowrap;  内部元素 display: inline-block; 
## 13 pointer-events
更像是JavaScript，它能够：
- 阻止用户的点击动作产生任何效果
- 阻止缺省鼠标指针的显示
- 阻止CSS里的 hover 和 active 状态的变化触发事件
- 阻止JavaScript点击动作触发的事件
pointer-events: none 顾名思义，就是鼠标事件拜拜的意思。元素应用了该 CSS 属性，链接啊，点击啊什么的都变成了 “浮云牌酱油”。pointer-events: none 的作用是让元素实体 “虚化”。例如一个应用 pointer-events: none 的按钮元素，则我们在页面上看到的这个按钮，只是一个虚幻的影子而已，您可以理解为海市蜃楼，幽灵的躯体。当我们用手触碰它的时候可以轻易地没有任何感觉地从中穿过去。
## 14 switch需要注意的地方，没有break的情况
```
function handle(num){
  switch (num){
    case 1:
      console.log(1)
    case 2:
      console.log(2)
    case 3:
      console.log(3)
    case 4:
      console.log(4)
    case 5:
      console.log(5)
    case 6:
      console.log(6)
    default:
      break;
  }
}
handle(3)   // 3 4 5 6 
```
没有break的情况下，从**满足条件开始**一直会向下执行，无视case，直至break停止
## 15 设置position absolute元素的宽高百分比时，并不是依据父元素的，而是依据定位参考的元素 
## 16 js中如何判断属性是对象实例中的属性还是原型中的属性
```
function hasPrototypeProperty(obj, name) {
  return !obj.hasOwnProperty(name) && (name in obj);
}
```
当属性存在对象实例上的时候，函数返回false，表示该属性不是存在原型上，当属性存在原型上的时候，函数返回true。
## 17 vue中 dispath(支持promise) 和 commit
```
this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
  this.$router.push({ path: '/' }); //登录成功之后重定向到首页
}).catch(err => {
  this.$message.error(err); //登录失败提示错误
});
```
```
LoginByUsername({ commit }, userInfo) {
  const username = userInfo.username.trim()
  return new Promise((resolve, reject) => {
    loginByUsername(username, userInfo.password).then(response => {
      const data = response.data
      Cookies.set('Token', response.data.token) //登录成功后将token存储在cookie之中
      commit('SET_TOKEN', data.token)
      resolve()
    }).catch(error => {
      reject(error)
    });
  });
}
```
## 18 变量提升也有优先级, 函数声明 > arguments > 变量声明
```
console.log(c);
function c(a) {
  console.log(a);
  var a = 3;
}
//function c(){...}
//案例2 
console.log(c);
var c = function (a) {
  console.log(a);
  var a = 3;
}
//undefined
```
## 19 npx讲解
npx 会帮你执行依赖包里的二进制文件
举个例子： 
```
npm i webpack -D      //非全局安装
//如果要执行 webpack 的命令
./node_modules/.bin/webpack -v
```
有了 npx 之后
```
npm i webpack -D    //非全局安装
npx webpack -v 
```
npx 会自动查找当前依赖包中的可执行文件，如果找不到，就会去 PATH 里找。如果依然找不到，就会帮你安装。

> 使用package.json中的script命令，也会优先使用依赖包里的二进制文件

## 20 引用图片,两种方式都可以
```
const url = require('./bg.jpg')
import url from './bg.jpg'
```
## 21 ES6类和TS类的区别记忆
### ES6类的写法
```
class Person {
  name = 'aaa' //可以用此方式定义实例属性初始值
  constructor(name){
    this.name = name //实例属性
  }
  say(){ //原型方法
    return this.name
  }
  //不需要符号间隔
  eat(){
    return 'food'
  }
  //静态方法，不会被实例继承，只能通过Person.destroyed()调用，可以被子类继承
  static destroyed() { 
    
  }
  //类的内部所有定义的方法，与ES5不同，都是不可枚举的（non-enumerable）
}
//仅可以用下述方式添加原型属性
Person.prototype.prop = 'prop'
```
### TS类的写法
```
// 传统写法
class Person {
  public name: string; //实例属性
  constructor(name: string) {
    this.name = name;
  }
  say(){ //原型方法
    return this.name
  }
}
// 简化写法
class Person { 
  constructor(public name: string) { //实例属性

  }
  say(){ //原型方法
    return this.name
  }
}
```
TS类 有不同的访问类型
- private, protected, public 访问类型
  - public 完全开放使用
  - private 仅允许在类内被使用
  - protected 仅允许在类内及继承的子类中使用
```
class Person {
  public name: string; //不写constructor 实例属性name压根不存在
  constructor(name: string) {
    this.name = name;
  }
  protected sayHi() {
    this.name;
    console.log('hi');
  }
  private sayABC() {
    this.name;
  }
}
```
### ES6类的继承
详细书写在分类继承下

## 22 TS转义代码中发现的`,`的骚操作
原代码较为复杂，用下方简化代码示意
```
function handle(a, b){
  console.log(a+b);
}
var d = 4
var c = ((handle(1, 2)), d)
console.log(c);
//3
//4
```
> 程序会先执行逗号之前的语句，然后把逗号之后的语句赋值
> 必须要加外层的括号
