import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { loginUser } from '../../../_actions/user_action'
import { useDispatch } from 'react-redux'
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Center, Sky } from "@react-three/drei";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './login.css'
import ace from './src/ace.jpeg'
import ten from './src/10.png'
import blue from './src/cardback.png'
import red from './src/redcard.png'

const cards = [
  blue,
  red,
  ten,
  ace,
]

const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

const useStyles = makeStyles((theme) => ({

    input: {
      color: "white",
      fontFamily: "futura",
      fontSize: "1rem"
    },
  
    text : {
        margin: theme.spacing(2),
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
  
    or : {
        ...theme.typography.caption,
        margin: theme.spacing(1),
        fontSize: "1rem",
        color: 'white',
        fontFamily: "futura",
    },
    button: {
      fontSize: "1.5rem",
      fontFamily: "futura",
      color: 'white',
      width: '20ch',
    }
  }));

const Deck = ()=> {
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  const [props, set] = useSprings(cards.length, i => ({ ...to(i), from: from(i) })) // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
    if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    set(i => {
      if (index !== i) return // We're only interested in changing spring-data for the current spring
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.1 : 1 
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
  })
  return props.map(({ x, y, rot, scale }, i) => (
    <animated.div id="first" key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
      <animated.div id="second" {...bind(i)} style={{ transform: interpolate([rot, scale], trans), backgroundImage: `url(${cards[i]})` }} />
    </animated.div>
  ))
}



function App(props) { 
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

        dispatch(loginUser(body))
        .then(response => {
            if (response.payload.ok) {
                props.history.push('/choose')
            } else {
                alert('이메일과 비밀번호를 확인해주세요.')
            }
        })
    }
    const moveSignup = (event) => {
      props.history.push('/register')
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
        <Html as='div' className="mainbox" fullscreen="true">
        <Deck/>
        <div className="tempform"/>
        <div class="loginform">
            <form style={{display:'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "cardfont"}}
                > 
            <form  noValidate autoComplete="off">
            <TextField className={classes.text} id="outlined-basic" label="Email" 
            variant="outlined" InputProps={{className:classes.input}} InputLabelProps={{
                style: { color: 'white', fontFamily: "cardfont"},
            }}
            type="email" value={Email} onChange={onEmailHandler}/></form>

            <form  noValidate autoComplete="off">
            <TextField  className={classes.text} id="outlined-basic" label="Password" 
            variant="outlined" InputProps={{className:classes.input}} InputLabelProps={{
                style: { color: 'white', fontFamily: "cardfont", },
            }}
            type="password" value={Password} onChange={onPasswordlHandler}/></form>

            <br /> 
            <Button className={classes.button} onClick={onSubmitHandler} color="primary">Login</Button>
            
            <div className={classes.or} > {"OR"} </div>
            <Button className={classes.button} onClick={moveSignup} color="primary">SignUp ?</Button>
            </form>
        </div>
        </Html>
        </Canvas>
    )
}

export default withRouter(App)
