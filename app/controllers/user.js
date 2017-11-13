'use strict'
var mongoose = require('mongoose')
var User = mongoose.model('User')
var xss = require('xss')
var uuid = require('uuid')
var sms = require('../service/sms')

exports.signup = function *(next) {
  var phoneNumber = xss(this.request.body.phoneNumber.trim())
  // var phoneNumber = this.query.phoneNumber//通过get获得phoneNumber

  var user = yield User.findOne({  //数据库查询
    phoneNumber:phoneNumber
  }).exec()
console.log(user);
  var verifyCode = sms.getCode()

  if (!user) {//对有数据和无数据进行处理
    var accessToken = uuid.v4()
    user = new User({
      nickname:'小狗宝',
      avatar:'http://nick.shinehubtesting.xyz/img/brokerage/rabbit.png',
      phoneNumber:xss(phoneNumber),
      verifyCode:verifyCode,
      accessToken:accessToken,
    })
  }
  else {
    user.verifyCode = verifyCode
  }
  try {
    console.log('try');
      user = yield user.save()//数据存储
  }
  catch (e) {
    console.log(e);
    this.body = {
      success:false
    }
    return
  }

  var msg = 'Your verify code is ' + user.verifyCode
  try {
    sms.send(user.phoneNumber,msg)

  } catch (e) {
    console.log(e)

    this.body = {
      success:false,
      err:'短信服务异常'
    }
    return
  }

  this.body = {
    success:true
  }
}
// exports.signup = function *(next) {
//   this.body = {
//     success:true
//   }
// }

exports.verify = function *(next) {
  var verifyCode = this.request.body.verifyCode
  var phoneNumber = this.request.body.phoneNumber
  console.log(verifyCode);
  console.log(phoneNumber);
  if (!verifyCode || !phoneNumber) {
    this.body = {
      success:false,
      err:'验证没通过'
    }
    return next
  }

  var user = yield User.findOne({
    phoneNumber:phoneNumber,
    verifyCode:verifyCode
  }).exec()

  if (user) {
    user.verified = true
    user = yield user.save()

    this.body = {
      success:true,
      data:{
        nickname:user.nickname,
        accessToken:user.accessToken,
        avatar:user.avatar,
        _id:user._id,

      }
    }
  }else {
    this.body = {
      success:false,
      err:'验证没通过'

    }
  }


}

exports.update = function *(next) {
  var body = this.request.body
  var user = this.session.user
  var fields = 'avatar,gender,age,nickname,breed'.split(',')

  fields.forEach(function (field) {
    if (body[field]) {
      user[field] = xss(body[field].trim())
    }
  })
  user = yield user.save()

  this.body = {
    success:true,
    data:{
      nickname:user.nickname,
      accessToken:user.accessToken,
      avatar:user.avatar,
      age:user.age,
      breed:user.breed,
      gender:user.gender,
      _id:user._id
    }
  }
}
