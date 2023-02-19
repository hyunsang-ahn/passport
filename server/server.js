var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var flash = require('connect-flash');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(compression());





//패스포트는 세션 밑에 적어야한다,!!!! 세션을 내부적으로 사용하기 때문에 express 세션을 활성화 시키는 코드 이후에 작성할것!!!
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))



//패스포트 선언부-=======================================

var passport = require('passport');

var LocalStrategy = require('passport-local');


var authData = {
  email: 'happylovetkd@naver.com',
  password: '123123',
  nickname: 'eric'
}



//패스포트 미들웨어============================
//이니셜라이즈
app.use(passport.initialize())
//패스포트 세션 사용
app.use(passport.session())
//패스포트 미들웨어 끝============================


//패스포트 시리얼라이즈

passport.serializeUser(function (user, done) {

  console.log('serializeUser==================', user)

  //두번째 인자는 유저를 식별할수 있는 유저 식별자를 줄것(id나 email, username등?!)
  done(null, user.email)
})

//패스포트 디 시리얼라이즈

passport.deserializeUser(function (id, done) {
  console.log('deserializeUser==================', id)
  done(null, authData)

})










passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'pwd'
  },


  function verify(username, password, done) {


    if (username === authData.email) {
      console.log('이메일은 일치함')

      if (password === authData.password) {
        console.log('비번은 일치함')
        //특이점! 여기서 true를 2번째 인자로 줘버리면 authData는 시리얼라이즈에서 못받는다.
        // ture는 무시하고 바로 authData를 전달할것
        return done(null, authData)
      } else {
        console.log('password 불일치함')

        return done(null, false, {
          message: 'Incorrect password'
        })
      }

    } else {
      console.log('이메일은 불일치함')

      return done(null, false, {
        message: 'Incorrect username'
      })
    }


    // db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, user) {
    //   if (err) { return cb(err); }
    //   if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    //   crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    //     if (err) { return cb(err); }
    //     if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
    //       return cb(null, false, { message: 'Incorrect username or password.' });
    //     }
    //     return cb(null, user);
    //   });
    // });
  }));












app.post('/auth/login_process',

  //콜백부분=====================
  //local은 전략 명칭이다.

  passport.authenticate('local',


    {
      //성공시에는 home으로 보내버린다.
      successRedirect: '/',
      //실패했을때는 다시 로그인을 요청해야한다.
      failureRedirect: '/login'
    }

    //아래 function 방식으로도 callback이 호출이 가능하다.

    // function(req, res) {


    // }



  ));








app.use(flash());










var indexRouter = require('./routes/index');
// var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');

app.use('/', indexRouter);
// app.use('/topic', topicRouter);
app.use('/auth', authRouter);

// var passport = require('./lib/passport')(app);

app.get('*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(5001, function () {
  console.log('Example app listening on port 5001!')
});