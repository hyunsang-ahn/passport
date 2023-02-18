var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');




  router.get('/login', function (request, response) {


    var title = 'WEB - login';
    // var list = template.list(request.list);
    var list = []
    var html = template.HTML(title, list, `
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `, '');
    response.send(html);
  });

//   router.post('/login_process',
//     // passport.authenticate('local', {
//     //   successRedirect: '/',
//     //   failureRedirect: '/auth/login',
//     //   failureFlash: true,
//     //   successFlash: true
//     // }
//     function(req,res){
//         console.log('gddgg')
//     }
//     );

  router.get('/logout', function (request, response) {
    request.logout();
    //현재 세션의 상태를 세션스토어에 저장함. 저장완료되면 리다이렉트
    request.session.save(function () {
      response.redirect('/');
    });
  });

  module.exports = router;