var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet')
app.use(helmet());
var session = require('express-session')
var FileStore = require('session-file-store')(session)

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


var passport = require('./lib/passport')(app)

var indexRouter = require('./routes/index');
// var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth')(passport);

app.use('/', indexRouter);
// app.use('/topic', topicRouter);
app.use('/auth', authRouter);

// var passport = require('./lib/passport')(app);

app.get('/flash', function (req, res) {
  req.flash('info', 'flash is back!')
  res.send('flash')

})

app.get('/flash-display', function (req, res) {
  var fmsg = req.flash();
  console.log('fmsg===================', fmsg)
  res.send(fmsg)

})




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