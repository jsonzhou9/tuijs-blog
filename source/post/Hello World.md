---
template: post.html
title: "基于Metalsmith的静态页面博客：tuijs-blog"
slug: "metalsmith－tuijs-blog"
date: 2014-09-10
tags:
  - metalsmith

---
本博客系统是基于Metalsmith的静态页面博客。Metalsmith易用易上手，高度模块化，扩展性良好，它不仅仅是一个静态网站生成平台，更可以搭建起前端通用构建平台。

将动态网页静态化，可以有效减轻服务器端的压力，并且静态网页的访问速度要快于动态网页。此外，使用静态网页还有利于搜索引擎的收录，从而提高网站的搜索排名。 

> Metalsmith：An extremely simple, pluggable static site generator.

#### 开启搭建你的静态博客 ####

1、首先需要安装NodeJs

2、在tuijs-blog的源码目录执行以下命令，安装所有依赖库。

```shell
npm install
```

3、构建静态页面

```shell
node build.js
```

4、运行本地静态服务器

```shell
node app.js
```

#### 解决markdown报错 ####

markdown插件不够严谨，需要进行以下修改修正错误。

**修改文件：** `node_modules/metalsmith-markdown/lib/index.js`

大约修改40行，将以下代码修改：

```javascript
data[key] = marked(data[key], options);
```

**修改为：**

```javascript
if(data[key]){
	var strForKey = data[key].toString();
	data[key] = marked(strForKey, options);
}
```

#### 目录说明 ####- ./config.js 配置文件  - ./build.js 构建程序  - ./package.json 项目配置  - ./app.js 本地静态服务器  - ./lib 库文件  - ./templates 模板文件  - ./publish 构建后的静态文件，也是发布目录  - ./source 源文件目录  - ./source/assets/ 资源文件  - ./source/post/ 所有markdown文档所在目录#### 主要特点 ####- 1、markdown编写文档- 2、文档头采用YML数据结构，可以给文档添加任一属性，方便模板中调用（数据库的都是定好字段的）- 3、文档URL自定义，在文档头定义slug就行- 4、文档URL可填写中文，自动转换为拼音URL，利于SEO- 5、构建时，创建静态文件的同时，可以进行SASS,LESS等预编译，压缩CSS，JSS等- 6、可以放到Github的静态空间进行托管，零费用。也可以直接把整站建在CDN上，比如七牛CDN

#### 相关链接 ####

Metalsmith官方：[http://www.metalsmith.io](http://www.metalsmith.io)

在线演示：[http://www.2fz1.com/](http://www.2fz1.com/)

本项目Github地址：[https://github.com/zzyss86/tuijs-blog](http://https://github.com/zzyss86/tuijs-blog)


