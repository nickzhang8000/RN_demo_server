'user strict'

var fs = require('fs')
var path = require('path')
var mongoose = require('mongoose')
var db = 'mongodb://localhost/imooc-app'//连接数据库

mongoose.Promise = require('bluebird')
mongoose.connect(db)


// 加载用户模型
var models_path = path.join(__dirname,'/app/models')

var walk = function (modelPath) {
  fs
    .readdirSync(modelPath)
    .forEach(function (file) {
      var filePath = path.join(modelPath,'/'+file)
      var stat = fs.statSync(filePath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(filePath)
        }
      }
      else if (stat.isDirectory()) {
        walk(filePath)
      }
    })
}
walk(models_path)
// 加载中间件
 var koa = require('koa')
 var logger = require('koa-logger')
 var session = require('koa-session')
 var bodyParser = require('koa-bodyparser')
 var app = koa()

 app.keys = ['imooc']
 app.use(logger())
 app.use(session(app))
 app.use(bodyParser())

app.use(function *(next) {
  console.log(this.href)
  console.log(this.method)
  this.body = {
    success:true
  }
  yield next
})
var router = require('./config/routers')()

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(1234)
console.log('listening:1234')
