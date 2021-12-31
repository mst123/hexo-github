---
title: MongoDB mongoose 基础用法
categories: 
  - 大前端
tags: 
  - mongoose
  - MongoDB
---
[mongoose中文网](http://www.mongoosejs.net/docs/guide.html)

## mongoose 基础用法记录

### 基础用法

- 首先在mongoDB里新建一个数据库，例如test1，借助Navicat工具

![image-20210428170647238](mongoose/image-20210428170647238.png)

- 然后书写test.js

```
var mongoose = require('mongoose');
// 后面跟随的配置是安全配置，防止控制台输出警告
mongoose.connect('mongodb://39.106.100.189:10050/test1', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
// 如果有用户名 密码 可以使用
// mongoose.connect('mongodb://name:pwd@39.106.100.189:10050/test1', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
var db = mongoose.connection;
db.on('error', function () {
  console.log('error');
});
db.once('open', function() {
  console.log('success');
  var kittySchema = mongoose.Schema({
    name: String
  });

  kittySchema.methods.speak = function () {
    var greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
    console.log(greeting);
  }
  
  // 简历表
  var Kitten = mongoose.model('Kitten', kittySchema);

  var fluffy = new Kitten({ name: 'fluffy' });
  fluffy.speak(); // "Meow name is fluffy" 
  
  fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);
    fluffy.speak();
  });
});
// 还有一种方式 更加简洁
var User = mongoose.model('User', { // 建立表
 name: String,
 age: Number
});
var fluffy = new User({ name: 'ming', age: 15 }); 

fluffy.save(function (err, fluffy) { // 保存一条数据
 if (err) return console.error(err);
});
```

- 新增了一条fluffy数据，数据库显示如下

![image-20210428170922882](mongoose/image-20210428170922882.png)

### 项目中按功能拆分

一般会把mongoose初始化，Schema，和操作表分离

![image-20210428181713717](mongoose/image-20210428181713717.png)

#### mongoose初始化

```
DBHelper.js

import mongoose from 'mongoose';
import config from './index';

// 创建链接
mongoose.connect(config.DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

// 连接成功
mongoose.connection.on("connected", () => {
  console.log('success' + config.DB_URL);
})
// 连接异常
mongoose.connection.on("error", (error) => {
  console.log('error');
})

// 断开连接
mongoose.connection.on("disconnected", () => {
  console.log('断开连接');
})

export default mongoose
```

#### Schema文件

```
model/User.js // 对应数据库 users表

import mongoose from '../config/DBHelpler';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String
  },
  age: {
    type: Number
  },
  email: {
    type: String
  }
})

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
```

#### controller文件

```
// 模拟
// 增删改查基础操作
import User from './User';

// 增
const user = {
  name: "xiaoming",
  age: 30,
  email: "46546746"
}

const run = async () => {
  const data = new User(user)
  const result = await data.save() // promise
  console.log(result);
}
run();
// 查
const search = async () => {
  const result = await User.find() // promise
  console.log(result);
}
search();
// 改
const update = async () => {
  // User.updateMany
  const result = await User.updateOne({
    // filter
    name: "xiaoming"
  }, {
    email: "safasfas"
  })
  console.log(result);
}
update();
// 删
const delete_ = async () => {
  // User.deleteMany
  const result = await User.deleteOne({
    // filter
    name: "ming"
  })
  console.log(result);
}
delete_();
```

### 静态方法

添加 `Model` 的静态方法也十分简单，继续用 `animalSchema` 举例：

```javascript
  // assign a function to the "statics" object of our animalSchema
  animalSchema.statics.findByName = function(name, cb) {
    return this.find({ name: new RegExp(name, 'i') }, cb);
  };

  var Animal = mongoose.model('Animal', animalSchema);
  Animal.findByName('fido', function(err, animals) {
    console.log(animals);
  });
```

同样**不要**在静态方法中使用 ES6 箭头函数
