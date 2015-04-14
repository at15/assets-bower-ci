assets-bower-ci
===============

[![Build Status](https://travis-ci.org/at15/assets-bower-ci.svg?branch=master)](https://travis-ci.org/at15/assets-bower-ci)

php框架的前端资源管理

[English](README.md)

特点

1. 只需要一个json配置文件
2. js和css压缩
3. 支持内部的依赖 (还没解决递归引用的bug #26)

示例

php

1. 运行`example/php/index.php`会返回一个html页面，里面的静态文件是根据parsed.json里的内容生成的.
2. 修改`assets.json` 然后运行`example.js`,重复步骤1，返回的html页面中css和js文件链接会改变

nginx

1. 从不同源加载字体文件时，必须在字体所在的服务器上设置CORS的header,
   比如`example/nginx/static_server.conf`

### TODO

- [ ] Use node-config for configuration
- [ ] 支持上传文件到CDN服务器，（阿里云 etc)
- [ ] Support env variables
- [ ] refactor to make code cleaner
- [ ] support other frameworks, like laravel, symfony.

### DONE

- [x] Use Travis CI for test.
- [x] support different environment
- [x] remove bower support. it's too hard to use
- [x] remove custom helpers, use lodash or other util libs