const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://parkseyun:yun3214@boilerplate.qnrlv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' // 몽고db에서 데이터베이스만든거 주소 갖고와서 안에 비밀번호만 넣음
).then(() => console.log('MongoDB Connected...')) // 연결 잘 됐는지 확인 
 .catch(err => console.log(err)) // 에러 날때 확인할려고 

app.get('/', (req, res) => res.send('Hello World! ~~ 안녕하세요 ~'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))