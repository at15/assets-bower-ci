assets-bower-ci
===============

combine bower and front-end assets with codeignitor

1. parse.js 根据assets.json生成parse过后的lib和group parsed.json (如果不是production模式就不会压缩)
2. page.js 根据assets.json和parsed.json，如果不是production模式就不会压缩( 先解决非production模式的问题)