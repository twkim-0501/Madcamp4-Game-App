import {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {auth} from '../_actions/user_action'

export default function foo(SpecificComponent, option, adminRoute = null) {

    //null : 아무나 출입 가능
    //true : 로그인한 유저만 출입 가능
    //false : 로그인한 유저는 출입 불가능

    function AuthenticationCheck(props) {

        const dispatch = useDispatch()

        useEffect(() => {
            dispatch(auth()).then (response => {
                 if (!response.payload.isAuth) { //로그인 안 한 상태
                    if (option) {
                        props.history.push('/login')
                    }
                 } else {
                     //로그인 한 상태
                     if (adminRoute && !response.payload.isAdmin) {
                         props.history.push('/choose')
                     } else {
                         if (!option) 
                            props.history.push('/choose')
                     }
                 }
            })
        })

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck 
}