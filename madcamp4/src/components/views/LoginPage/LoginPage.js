import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {loginUser} from '../../../_actions/user_action'

function LoginPage(props) {
    const dispatch = useDispatch()

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        //console.log(event.currentTarget.Email)
        setEmail(event.currentTarget.value)
    }
    const onPasswordlHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            email : Email,
            password: Password
        }
        //console.log(body);

        dispatch(loginUser(body))
        .then(response => {
            if (response.payload.loginSuccess) {
                console.log("lgn success")
                props.history.push('/')
            } else {
                alert('Error')
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{display:'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordlHandler} />

                <br /> 
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage
