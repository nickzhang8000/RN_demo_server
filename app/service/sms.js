'use strict'
var https = require('https');
var querystring = require('querystring');
var Promise = require('bluebird')
var speakeasy = require('speakeasy')

const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: 'a0dbaf5d',
  apiSecret: '4dad51c30961d2f8'
});

exports.getCode = function () {
  var code = speakeasy.totp({
    secret:'nickisnice',
    digits:4
  })
  return code
}
exports.send = function(phoneNumber,msg) {
  if (phoneNumber.toString().length === 9) {
    phoneNumber =  Number('61'+phoneNumber)
  }else if (phoneNumber.toString().length === 10) {
    phoneNumber =  Number('61'+phoneNumber.toString().slice(1))
  }
  nexmo.message.sendSms(
  phoneNumber, phoneNumber, msg,
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
 );

  // return new Promise(function (resolve,reject) {
  //   if (!phoneNumber) {
  //     return reject(new Error('手机号为空'))
  //   }
  //
  //   var postData = {
  //       mobile:phoneNumber,
  //       message: msg + '【铁壳测试】'
  //   };
  //
  //   var content = querystring.stringify(postData);
  //   console.log(content);
  //   var options = {
  //       host:'sms-api.luosimao.com',
  //       path:'/v1/send.json',
  //       method:'POST',
  //       auth:'api:key-e529ebe9d92a6191e3a4b20041dfafde',
  //       agent:false,
  //       rejectUnauthorized : false,
  //       headers:{
  //       'Content-Type' : 'application/x-www-form-urlencoded',
  //       'Content-Length' :content.length
  //       }
  //   };
  //   var str = ''
  //   var req = https.request(options,function(res){
  //     if (res.statusCode === 404) {
  //       reject(new Error('短信服务器没有响应'))
  //
  //       return
  //     }
  //       res.setEncoding('utf8');
  //       res.on('data', function (chunk) {
  //       console.log(JSON.parse(chunk));
  //       str += chunk
  //       });
  //       res.on('end',function(){
  //       console.log('over');
  //       var data
  //
  //       try {
  //         data = JSON.parse(str)
  //       } catch (e) {
  //         reject(e)
  //       }
  //
  //       if (data.error === 0 ) {
  //         resolve(data)
  //       }else {
  //         var errorMap = {
  //           '-10' : '验证信息失败	检查api key是否和各种中心内的一致，调用传入是否正确',
  //           '-11' : '接口禁用	滥发违规内容，验证码被刷等，请联系客服解除',
  //           '-20' : '短信余额不足	进入个人中心购买充值',
  //           '-30' : '短信内容为空	检查调用传入参数：message',
  //           '-31' : '短信内容存在敏感词	修改短信内容，更换词语',
  //           '-32' : '短信内容缺少签名信息	短信内容末尾增加签名信息，格式为：【公司名称】',
  //           '-33' : '短信内容缺少签名信息	短信内容末尾增加签名信息eg.【公司名称】',
  //           '-34' : '签名不可用	在后台 短信->签名管理下进行添加签名',
  //           '-40' : '错误的手机号	检查手机号是否正确',
  //           '-41' : '号码在黑名单中	号码因频繁发送或其他原因暂停发送，请联系客服确认',
  //           '-42' : '验证码类短信发送频率过快	前台增加60秒获取限制',
  //           '-43' : '号码数量太多	单次提交控制在10万个号码以内',
  //           '-50' : '请求发送IP不在白名单内	查看触发短信IP白名单的设置',
  //           '-60' : '定时时间为过去	检查定时的时间，取消定时或重新设定定时时间'
  //       }
  //       reject(new Error(errorMap[data.error]))
  //     }
  //       });
  //   });
  //
  //       req.write(content);
  //       req.end();
  // })


}
