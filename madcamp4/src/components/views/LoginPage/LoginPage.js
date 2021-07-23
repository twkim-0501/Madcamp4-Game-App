import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {loginUser} from '../../../_actions/user_action'
import {withRouter} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import '@fontsource/roboto';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },

    text : {
        ...theme.typography.button,
        margin: theme.spacing(1),
        fontSize: "1.5rem",
    },

    or : {
        ...theme.typography.caption,
        margin: theme.spacing(1),
        fontSize: "1rem",
    }
  }));

function LoginPage(props) {
    const classes = useStyles();
    const dispatch = useDispatch()

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
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
            if (response.payload.ok) {
                props.history.push('/')
            } else {
                alert('이메일과 비밀번호를 확인해주세요.')
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}
            >
                <form className={classes.text} noValidate autoComplete="off">
               <TextField id="outlined-basic" label="Email" variant="outlined" 
                type="email" value={Email} onChange={onEmailHandler}/></form>

                <form className={classes.text} noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Password" variant="outlined" 
                type="password" value={Password} onChange={onPasswordlHandler}/></form>

                <br /> 
                <Button className={classes.text} onClick={onSubmitHandler} color="primary">Login</Button>
                
                <div className={classes.or} > {"OR"} </div>
                <Button className={classes.text} onClick={onSubmitHandler} color="primary">SignUp</Button>

            </form>

        </div>
    )
}

export default withRouter(LoginPage)
