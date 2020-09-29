---
title: leetCode
categories: 
  - 算法
tags: 
  - 算法
---
## 卡牌分组
给定一副牌，每张牌上都写着一个整数。

此时，你需要选定一个数字 X，使我们可以将整副牌按下述规则分成 1 组或更多组：

每组都有 X 张牌。组内所有的牌上都写着相同的整数。
仅当你可选的 X >= 2 时返回 true。

***
示例 1：

输入：[1,2,3,4,4,3,2,1]  
输出：true  
解释：可行的分组是 [1,1]，[2,2]，[3,3]，[4,4]  
示例 2：
***
输入：[1,1,1,2,2,2,3,3]  
输出：false  
解释：没有满足要求的分组。  
示例 3：  
***
输入：[1]  
输出：false  
解释：没有满足要求的分组。  
示例 4：  
***
输入：[1,1]  
输出：true  
解释：可行的分组是 [1,1]  
示例 5：  
***
输入：[1,1,2,2,2,2]  
输出：true  
解释：可行的分组是 [1,1]，[2,2]，[2,2]  
***
**涉及点**
- 辗转相除法 求最大公约数
- 利用哈希表计算元素出现次数
***
自己的解答
- 首先利用 `ES6` 新数据结构 `Map` ，计算元素出现的次数
- 使用`...`运算符将其转为数组，不要忘记利用 (Map.protype.values()返回的是一个新的Iterator对象)
- 然后遍历数组，取当前项与后一项做辗转相除法，求出最大公约数后赋值给后一项，直到运算完成
- 这里需要考虑[1,1]的这种情况，由于次数数组程度为 1 ，所以做了特殊处理
- 然后只要判断最后的最大公约数是否大于 2 即可
```
var hasGroupsSizeX = function(deck) {
  if(deck.length<2){
    return false
  }
  const countMap = new Map()
  for (let i = 0; i < deck.length; i++) {
    countMap.set(deck[i],countMap.has(deck[i]) ? countMap.get(deck[i]) + 1 : 1)
  }
  const countArray = [...countMap.values()] 
  console.log(countArray);
  let g;
  if(countArray.length === 1 && countArray[2] >=2 ){
    return true
  }
  for (let i = 0; i < countArray.length - 1; i++) {
    g = ojld(countArray[i], countArray[i+1])
    countArray[i+1] = g
  }
  return g >= 2
};
function ojld(chushu, yushu) {
  if(chushu % yushu === 0){
    return yushu
  }else{
    return ojld(yushu, chushu % yushu)
  }
}
```
***
网上的解答,在此仅展示部分代码，代码取第一位做了一次重复运算，所有不需要考虑特殊情况
```
/*
最大公约数
因为该数组是出现次数数组，最小值至少为1（至少出现1次），所以默认赋值为数组首位对公约数计算无干扰
*/
let g = timeAry[0];

// 遍历出现次数，计算最大公约数
timeAry.forEach(time => {
  // 因为需要比较所有牌出现次数的最大公约数，故需要一个中间值
  g = gcd(g, time);
});
```

## 605 种花问题
假设你有一个很长的花坛，一部分地块种植了花，另一部分却没有。可是，花卉不能种植在相邻的地块上，它们会争夺水源，两者都会死去。  

给定一个花坛（表示为一个数组包含0和1，其中0表示没种植花，1表示种植了花），和一个数 n 。能否在不打破种植规则的情况下种入 n 朵花？能则返回True，不能则返回False。  
***
示例 1:  
输入: flowerbed = [1,0,0,0,1], n = 1  
输出: True  
***
示例 2:   
输入: flowerbed = [1,0,0,0,1], n = 2  
输出: False  
***
注意:
- 数组内已种好的花不会违反种植规则。  
- 输入的数组长度范围为 [1, 20000]。
- n 是非负整数，且不会超过输入数组的大小。
***
官方解答, 有几个缺点
- 边界条件过于负责
- 遍历次数较多
```
var canPlaceFlowers = function(flowerbed, n) {
  let count = 0
  for (let i = 0,length = flowerbed.length; i < length; i++) {
    const item = flowerbed[i];
    if(item!=1){
      if((i==0||flowerbed[i-1]==0)&&(i==flowerbed.length-1||flowerbed[i+1]==0)){
        flowerbed[i] = 1
        count++
      }
    }
  }
  return count>=n
};
```
***
较好的解答, 通俗易懂
- 两边不为1，隐含着最左和最右的边界条件
- 当符合种花条件时，将遍历序号 +1 取代赋值，减少了遍历次数
```
var canPlaceFlowers = function (flowerbed, n) {
  var num = 0
  for (var i = 0, length = flowerbed.length; i < length; i++) {
    if (flowerbed[i] === 0 && flowerbed[i - 1] !== 1 && flowerbed[i + 1] !== 1) {
      num++
      i++
    }
  }
  return n <= num
};
```
## 格雷编码
[优秀解题思路-附带图解](https://leetcode-cn.com/problems/gray-code/solution/gray-code-jing-xiang-fan-she-fa-by-jyd/)  
主要就是找规律，据说数字电路课有讲解  
***
我的解答
```

```
## 84	柱状图中最大的矩形
给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。

求在该柱状图中，能够勾勒出来的矩形的最大面积。
![最大矩形](bg1.png)  
***
我的解法，用最原始的方法进行解答，理论上可行，但是空间复杂度和时间复杂度太复杂了
```
var largestRectangleArea = function(heights) {
  let maxArea = 0
  while (heights.length !== 0) {
    const lengths = [...heights];
    while(lengths.length !== 0){
      let area = Math.min(...lengths) * lengths.length
      if(area>maxArea){
        maxArea = area
      }
      lengths.pop()
    }
    heights.shift()
  }
  return maxArea
};
```
***
[单调栈应用优秀讲解](https://leetcode-cn.com/problems/largest-rectangle-in-histogram/solution/xiang-xi-jie-shao-dan-diao-zhan-de-li-jie-he-shi-y/)  
```
const largestRectangleArea = (heights) => {
  let maxArea = 0
  const stack = []
  heights = [0, ...heights, 0]         
  for (let i = 0; i < heights.length; i++) { 
    while (heights[i] < heights[stack[stack.length - 1]]) { // 当前bar比栈顶bar矮
      const stackTopIndex = stack.pop() // 栈顶元素出栈，并保存栈顶bar的索引
      maxArea = Math.max(               // 计算面积，并挑战最大面积
        maxArea,                        // 计算出栈的bar形成的长方形面积
        heights[stackTopIndex] * (i - stack[stack.length - 1] - 1)
      )
    }
    stack.push(i)                       // 当前bar比栈顶bar高了，入栈
  }
  return maxArea
}
```
