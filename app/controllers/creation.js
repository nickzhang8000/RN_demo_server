'use strict'
var mongoose = require('mongoose')
var User = mongoose.model('User')
var Video = mongoose.model('Video')
var Audio = mongoose.model('Audio')
var Creation = mongoose.model('Creation')
var robot = require('../service/robot')
var config = require('../../config/config')

var userFields = [
  'avatar',
  'nickname',
  'gender',
  'age',
  'breed'
]

exports.video = function *(next) {
  var body = this.request.body
  var videoData = body.video
  var version = videoData.version
  var public_id = videoData.public_id

  var user = this.session.user

  if (!videoData) {
    this.body={
      success:false,
      err:'video upload failed'
    }
  return next
}

var video = yield Video.findOne({
  public_id:public_id
}).exec()

if (!video) {
  video = new Video({
    author:user._id,
    version:version,
    // cloudinaryKey:videoData.cloudinaryKey,
    public_id:public_id
  })
  video = yield video.save()

}

this.body={
  success:true,
  data:video._id
}

}
exports.find = function *(next) {
 // var page = parseInt(this.query.page,10) || 1
 var count = 5
 // var offset = (page - 1)*count
 //
 //
 // var queryArray = [
 // Creation
 //   .find({finish:100})
 //   .sort({
 //     'meta.createAt':-1
 //   })
 //   .skip(offset)
 //   .limit(count)
 //   .populate('author',userFields.join(' '))
 //   .exec(),
 // Creation.count({finish:100}).exec()
 // ]
 // var data = yield queryArray
 // this.body = {
 //   success:true,
 //   data:data[0],
 //   total:data[1]
 // }
 var video = yield Video.find({
 }).exec()
 this.body = {
   success:true,
   total:1,

   data:{
    _id:video._id,
    author:{
      avatar:"https://res.cloudinary.com/nickscloud/video/upload/t_media_lib_thumb/v1507456784/video/l8ki54bybrirpmxb26nu.jpg",
      nickname:'nick'
    },
    thumb:'https://res.cloudinary.com/nickscloud/video/upload/t_media_lib_thumb/v1507456784/video/l8ki54bybrirpmxb26nu.jpg',
    title:'nick',
    video:'http://res.cloudinary.com/nickscloud/video/upload/v' + video.version + '/'+ video.public_id +'.mp4'

   },
 }
 }
// exports.save = function *(next) {
//   var body = this.request.body
//   var videoId = body.videoId
//   var audioId = body.audioId
//   var title = body.title
//   var user = this.session.user
//
//   var video = yield Video.findOne({
//     _id: videoId
//   }).exec()
//   var audio = yield Audio.findOne({
//     _id: audioId
//   }).exec()
//
//   if (!video || !audio) {
//     this.body = {
//       success: false,
//       err: '音频或者视频素材不能为空'
//     }
//
//     return next
//   }
//
//   var creation = yield Creation.findOne({
//     audio: audioId,
//     video: videoId
//   }).exec()
//
//   if (!creation) {
//     var creationData = {
//       author: user._id,
//       title: xss(title),
//       audio: audioId,
//       video: videoId,
//       finish: 20
//     }
//
//     var video_public_id = video.public_id
//     var audio_public_id = audio.public_id
//
//     if (video_public_id && audio_public_id) {
//       creationData.cloudinary_thumb = 'http://res.cloudinary.com/gougou/video/upload/' + video_public_id + '.jpg'
//       creationData.cloudinary_video = 'http://res.cloudinary.com/gougou/video/upload/e_volume:-100/e_volume:400,l_video:' + audio_public_id.replace(/\//g, ':') + '/' + video_public_id + '.mp4'
//
//       creationData.finish += 20
//     }
//
//     if (audio.qiniu_thumb) {
//       creationData.qiniu_thumb = audio.qiniu_thumb
//
//       creationData.finish += 30
//     }
//
//     if (audio.qiniu_video) {
//       creationData.qiniu_video = audio.qiniu_video
//
//       creationData.finish += 30
//     }
//
//     creation = new Creation(creationData)
//   }
//
//   creation = yield creation.save()
//
//   console.log(creation)
//
//   this.body = {
//     success: true,
//     data: {
//       _id: creation._id,
//       finish: creation.finish,
//       title: creation.title,
//       qiniu_thumb: creation.qiniu_thumb,
//       qiniu_video: creation.qiniu_video,
//       author: {
//         avatar: user.avatar,
//         nickname: user.nickname,
//         gender: user.gender,
//         breed: user.breed,
//         _id: user._id
//       }
//     }
//   }
// }
