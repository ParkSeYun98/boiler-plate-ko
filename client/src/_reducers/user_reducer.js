import {
    LOGIN_USER
} from '../_actions/types'

export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload} // spreadoperator - 위의 state를 가져옴 (그냥 빈 상태)
            break;           

        default:
            return state;
    }
}