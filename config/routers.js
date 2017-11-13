'user strict'

var Router = require('koa-router')
var User = require('../app/controllers/user')
var App = require('../app/controllers/app')
var Creation = require('../app/controllers/creation')
module.exports = function () {
  var router = new Router({
    prefix:'/api'
  })

  router.post('/u/signup', App.hasBody,  User.signup)
  router.post('/u/verify', App.hasBody,  User.verify)
  router.post('/u/update', App.hasBody, App.hasToken, User.update)
  router.post('/signature', App.hasBody, App.hasToken, App.signature)
  router.post('/creations/video', App.hasBody, App.hasToken, Creation.video)

  router.get('/creations', Creation.find)
  // router.post('/creations', App.hasBody, App.hasToken, Creation.save)

  // router.get('/comments', /*App.hasToken,*/ Comment.find)
  // router.post('/comments', App.hasBody, App.hasToken, Comment.save)

  // votes
  // router.post('/up', App.hasBody, App.hasToken, Creation.up)

//   router.get('/', async(ctx, next) => {
//     ctx.response.body = `<h1>Index</h1>
//         <form action="/signin" method="post">
//             <p>Name: <input name="name" value="koa"></p>
//             <p>Password: <input name="password" type="password"></p>
//             <p><input type="submit" value="Submit"></p>
//         </form>`;
// });
//
// router.post('/signin', async(ctx, next) => {
//     var
//         name = ctx.request.body.name || '',
//         password = ctx.request.body.password || '';
//     console.log(`signin with name: ${name}, password: ${password}`);
//     if (name === 'koa' && password === '12345') {
//         ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
//     } else {
//         ctx.response.body = `<h1>Login failed!</h1>
//         <p><a href="/">Try again</a></p>`;
//     }
// });
  return router
}
