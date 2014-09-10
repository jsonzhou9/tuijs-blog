本博客系统是基于Metalsmith的静态页面博客。Metalsmith易用易上手，高度模块化，扩展性良好，它不仅仅是一个静态网站生成平台，更可以搭建起前端通用构建平台。

将动态网页静态化，可以有效减轻服务器端的压力，并且静态网页的访问速度要快于动态网页。此外，使用静态网页还有利于搜索引擎的收录，从而提高网站的搜索排名。 

> Metalsmith：An extremely simple, pluggable static site generator.

#### 开启搭建你的静态博客 ####

1、首先需要安装NodeJs

2、在tuijs-blog的源码目录执行以下命令，安装所有依赖库。

	npm install


3、构建静态页面

	node build.js


4、运行本地静态服务器

	node app.js

#### 解决markdown报错 ####

markdown插件不够严谨，需要进行以下修改修正错误。

**修改文件：** `node_modules/metalsmith-markdown/lib/index.js`

大约修改40行，将以下代码修改：

	data[key] = marked(data[key], options);

**修改为：**

    if(data[key]){
        var strForKey = data[key].toString();
        data[key] = marked(strForKey, options);
    }


#### 相关链接 ####

Metalsmith官方：[http://www.metalsmith.io](http://www.metalsmith.io)

在线演示：[http://www.2fz1.com/](http://www.2fz1.com/)

本项目Github地址：[https://github.com/zzyss86/tuijs-blog](http://https://github.com/zzyss86/tuijs-blog)


