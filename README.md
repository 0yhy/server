# Node-Static-Server
> 一个本地静态服务器。可以指定端口号、要访问的文件目录。


## 项目目录

> |----`server`
>
> |----|----`public`
>
> |----|----`src`
>
> |----|----|----`index.html`
>
> |----|----|----`server.js`
>
> |----`README.md`



## 使用方法

### 基本用法

1. 安装`marked`、`mime`、`open`包

   在`server`根目录下执行`npm install makred mime open`

2. 在`public`目录下放置要访问的文件夹，命名为`catalog`，并将`src`下的`index.html`复制到`catalog`下

   示例目录：

   > |----`public`
   >
   > |----|----catalog
   >
   > |----|----|----file1.txt
   >
   > |----|----|----file2.md
   >
   > |----|----|----file3.js
   >
   > |----|----|----file4.png
   >
   > |----|----|----file5.mp3
   >
   > |----|----|----file6.mp4
   >
   > |----|----|----index.html

3. 在`server`目录下运行`server.js`，在浏览器中打开http://127.0.0.1:1027 ，进入`index.html`页面

   进入该页面后，有两种访问文件的方式。点击左侧文件列表：

   * 默认方式为在本页面的右侧浏览文件
   
   * 可以选择进行链接跳转来浏览文件
   
     当然，也可以直接在浏览器内输入`http://127.0.0.1:1027/file1.txt`来访问`server/public/catalog/file.txt`文件。



### 命令行使用

1. 在`server`目录下执行`npm install . -g`，将该包安装到全局

2. 在`public`目录下放置自定义待访问文件夹，并将`index.html`复制到你的文件夹下

   示例目录：

   > |----`public`
   >
   > |----|----myFolder1
   >
   > |----|----|----file1.txt
   >
   > |----|----|----file2.md
   >
   > |----|----|----file3.js
   >
   > |----|----|----index.html
   >
   > |----|----myFolder2
   >
   > |----|----|----file1.mp3
   >
   > |----|----|----file2.mp4
   >
   > |----|----|----index.html

3. 通过命令行运行服务器

   * 默认值
     * 默认端口：1027
     * 默认打开方式：不自动打开浏览器
     * 默认目录`server/public/catalog`
   
   * `server`
   
     按照默认值运行服务器
   
   * 命令行参数
   
     * `-p`：该参数加数字指定端口号
     * `-d`：该参数加文件夹名称指定要访问的文件夹目录，如`-d music`
     * `-o`：如果指定该参数，那么运行服务器后自动在浏览器打开指定目录下的`index.html`页面



