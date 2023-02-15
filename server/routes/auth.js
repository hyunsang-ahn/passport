var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');


module.exports = function (passport) {


    router.get('/login', function (request, response) {
        var fmsg = request.flash()
        console.log('/login fmsg===================', fmsg)
        var feedback = ''

        if (fmsg.error) {
            feedback = fmsg.error[0]
        }
        var title = 'WEB - login';
        // var list = template.list(request.list);
        var list = []
        var html = template.HTML(title, list, `
    <div style="color:red;">${feedback}</div>
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

    router.post('/login_process',
        //콜백부분=====================
        //local은 전략 명칭이다.
        passport.authenticate('local',
            {
                //성공시에는 home으로 보내버린다.
                successRedirect: '/',
                //실패했을때는 다시 로그인을 요청해야한다.
                failureRedirect: '/auth/login',
                failureFlash: true,
                successFlash: true

            }
            //아래 function 방식으로도 callback이 호출이 가능하다.
            // function(req, res) {
            // }

        ));


    router.get('/logout', function (request, response) {
        request.logout();
        //현재 세션의 상태를 세션스토어에 저장함. 저장완료되면 리다이렉트
        request.session.save(function () {
            response.redirect('/');
        });
    });
    return router
}

