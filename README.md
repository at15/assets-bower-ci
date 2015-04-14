assets-bower-ci
===============

[![Build Status](https://travis-ci.org/at15/assets-bower-ci.svg?branch=master)](https://travis-ci.org/at15/assets-bower-ci)

A front-end assets management tool for php frameworks

[中文版](README.zh-cn.md)

Features

1. only need one json config file
2. support compress for js and css file.
3. support dependency (but some bug #26)

Example

php

1. run `index.php` in `example/php` folder. you will see a page 
   which has `link` and `script` from the `parsed.json`
2. change `assets.json` and run `example.js`, repeat step 1, the assets loaded changed

nginx

1. in order to load fonts properly, you need to set CORS header for your static files,
   this conf file is a example. You may need to set the header in your cdn provider as well

### TODO

- [ ] Use node-config for configuration
- [ ] Upload files to cdn server
- [ ] Support env variables
- [ ] refactor to make code cleaner
- [ ] support other frameworks, like laravel, symfony.

### DONE

- [x] Use Travis CI for test.
- [x] support different environment
- [x] remove bower support. it's too hard to use
- [x] remove custom helpers, use lodash or other util libs
