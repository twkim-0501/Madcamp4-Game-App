import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {registerUser} from '../../../_actions/user_action'
import {withRouter} from 'react-router-dom'
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Center, Sky } from "@react-three/drei";
import { withStyles, makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import "./RegisterPage.css"

const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'white',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
        },
        '&:hover fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'white',
        }, 
      },
    },
  })(TextField);

const useStyles = makeStyles((theme) => ({

    input: {
      color: "white",
      fontFamily: "futura",
      fontSize: "1.3rem"
    },
  
    text : {
        margin: "1rem",
        fontSize: "1.5rem",
        fontFamily: "cardfont",
        color: 'white',
        width: '20ch',
          '& input:valid + fieldset': {
            borderColor: 'white',
            borderWidth: 2,
            fontFamily: "cardfont",
          },
          '& input:invalid + fieldset': {
            borderColor: 'white',
            borderWidth: 2,
            fontFamily: "cardfont",
         
          },
          '& input:valid:focus + fieldset': {
            borderLeftWidth: 2,
            padding: '4px !important', // override inline-style
            borderColor: 'white',
            fontFamily: "cardfont",
          },
    },
  
    button: {
      fontSize: "1.5rem",
      fontFamily: "futura",
      color: 'white',
      width: '20ch',
    }
  }));


function RegisterPage(props) {
    const dispatch = useDispatch()
    const classes = useStyles();

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
        <Canvas >
        <OrbitControls/>
        <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />
        {/* <Html as='div' style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}> */}
        <Html as='div' className="register" fullscreen="true">
            <form style={{display:'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "cardfont"}}
            > 
            <form  noValidate autoComplete="off">
            <CssTextField className={classes.text} id="outlined-basic" label="UserName" 
            variant="outlined" InputProps={{className:classes.input}} InputLabelProps={{
                style: { color: 'white', fontFamily: "cardfont"},
            }}
            type="text" value={Name} onChange={onNameHandler}/></form>

            <form  noValidate autoComplete="off">
            <CssTextField className={classes.text} id="outlined-basic" label="Email" 
            variant="outlined" InputProps={{className:classes.input}} InputLabelProps={{
                style: { color: 'white', fontFamily: "cardfont"},
            }}
            type="email" value={Email} onChange={onEmailHandler}/></form>

            <form  noValidate autoComplete="off">
            <CssTextField  className={classes.text} id="outlined-basic" label="Password" 
            variant="outlined" InputProps={{className:classes.input}} InputLabelProps={{
                style: { color: 'white', fontFamily: "cardfont", },
            }}
            type="password" value={Password} onChange={onPasswordlHandler}/></form>

            <br /> 
            <Button className={classes.button} onClick={onSubmitHandler} color="primary">
                Register
            </Button>
            </form>
        </Html>
        </Canvas>
    )
}

export default withRouter(RegisterPage)
