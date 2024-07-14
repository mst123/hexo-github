---
title: git温故知新
date: 2021-05-07
categories: 
  - 大前端
tags: 
  - git
---

作废 可以以计算机基础下的git文章进行拓展，这篇文章作废掉

### 学习网址

这可能是学习git操作最好的网址了 --------- [learngit](https://learngitbranching.js.org/?locale=zh_CN)

### tips

一个本地仓库可以对应多个远端仓库
git remote add origin xxx.git // 将本地仓库与远端建立联系 origin是仓库别名 可以自定义
git remote add origin1 xxx.git // 将本地仓库与另一个远端建立联系
如果都使用origin push将一起推送至两个仓库
如果增加`-u`指令 则使用 `git push` 默认推送到设置的仓库,不使用默认则是 `git push origin master`

### git图示

 ![image-20210426132629619](assets/git/image-20210426132629619.png)

### git命令简单介绍，后期会补全

#### **git add**

可将该文件添加到暂存区。

```
git add [file1] [file2] ...
```

添加指定目录到暂存区，包括子目录：

```
git add [dir]
```

添加当前目录下的所有文件到暂存区：

```
git add .
```

```git add -u <==> git add –update```
**提交所有被删除和修改的文件到数据暂存区**

```git add .```
**提交所有修改的和新建的数据暂存区**

```git add -A <==>git add –all```
**提交所有被删除、被替换、被修改和新增的文件到数据暂存区**

##### 撤销git add

撤销上次add

```
git checkout .  撤销add操作，不可恢复
```

单独撤销某个文件 对应vscode中的取消暂存文件

```
git reset a.txt
```

上面的这个命令是一个简写，实际上`reset`命令的完整写法如下：

```
git reset --mixed HEAD a.txt
```

 其中，`mixed`是一个模式（mode）参数，如果`reset`省略这个选项的话默认是`mixed`模式；`HEAD`指定了一个历史提交的 hash 值；`a.txt`指定了一个或者多个文件。

**该命令的自然语言描述是：不改变`work dir`中的任何数据，将`stage`区域中的`a.txt`文件还原成`HEAD`指向的`commit history`中的样子**。就相当于把对`a.txt`的修改从`stage`区撤销，但依然保存在`work dir`中，变为`unstage`的状态。

> 描述的不咋滴

#### git commit

将暂存区内容添加到仓库中

```
git commit -m '一些描述'
```

再简单提一些常见场景， 比如说`commit`完之后，突然发现一些错别字需要修改，又不想为改几个错别字而新开一个`commit`到`history`区，那么就可以使用下面这个命令：

```
git commit --amend
```

这样就是把错别字的修改和之前的那个`commit`中的修改合并，作为一个`commit`提交到`history`区。

#### 工作区命令

```
+ git clone 从远端仓库拉取代码
- git init 初始化
- git remote 远端建立连接
- git pull 拉取远端代码，并与本地合并
git log 查看提交记录 按空格持续加载 Q退出 
git log 可以显示所有提交过的版本信息，不包括已经被删除的 commit 记录和 reset 的操作
git reflog 可以查看**本地所有**的所有操作记录（包括分支、包括已经被删除的 commit 记录和 reset 的操作）,适合找回
git config 
 git config --global --list 查看全局的git配置
 git config --global user.name xxxx 设置全局user name
 git config --global user.email xx@xx 设置全局user.email
  1、仓库级别 local 【优先级最高】
  2、用户级别 global【优先级次之】
  3、系统级别 system【优先级最低】
git status 工作区 暂存区 远端是否需要拉取等信息
git restore 指令使得在工作空间但是不在暂存区的文件撤销更改
git restore --staged 的作用是将暂存区(add)的文件从暂存区撤出，但不会撤销修改
git commit -m "msg" 暂存区提交到本地仓库
```

##### git push

 **git push** 命令用于从将本地的分支版本上传到远程并合并。

命令格式如下：远程分支如果不存在，则会创建一个分支

```
git push <远程主机名> <本地分支名>:<远程分支名>
```

如果本地分支名与远程分支名相同，则可以省略冒号：

```
git push <远程主机名> <本地分支名>
```

如果当前分支与多个主机存在追踪关系，则可以使用 -u 参数指定一个默认主机，这样后面就可以不加任何参数使用git push

```
git push -u origin master 
```

当遇到这种情况就是不管是否存在对应的远程分支，将本地的所有分支都推送到远程主机，这时需要 -all 选项

```
git push --all origin 
```

**实例演示**

以下命令将本地的 master 分支推送到 origin 主机的 master 分支。

```
git push origin master
```

相等于：

```
git push origin master:master
```

如果本地版本与远程版本有差异，但又要强制推送可以使用 --force 参数：

```
git push --force origin master
```

删除主机的分支可以使用 --delete 参数，以下命令表示删除 origin 主机的 master 分支：

```
git push origin --delete master
```

> **略本地分支名，也可以删除指定的远程分支**
>
> ```
> git push origin :master
> ```

##### Git fetch

简单的来说 git pull = git fetch + git merge

git fetch 命令：

```
git fetch <远程主机名> //这个命令将某个远程主机的更新全部取回本地
```

如果只想取回特定分支的更新，可以指定分支名：

```
git fetch <远程主机名> <分支名> //注意之间有空格
```

最常见的命令如取回`origin` 主机的`master` 分支：

```
git fetch origin master
```

取回更新后，会返回一个`FETCH_HEAD` ，指的是某个branch在服务器上的最新状态，我们可以在本地通过它查看刚取回的更新信息：

```
git log -p FETCH_HEAD
```

![img](assets/git/fetch.png)

可以看到返回的信息包括更新的文件名，更新的作者和时间，以及更新的代码（19行红色[删除]和绿色[新增]部分）。我们可以通过这些信息来判断是否产生冲突，以确定是否将更新merge到当前分支。

**代码合并示例**

```
## 在本地新建一个temp分支，并将远程origin仓库的master分支代码下载到本地temp分支；
git fetch origin master:temp

## 比较本地代码与刚刚从远程下载下来的代码的区别；
git diff temp

## 合并temp分支到本地的master分支;
git merge temp

## 如果不想保留temp分支，删除;
git branch -D temp
```

#### stage暂存区命令

```
git stash 贮藏 详细看下边
```

##### git stash

`stash`命令可用于临时保存和回复修改，**可跨分支**。

> ***注：在未`add`之前才能执行`stash`！！！！\***

- `git stash [save message]`
  保存，`save`为可选项，`message`为本次保存的注释
- `git stash list`
  所有保存的记录列表
- `git stash pop stash@{num}`
  恢复，`num`是可选项，通过`git stash list`可查看具体值。**只能恢复一次**
- `git stash apply stash@{num}`
  恢复，`num`是可选项，通过`git stash list`可查看具体值。**可回复多次**
- `git stash drop stash@{num}`
  删除某个保存，`num`是可选项，通过`git stash list`可查看具体值
- `git stash clear`
  删除所有保存

#### master命令

```
git reset --hard commitID 回退版本 相当于删除中间的版本
```

##### Git diff命令的四种用法

**`git diff`** 比较「暂存区」与「工作区」之间的差异。

**`git diff commitID`** 比较「给定提交 ID」与「工作区」的差异。

**`git diff --cached commitID`** 比较「暂存区」与「给定提交 ID」的差异

**`git diff commit1 commit2`** 比较指定的两次提交 「commit1」与 「commit2」的差异

**选项** `--stat` 显示有多少行发生变化，简洁的展示差异

##### git reset

`git reset`  通过把分支记录回退几个提交记录来实现撤销改动

 `git reset HEAD~1` 回退到上次提交（撤销commit），但是文件修改后的内容还是存在于工作区的

> 远程仓库做出的修改并没有回退哦，要记住

 此时通过git log和 git reflog对比就能看出两条命令的明显区别了

![image-20210427154024280](assets/git/image-20210427154024280.png)

![image-20210427154043396](assets/git/image-20210427154043396.png)

##### Git Revert

虽然在你的本地分支中使用 `git reset` 很方便，但是这种“改写历史”的方法对大家一起使用的远程分支是无效的！**revert 之后就可以把你的更改推送到远程仓库与别人分享啦**。

`git revert HEAD`相当于相当于把上次提交的内容还原覆盖到工作区中，提交记录会增加一个，而不是减少，详细见下一节的示意

##### reset 和 revert对比

初始状态，切记HEAD~1和HEAD 不能混用，有意想不到的结果

![image-20210427154540480](assets/git/image-20210427154540480.png)

`git reset HEAD~1`

![image-20210427154611065](assets/git/image-20210427154611065.png)

`git revert HEAD`

![image-20210427154652039](assets/git/image-20210427154652039.png)

#### 分支命令

##### git branch

一般用于分支的操作，比如创建分支，查看分支等等，

　 `git branch` 不带参数：列出本地已经存在的分支，并且在当前分支的前面用"*"标记

　　`git branch -r`  查看远程版本库分支列表

　　`git branch -a` 查看所有分支列表，包括本地和远程

　　`git branch dev` 创建名为dev的分支，创建分支时需要是最新的环境，创建分支但依然停留在当前分支

　　`git branch -d dev` 删除dev分支，如果在分支中有一些未merge的提交，那么会删除分支失败

  `git branch -D dev`：强制删除dev分支

  `git branch -vv`  可以查看本地分支对应的远程分支

　　`git branch -m oldName newName`  给分支重命名

  `git branch -f main HEAD~3`  **强制修改分支位置** 向上移动3个位置

  `git branch -f main commitID`  **强制修改分支位置**到指定commit

##### Git checkout

 `git checkout master` 将分支切换到master

　`git checkout -b master` 如果分支存在则只切换分支，若不存在则创建并切换到master分支

> 在这里只介绍分支相关的命令

##### Git 合并分支的两种方式

![image-20210426180103988](assets/git/image-20210426180103988.png)

![image-20210426180149291](assets/git/image-20210426180149291.png)

> 我们在切换分支，和新建分支的时候，有没有想过，这些操作操作背后的工作原理是怎样的呢？最大的功臣就是.git目录下的HEAD引用,下面有对HEAD的详细解释

##### Git rebase

第二种合并分支的方法是 `git rebase`。Rebase 实际上就是取出一系列的提交记录，“复制”它们，然后在另外一个地方逐个的放下去。

Rebase 的优势就是可以创造更线性的提交历史，这听上去有些难以理解。如果只允许使用 Rebase 的话，代码库的提交历史将会变得异常清晰。

这个用图示比较清晰

![image-20210426201823042](assets/git/image-20210426201823042.png)
![image-20210426201909176](assets/git/image-20210426201909176.png)

![image-20210426201938207](assets/git/image-20210426201938207.png)

### Git flow

两种常见的模型

![image-20210426183300352](assets/git/image-20210426183300352.png)

![image-20210426183643468](assets/git/image-20210426183643468.png)

### git HEAD

可以把HEAD理解成一个指针，HEAD指针通常会指向一个分支，如下图所示

![image-20210427143641740](assets/git/image-20210427143641740.png)

HEAD-->master-->commitID，通常情况下，HEAD会一直跟随着当前分支，并指向分支，而分支则指向当前最新的commit

还有一种 `detached HEAD`的状态，使用`git checkout C3`即可以把HEAD指针指向C3

> 还有一种相对引用的方式，`git checkout main^`*3 或者  `git checkout main^^^` 或者 `git checkout main~3`  或者使用 `git checkout HEAD^^^`,这几种方法都是向父节点方向移动

![image-20210427144448741](assets/git/image-20210427144448741.png)

如果此时进行commit，git的返回信息会提示我们，You are in ‘detached HEAD’ state.（你现在处于’分离头’状态）。然后会从C3节点出现一个新的节点，HEAD会指向新的节点，可以简单的理解为匿名分支（图和上边不一样，仅做示意）

![image-20210427145825615](assets/git/image-20210427145825615.png)

我们现在有两个选择，如下：

- 丢弃这个匿名分支
  - 直接检出到任何一个别的分支，就相当于放弃了这些提交

- 保留这个匿名分支
  - 创建一个名为newtest的分支来保存这些提交
    - `git branch newtest c7`  这种方式HEAD并未指向newtest，而是指向了C7，仍是指针分离状态
    - `git checkout -b newtest`   HEAD指向了newtest，newtest指向了C7

- 与现存分支，参考分支命令章节

### git checkout

`git checkout`命令用于切换分支或恢复工作树文件，也可以指定HEAD指针的位置

除了分支命令中介绍的使用方法，还可以进行HEAD操作，详细见上一小节
