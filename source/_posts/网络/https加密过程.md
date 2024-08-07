---
title: HTTPS加密过程简介
date: 2021-11-24
categories: 
  - 网络
tags: 
  - HTTPS
---
[简洁易懂](https://juejin.cn/post/6844903795776815117)

[详细介绍](https://juejin.cn/post/6844904127420432391)

 https加密过程详细介绍，其中用到堆成加密和非对称加密和CA数字证书

- 用户在浏览器发起HTTPS请求（如 [juejin.cn](https://juejin.cn/user/747323638163768)），默认使用服务端的443端口进行连接；

- HTTPS需要使用一套**CA数字证书**，证书内会附带一个**公钥Pub**，而与之对应的**私钥Private**保留在服务端不公开；

- 服务端收到请求，返回配置好的包含**公钥Pub**的证书给客户端；

- 客户端收到**证书**，校验合法性，主要包括是否在有效期内、证书的域名与请求的域名是否匹配，上一级证书是否有效（递归判断，直到判断到系统内置或浏览器配置好的根证书），如果不通过，则显示HTTPS警告信息，如果通过则继续；
- 客户端生成一个用于对称加密的**随机Key**，并用证书内的**公钥Pub**进行加密，发送给服务端；
- 服务端收到**随机Key**的密文，使用与**公钥Pub**配对的**私钥Private**进行解密，得到客户端真正想发送的**随机Key**；
- 服务端使用客户端发送过来的**随机Key**对要传输的HTTP数据进行对称加密，将密文返回客户端；
- 客户端使用**随机Key**对称解密密文，得到HTTP数据明文；
- 后续HTTPS请求使用之前交换好的**随机Key**进行对称加解密。

如何保证数字证书的可靠性？

1. CA机构拥有自己的一对公钥和私钥
2. CA机构在颁发证书时对证书明文信息进行哈希
   1. 包含有证书持有者、证书有效期、公钥等信息
3. 将哈希值用私钥进行**加签**，得到数字签名
4. 明文数据和数字签名组成证书，传递给客户端。
5. 客户端得到证书，分解成明文部分Text和数字签名Sig1
6. 用CA机构的公钥进行**解签**，得到Sig2（也就是CA机构对证书明文进行hash后的值）（由于CA机构是一种公信身份，因此在系统或浏览器中会内置CA机构的证书和公钥信息）
7. 用证书里声明的哈希算法对明文Text部分进行哈希得到T
8. 当自己计算得到的哈希值T与**解签**后的Sig2**相等**，表示证书可信，**没有被篡改**

>
> 作者：接水怪
> 链接：<https://juejin.cn/post/6844904127420432391>
> 来源：稀土掘金
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
