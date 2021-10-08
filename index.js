const express = require('express')
const app = express()
const port = 5000

const config = require('./config/key');

const { User } = require("./models/User");

// application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게 해줌
app.use(express.urlencoded({exteded: true}));
// application/json 데이터를 분석해서 가져올 수 있게 함
app.use(express.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI
).then(() => console.log('MongoDB Connected...')) // 연결 잘 됐는지 확인 
 .catch(err => console.log(err)) // 에러 날때 확인할려고 

app.get('/', (req, res) => res.send('Hello World! I Hate Nodemon !'))

app.post('/register', (req, res) => {
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)

    user.save((err, doc) => { // mongoDB 메서드, 파라미터로 콜백함수
        if(err)
            return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    }) 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))