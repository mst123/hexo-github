---
title: 2.什么是RAIL
categories: 
  - 性能优化
tags: 
  - RAIL
  - 性能优化
---
### RAIL的概念

1. Response 响应
2. Animation 动画
3. Idle 空闲
4. Load 加载

### RAIL评估标准

1. 响应： 处理事件应在50ms以内完成
2. 动画：每10ms产生一帧（1/60 = 16.66）剩余毫秒值 浏览器需要渲染
3. 空闲： 尽可能增加空闲事件
4. 加载：在5s内完成内容加载，并可以交互