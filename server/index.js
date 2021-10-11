const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { User } = require("./models/User")
const { auth } = require('./middleware/auth')

// application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게 해줌
app.use(express.urlencoded({exteded: true}));
// application/json 데이터를 분석해서 가져올 수 있게 함
app.use(express.json())
app.use(cookieParser())

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { application } = require('express')
mongoose.connect(config.mongoURI
).then(() => console.log('MongoDB Connected...')) // 연결 잘 됐는지 확인 
 .catch(err => console.log(err)) // 에러 날때 확인할려고 

app.get('/', (req, res) => res.send('Hello World! I Hate Nodemon !'))

app.get('/api/hello', (req, res) => {
    res.send("안녕하세요 ~")
})

app.post('/api/users/register', (req, res) => {
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)

    user.save((err, userInfo) => { // mongoDB 메서드, 파라미터로 콜백함수
        if(err)
            return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    }) 
})

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        // 요청한 이메일이 있다면 비밀번호가 맞는 비밀번호인지 확인
        user.comparePassword(req.body.password, (err,isMatch) => {
        if(!isMatch)
        return res.json({ loginSuccess:false, message: "비밀번호가 틀렸습니다."})

            // 비밀 번호 까지 같다면 토큰 생성하기.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err)

                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 여기서는 쿠키에 저장한다. 각자 장단점이 있다.
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true, userID: user._id})
            })
        })
    })
})
// role 1 어드민 role 2 특정 부서 어드민
// role 0 -> 일반유저 role 0이 아니면 관리자 
app.get('/api/users/auth', auth, (req, res) => {
    // 여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user.id},  
        { token: ""},
        (err, user) => {
            if(err) return res.json({success: false, err})
            return res.status(200).send({
                success: true
            })
        })
})

const port = 5000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))