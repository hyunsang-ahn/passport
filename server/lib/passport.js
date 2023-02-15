module.exports = function (app) {
    //패스포트 선언부-=======================================
    var flash = require('connect-flash');

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
    //커넥트 플래쉬
    app.use(flash())

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
                    return done(null, authData, {
                        message: 'correct user'
                    })
                } else {
                    console.log('password 불일치함')

                    return done(null, false, {
                        message: 'Incorrect password'
                    })
                }

            } else {
                console.log('이메일은 불일치함')

                return done(null, false, {
                    message: 'Incorrect user'
                })
            }

        }));






    return passport
}



