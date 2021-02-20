---
title: vue问题记录
categories: 
  - vue
tags: 
  - vue
---

## v-model 的修饰符
### .prop
将属性绑定至dom的原生properties,看下边例子

```
<div v-bind:test="ceshiProp" class="prop"></div>
<div v-bind.prop:test="ceshiProp" class="prop"></div>
ceshiProp: {
  a:1,
  b:2	
}
```

渲染结果如下：

![image-20210121155711009](vue//image-20210121155711009.png)

- Property：节点对象在内存中存储的属性，可以访问和设置。
- Attribute：节点对象的其中一个属性( property )，值是一个对象，可以通过点访问法 document.getElementById('xx').attributes 或者 document.getElementById('xx').getAttributes('xx') 读取，通过 document.getElementById('xx').setAttribute('xx',value) 新增和修改。
  在标签里定义的所有属性包括 HTML 属性和自定义属性都会在 attributes 对象里以键值对的方式存在。

太深层的暂不探究

### .number

自动将数值转换为number

## v-on 修饰符

### .passive

passive这个修饰符会执行默认方法。你们可能会问，明明默认执行为什么会设置这样一个修饰符。这就要说一下这个修饰符的本意了。

​    【浏览器只有等内核线程执行到事件监听器对应的JavaScript代码时，才能知道内部是否会调用preventDefault函数来阻止事件的默认行为，所以浏览器本身是没有办法对这种场景进行优化的。这种场景下，用户的手势事件无法快速产生，会导致页面无法快速执行滑动逻辑，从而让用户感觉到页面卡顿。】

​    通俗点说就是每次事件产生，浏览器都会去查询一下是否有preventDefault阻止该次事件的默认动作。我们加上**passive就是为了告诉浏览器，不用查询了，我们没用preventDefault阻止默认动作。**

​    这里一般用在滚动监听，@scoll，@touchmove 。因为滚动监听过程中，移动每个像素都会产生一次事件，每次都使用内核线程查询prevent会使滑动卡顿。我们通过passive将内核线程查询跳过，可以大大提升滑动的流畅度。

## 生命周期

#### 要掌握每个生命周期什么时候被调用

1. beforeCreate 在实例初始化之后，数据观测(data observer) 之前被调用。
2. created 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算，
   watch/event 事件回调。这里没有$el
3. beforeMount 在挂载开始之前被调用：相关的 render 函数首次被调用。
4. mounted el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
5. beforeUpdate 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。
6. updated 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
7. beforeDestroy 实例销毁之前调用。在这一步，实例仍然完全可用。
8. destroyed Vue 实例销毁后调用。调用后， Vue
   实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用

#### 要掌握每个生命周期内部可以做什么事

1. created 实例已经创建完成，因为它是最早触发的原因可以进行一些数据，资源的请求。
2. mounted 实例已经挂载完成，可以进行一些DOM操作
3. beforeUpdate 可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。
4. updated 可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
5. destroyed 可以执行一些优化操作,清空定时器，解除绑定事件