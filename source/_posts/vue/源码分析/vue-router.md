---
title: vue-router源码分析-简易流程
categories: 
  - vue
tags: 
  - vue
  - vue-router源码分析
---
### 简易流程

首先初始化vue-router实例，然后vue.use，再然后根vue初始化，作为配置传入

- vue.use vue-router

- Vue-router install

  - 混入，根组件保存router和route属性，子组件递归持有root属性
  - vue-router 初始化
    - 首先生成实例，执行constructor
      - 生成matcher，createMatcher
        - 根据routes创建一个路由映射表 {pathList, pathMap, nameMap}
        - 提供match方法
      - 根据mode，初始化相应history
    - 执行init方法-vue根实例初始化的时候执行
      - history.transitionTo 根据当前路径渲染组件
        - const route = this.router.match(location, this.current) 匹配路由
      - History.listen 定义 history.cb  在多种情况下更新 vue._route，保证其正确性，方便被watch
  - Vue.util.defineReactive(this, `_route`, this._router.history.current) 定义响应式
  - registerInstance router-view相关 主要是在route.instance保存当前rv实例
  - Object.defineProperty(Vue.prototype, `$router`和`$route`）方便组件内使用
  - Vue.component `RouterView`, `RouterLink`
  - 定义合并策略

#### 重要部分介绍

- mather介绍

  ```
  function createMatcher (
    routes: Array<RouteConfig>,
    router: VueRouter
  ): Matcher
  ```

  - createRouteMap 根据传入的routes配置，创建一个路由映射表 {pathList, pathMap, nameMap}

    > `pathList` 存储所有的 `path`
    >
    > `pathMap` 表示一个 `path` 到 `RouteRecord` 的映射关系
    >
    > `nameMap` 表示 `name` 到 `RouteRecord` 的映射关系

    - 遍历routes数组，调用addRouteRecord

      - 根据routes创建相关映射表,如果存在children，则递归处理，保证每一个路由地址都有一个与之对应的routeRecord，这条记录还会包含子路由所有层级的父record记录

      - ```
        RouteRecord
        const record: RouteRecord = {
            path: normalizedPath,
            // path 解析成一个正则表达式
            regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
            components: route.components || { default: route.component },
            alias: route.alias
              ? typeof route.alias === 'string'
                ? [route.alias]
                : route.alias
              : [],
            instances: {}, // 表示rv组件的实例
            enteredCbs: {},
            name,
            parent, // 表示父的 RouteRecord 只能向上寻找
            matchAs,
            redirect: route.redirect,
            beforeEnter: route.beforeEnter,
            meta: route.meta || {},
            props:
              route.props == null
                ? {}
                : route.components
                  ? route.props
                  : { default: route.props }
          }
        ```

    - 保证*匹配符保持在最后

  - match方法解析 匹配出对应的record，然后通过`createRoute`创建`Route`

    ```
    function match (
      raw: RawLocation(string | location),
      currentRoute?: Route,
      redirectedFrom?: Location
    ): Route
    ```

    - createRoute函数, `createRoute` 可以根据 `record` 和 `location` 创建出来，最终返回的是一条 `Route` 路径

    ```
    export function createRoute (
      record: ?RouteRecord,
      location: Location,
      redirectedFrom?: ?Location,
      router?: VueRouter
    ): Route {
      const stringifyQuery = router && router.options.stringifyQuery
    
      let query: any = location.query || {}
      try {
        query = clone(query)
      } catch (e) {}
    
      const route: Route = {
        name: location.name || (record && record.name),
        meta: (record && record.meta) || {},
        path: location.path || '/',
        hash: location.hash || '',
        query,
        params: location.params || {},
        fullPath: getFullPath(location, stringifyQuery),
        matched: record ? formatMatch(record) : []
      }
      if (redirectedFrom) {
        route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
      }
      return Object.freeze(route)
    }
    ```

    - `Route` 对象中有一个非常重要属性是 `matched`，它通过 `formatMatch(record)` 计算而来：

      ````
      function formatMatch (record: ?RouteRecord): Array<RouteRecord> {
        const res = []
        while (record) {
          res.unshift(record)
          record = record.parent
        }
        return res
      }
      
      ````

      可以看它是通过 `record` 循环向上找 `parent`，直到找到最外层，并把所有的 `record` 都 push 到一个数组中，最终返回的就是 `record` 的数组，它记录了一条线路上的所有 `record`。==`matched` 属性非常有用，它为之后渲染组件提供了依据==。

- 路径切换 history.transitonTo

- 点击 `router-link` 的时候，实际上最终会执行 `router.push`

  ```
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.history.push(location, onComplete, onAbort)
  }
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(location, route => {
    	// 
    	//	https://zhuanlan.zhihu.com/p/35036172
      pushHash(route.fullPath)
      handleScroll(this.router, route, fromRoute, false)
      onComplete && onComplete(route)
    }, onAbort)
  }
  
  ```

- 在history的初始化中，针对历史栈做了一个监听

  ```
  window.addEventListener(supportsPushState ? 'popstate' : 'hashchange'....
  ```

  之所以做监听，是为了用户在使用前进后退时，渲染正确的组件

- Router-view

- Router-Link



### 附录：源码重要类-类型注解

- history类 src/history/*.js

  ````javascript
  router: Router
    base: string
    current: Route
    pending: ?Route
    cb: (r: Route) => void
    ready: boolean
    readyCbs: Array<Function>
    readyErrorCbs: Array<Function>
    errorCbs: Array<Function>
    listeners: Array<Function>
    cleanupListeners: Function
  
    // implemented by sub-classes
    +go: (n: number) => void
    +push: (loc: RawLocation, onComplete?: Function, onAbort?: Function) => void
    +replace: (
      loc: RawLocation,
      onComplete?: Function,
      onAbort?: Function
    ) => void
    +ensureURL: (push?: boolean) => void
    +getCurrentLocation: () => string
    +setupListeners: Function
  ````

  

- matcher类 src/create-matcher.js

  ```javascript
  export type Matcher = {
    match: (raw: RawLocation, current?: Route, redirectedFrom?: Location) => Route;
    addRoutes: (routes: Array<RouteConfig>) => void;
    addRoute: (parentNameOrRoute: string | RouteConfig, route?: RouteConfig) => void;
    getRoutes: () => Array<RouteRecord>;
  };
  ```

- createRouteMap src/creat-route-map

  - `createRouteMap` 函数的目标是把用户的路由配置转换成一张路由映射表，它包含 3 个部分，
    - `pathList` 存储所有的 `path`，
    - `pathMap` 表示一个 `path` 到 `RouteRecord` 的映射关系，
    - `nameMap` 表示 `name` 到 `RouteRecord` 的映射关系。

  ```
  export function createRouteMap (
    routes: Array<RouteConfig>,
    oldPathList?: Array<string>,
    oldPathMap?: Dictionary<RouteRecord>,
    oldNameMap?: Dictionary<RouteRecord>,
    parentRoute?: RouteRecord
  ): {
    pathList: Array<string>,
    pathMap: Dictionary<RouteRecord>,
    nameMap: Dictionary<RouteRecord>
  } {...}
  ```

  - addRouterRecord 生成并添加一条routerRecord

    ```
    function addRouteRecord (
      pathList: Array<string>,
      pathMap: Dictionary<RouteRecord>,
      nameMap: Dictionary<RouteRecord>,
      route: RouteConfig,
      parent?: RouteRecord,
      matchAs?: string
    )
    ```

    

- Location RawLocation

  - Vue-Router 中定义的 `Location` 数据结构和浏览器提供的 `window.location` 部分结构有点类似，它们都是对 `url` 的结构化描述。举个例子：`/abc?foo=bar&baz=qux#hello`，它的 `path` 是 `/abc`，`query` 是 `{foo:'bar',baz:'qux'}`。

  ```javascript
  declare type Location = {
    _normalized?: boolean;
    name?: string;
    path?: string;
    hash?: string;
    query?: Dictionary<string>;
    params?: Dictionary<string>;
    append?: boolean;
    replace?: boolean;
  }
  declare type RawLocation = string | Location
  ```

- Route

  - `Route` 表示的是路由中的一条线路，它除了描述了类似 `Loctaion` 的 `path`、`query`、`hash` 这些概念，还有 `matched` 表示匹配到的所有的 `RouteRecord`。`Route` 的其他属性我们之后会介绍。

  ```typescript
  declare type Route = {
    path: string;
    name: ?string;
    hash: string;
    query: Dictionary<string>;
    params: Dictionary<string>;
    fullPath: string;
    matched: Array<RouteRecord>;
    redirectedFrom?: string;
    meta?: any;
  }
  ```

  > 可以说location 经过了match之后变成了routerRecord，routerRecord经过`_createRoute`变成了`route`
  >
  > 这样比较好理解

- RouterRecord 

  ```
  declare type RouteRecord = {
    path: string;
    alias: Array<string>;
    regex: RouteRegExp;
    components: Dictionary<any>;
    instances: Dictionary<any>;
    enteredCbs: Dictionary<Array<Function>>;
    name: ?string;
    parent: ?RouteRecord;
    redirect: ?RedirectOption;
    matchAs: ?string;
    beforeEnter: ?NavigationGuard;
    meta: any;
    props: boolean | Object | Function | Dictionary<boolean | Object | Function>;
  }
  ```

  
