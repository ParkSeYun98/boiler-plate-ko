import Axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../_actions/user_action'

export default function(SpecificComponent, option, adminRoute = null) {
    // null => 아무나 출입이 가능한 페이지
    // true => 로그인한 유저만 출입이 가능한 페이지
    // false => 로그인한 유저는 출입 불가능한 페이지
    // admin=null => 아무것도 안쓰면 null로 취급한다는 뜻
    
    function AuthenticationCheck(props) {
        const dispatch = useDispatch()    
        
        useEffect(() => {
                dispatch(auth()).then(response => {
                    console.log(response)

                    // 로그인 하지 않은 상태
                    if(!response.payload.isAuth) {
                        if(option) {
                            props.history.push('/login') // 로그인 안됐을 때 출입 불가능한 페이지에 들어갈려고 하는 경우 로그인 페이지로 돌려보냄
                        }
                    } else {
                        // 로그인 한 상태
                        if(adminRoute && !response.payload.isAdmin) { // admin이 아닌데 admin만 들어갈 수 있는 페이지를 들어갈려고 하면 LandingPage로 돌려보냄 
                            props.history.push('/')
                        } else {
                            if(option === false)
                            props.history.push('/') // 로그인한 유저가 출입 불가능한 페이지 (로그인 페이지 또는 회원가입 페이지 등)를 들어갈려고 할때 LandingPage로 돌려보내준다.
                        }
                    }
                })

            }, [])

            return (
                <SpecificComponent />
            )
    }

    return AuthenticationCheck
}