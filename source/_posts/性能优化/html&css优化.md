---
title: 11.html和css优化
date: 2021-07-16
categories: 
  - 性能优化
tags: 
  - html和css优化
  - 性能优化
---

### html的优化

- 减少iframes的使用
  - 必须使用的时候 延迟加载，动态赋予src
- 压缩空白符
- 避免节点深层次嵌套
- 避免使用table布局（已经没人用了）
- 删除注释
- css&js 尽量外链
- 删除元素默认属性
- 语义化标签

#### 借用工具进行优化

- html-minifier (webpack已经集成)

### css优化

- 降低css对渲染的阻塞
- 利用gpu完成动画绘制
- 使用contain属性
  - [contain介绍](https://www.webhek.com/post/css-contain-property.html)
  - [MDN-contain](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain)
- 使用font-display属性
