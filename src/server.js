#!/usr/bin/env node

const path = require("path");
const url = require("url");
const fs = require("fs");
const http = require("http");
const mime = require("mime");
const open = require("open");
const marked = require("marked");

let root = path.resolve("public/catalog");

console.log(`Root dir: ${root}`);

let server = http.createServer(function (request, response) {
  let pathname = url.parse(request.url).pathname;
  if (pathname === "/") {
    pathname = "/index.html";
  }
  console.log(root);
  //文件的本地文件路径
  let filepath = path.join(root, pathname).replace(/%20/g, " ");
  let ext = path.parse(filepath).ext;
  let mimeType = mime.getType(ext) || "";
  console.log("Type:", mimeType, filepath);

  //处理非文本文件
  if (mimeType && !mimeType.startsWith("text")) {
    let range = request.headers.range || "bytes=0-";
    let positions = range.replace("bytes=", "").split("-");
    let start = parseInt(positions[0], 10);
    fs.stat(filepath, function (err, stat) {
      if (err) {
        response.end("<h1>404 Not Found</h1>");
      }
      else {
        let total = stat.size;
        let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        let chunkSize = (end - start) + 1;
        response.writeHead(206, {
          "Content-Type": mimeType,
          "Content-Length": chunkSize,
          "Content-Range": `bytes ${start}-${end}/${total}`,
          "Accept-Ranges": "bytes"
        });
        let stream = fs.createReadStream(filepath, { start: start, end: end })
          .on("error", function () {
            response.writeHead(500, { "Content-Type": mimeType });
            response.end("<h1>500 Server Error</h1>");
          })
          .on("open", function () {
            stream.pipe(response);
          })
      }
    });

  }
  //处理文本文件
  else {
    fs.readFile(filepath, "utf-8", function (err, data) {
      if (!err) {
        console.log("200" + request.url);
        //处理markdown
        if (mimeType === "text/markdown") {
          response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          response.write(marked(data));
        }
        //处理其他文本文件
        else {
          response.writeHead(200, { "Content-Type": mimeType });
          response.write(data);
        }
        response.end();
      }
      else {
        console.log("404" + request.url);
        response.writeHead(404);
        response.end("<h1>404 Not Found</h1>");
      }
    });
  }
});


// 处理命令行参数
let argvs = process.argv;
let configs = argvs.slice(2);
let indexPort = true;
let port = 1027;
let indexOpen = true;
let indexDirectory = true;
console.log("-----------------------------------", argvs);
if (configs) {
  for (let i = 0; i < configs.length; ++i) {
    if (configs[i].startsWith("-")) {
      let config = configs[i];
      // 如果端口没有被设置过且出现了-p参数
      if (indexPort && config === "-p") {
        // 如果-p后出现了端口号且合法
        if (Number.isInteger(Number(configs[i + 1])) && configs[i + 1] >= 0 && configs[i + 1] <= 65536) {
          port = configs[i + 1];
          server.listen(port);
          indexPort = false;
        }
      }
      else if (indexOpen && config === "-o") {
        // 打开窗口必须放在最后 不然如果端口号设定在打开窗口后就会报错
        indexOpen = false;
      }
      else if (indexDirectory && config === "-d") {
        if (configs[i + 1] && !configs[i + 1].startsWith("-")) {
          root = `public/${configs[i + 1]}`;
          indexDirectory = false;
        }
      }
    }
  }
}

// 将文件夹中的文件名写入json
fs.readdir(root, function (err, paths) {
  if (err) {
    console.log("read dir failed!");
  }
  else {
    let json = [];
    paths.forEach(function (path) {
      if (path !== "paths.json" && path !== "index.html") {
        json.push({
          name: path,
          suffix: path.split(".")[1]
        })
      }
    })
    fs.writeFile(`${root}/paths.json`, JSON.stringify(json), function (err) {
      if (err) {
        console.log("write failed!");
      }
    })
  }
})

if (indexPort) {
  server.listen(port);
}
if (!indexOpen) {
  open(`http://127.0.0.1:${port}`);
}

console.log(root);
console.log(`Server is running at http://127.0.0.1:${port}`);
