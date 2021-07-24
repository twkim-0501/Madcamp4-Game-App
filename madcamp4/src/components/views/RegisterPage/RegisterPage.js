import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {registerUser} from '../../../_actions/user_action'
import {withRouter} from 'react-router-dom'

function RegisterPage(props) {
    const dispatch = useDispatch()

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }
    const onPasswordlHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onNameHandler = (event) => {
        setName(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            email : Email,
            password: Password,
            name: Name
        }

        dispatch(registerUser(body))
        .then(response => {
            if (response.payload.ok) {
                props.history.push('/login')
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

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordlHandler} />
                

                <br /> 
                <button>
                    Sign up
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)
