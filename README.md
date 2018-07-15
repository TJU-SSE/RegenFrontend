
# Regen2Vue

> Regen网站前端。网址: http://regen.org.cn/。

## 环境
- `Node` >= 8.0
- `npm` >= 5.0


## 安装
``` bash
# install dependencies
$ npm install
```

## 开发
``` bash
# 后端配置了对9092端口、相同ip可以跨域访问
# 在本地运行后端项目后，如下运行
$ PORT=9092 npm run dev
```
## 生产
``` bash
# 将build后的静态文件(/dist)放在如下服务器目录：
#   /root/regen/regenFrontend
$ npm run build
```


## Tips

- 本仓库为Regen的前端，使用`Vue2`开发，登录信息存储使用`Vuex`，路由使用了`vue-router`，部分UI使用了[Element](http://element.eleme.io/#/zh-CN)。
- 后端仓库地址为[Regeneration](https://github.com/DancingLinks/Regeneration)。
- 在服务器上，后端部署在`3000`端口，前端（本项目）通过`Nginx`部署在`9092`端口。
- 因为服务器上部署了两个网站，所以通过域名`regen.org.cn`访问，首先到`80`端口，再通过`Nginx`转发到`9092`端口。

## 目录结构
- dist // build后的静态文件目录
- src
    - config // 配置信息
    - router // 路由信息
    - service // 封装对后端的访问api
    - store // user信息的全局状态
    - views // 组件根目录
        - admin // 管理员相关组件
        - components // 组件
        - navbar // Footer & Header
        - . // pages
- static // 组件公用静态文件
    - css // 公共css
    - font // 公共字体
    - img // 公共图片
