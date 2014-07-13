assets-bower-ci
===============

combine bower and front-end assets with codeignitor

1. parse.js 根据assets.json生成parse过后的lib和group parsed.json (如果不是production模式就不会压缩)
2. page.js 根据assets.json和parsed.json，如果不是production模式就不会压缩( 先解决非production模式的问题)
3. 其实如果对于group,只是把它变成lib和file的话,额但是group是为了更好的压缩额
4. 其实根本没有必要弄group耶。。。。只要让它依赖多个lib就可以了，只不过这个依赖关系其实为了用起来方便
   谢特，现在才发现。。。你妹