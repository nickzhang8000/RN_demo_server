'use strict'

var mongoose = require('mongoose')
var User = mongoose.model('User')
var config = require('../../config/config')
var sha1 = require('sha1')
var robot = require('../service/robot')

exports.signature = function *(next) {
  var body = this.request.body
  var key = body.key
  var token
  console.log(key);
  if (key) {
    token = robot.getQiniuToken(key)
  }
  else {
    token = robot.getCloudinaryToken(body)
  }


  this.body = {
    success:true,
    data:token
  }
}
exports.hasBody = function *(next) {
  var body = this.request.body || {}

  if (Object.keys(body).length === 0) {
    this.body={
      success:false,
      err:'漏掉了什么'
    }
    return next
  }
  yield next
}

exports.hasToken = function *(next) {
  var accessToken = this.query.accessToken

  if (!accessToken) {
    accessToken = this.request.body.accessToken
  }

  if (!accessToken) {
    this.body = {
      success:false,
      err:'钥匙丢了'
    }
    return next
  }
  var user = yield User.findOne({
    accessToken:accessToken
  }).exec()

  if (!user) {
    this.body={
      success:false,
      err:'用户没登录'
    }

    return next
  }
  this.session = this.session || {}
  this.session.user = user

  yield next
}
