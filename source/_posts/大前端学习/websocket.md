---
title: websocket
categories: 
  - 大前端
tags: 
  - websocket
---

> [websocket--阮一峰](http://www.ruanyifeng.com/blog/2017/05/websocket.html)

### 基础概念

websocket是一种网络传输协议，可在单个TCP连接上进行全双工通信，位于OSI模型的应用层。

#### 特点：

- tcp连接，与http协议兼容
- 双向通信，主动推送
- 无同源限制，协议标识符是ws（加密wss）

#### 应用场景

- 聊天、消息、点赞
- 直播评论（弹幕）
- 游戏、协同编辑、基于位置的应用

#### ws常用前端库

- ws（实现原生协议，特点：通用、性能强，定制性强）推荐
- socket.io（向下兼容协议，特点：适配性强，性能一般）

### 基础示例 ws

#### web端

```
		const ws = new WebSocket("ws://127.0.0.1:3000")
    ws.onopen = () => {
      // 向服务端发送数据
      ws.send("hello server")
      // 接收服务端发送的请求
    }
    ws.onmessage = (event) => {
      console.log(event);
    }
    
    绑定多种时间，可以使用addEventListener
    ws.addEventListener("message", function(event) {
  		var data = event.data;
  		// 处理数据
		});
```

### server端

```
const WebSocket = require('ws');
const wss = new WebSocket.Server({
  port: 3000
})

wss.on("connection", (ws) => { // ws在这
  ws.on("message", (res) => {
    console.log("提供3000服务的");
    console.log(res);
  })
  ws.send("来自客户端")
})

也可以
const ws = new WebSocket("ws://127.0.0.1:3000") // ws在这

ws.on("open", () => {
  ws.send("hello web")
  ws.on("message", (res) => {
    console.log(res);
  })
})
```

