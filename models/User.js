const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10 // 10자리
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 공백 없애줌
        unique: 1 // 같은 이메일 못쓰도록
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 어떤 유저가 관리자일수도, 일반 유저일 수도 있으니 그것들을 나눔. 
        type: Number, // Number가 1이면 관리자고 아니면 0이고 이런식
        default: 0 // 따로 설정 안하면 0을 준다 (디폴트 값)
    },
    image: String,
    token: { // token을 이용해서 유효성 등 관리
        type:String
    },
    tokenExp: { // token 사용 유효 기간
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this;
   
    if(user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) { // callback function (error 나면 err 가져오고 아니면 salt)
            if(err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })  
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword : 1234567  암호화된 비밀번호 : $2b$10$i1iLkjgygg10tjOOuhkD7.YVbfzY.rw5ZJR5yjdceJXeAvedCERZO
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    
    //jsonwebtoken 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // user._id + '' = token
    // 토큰을 decode(복호화)한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음,
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err,user) { // mongodb에 있는 메소드
            if(err) return cb(err)
            cb(null, user)
        }) 
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User } // 다른 곳에서도 쓸수 있도록 조치