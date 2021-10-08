const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema);

module.exports = {User} // 다른 곳에서도 쓸수 있도록 조치