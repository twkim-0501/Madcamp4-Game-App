import { Canvas } from '@react-three/fiber'  
import './LoginPage.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import React, {  useState} from "react"
import { loginUser } from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import { Html,softShadows, OrbitControls, Box } from '@react-three/drei';
import { Physics, usePlane, useBox } from "@react-three/cannon";
//import {useSpring} from 'react-spring/three'
import niceColors from 'nice-color-palettes'
import * as THREE from 'three'
import '@fontsource/roboto';

const textColor = 'white'
const dieColor = 'indigo'

softShadows();

const Plane = ({ color, ...props }) => {
  const [ref] = usePlane(() => ({ ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color={color} />
    </mesh>
  )
}

// function Cube(props) {
//   const [ref] = useBox(() => ({ mass: 1, position: [0, 0, 0], rotation: [0.4, 0.2, 0.5], ...props }))
//   return (
//     <mesh receiveShadow castShadow ref={ref}>
//       <boxBufferGeometry attach="geometry" />
//       <meshLambertMaterial attach="material" color="hotpink" />
//     </mesh>
//   )
// }

const D6 = (props) => {
  //const sides = 6
  const radius = 2.5
  const [ref, api] = useBox(() => ({ args: [radius, radius, radius], mass: 1, ...props }))

  const textSides = [-1, -6, -5, -2, -4, -3]
  return (
    <Box
      args={[radius, radius, radius]}
      ref={ref}
      onClick={() => api.applyImpulse([(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() + 0.4) * 10], [0, 0, 0])}
      castShadow
      receiveShadow>
      {textSides.map((i) => (
        <meshPhongMaterial attachArray="material" map={createTextTexture(i, textColor, dieColor)} key={i} />
      ))}
    </Box>
  )
}

const calculateTextureSize = (approx) => {
  return Math.max(128, Math.pow(2, Math.floor(Math.log(approx) / Math.log(2))))
}

const createTextTexture = (text, color, backColor) => {
  // TODO Set size/textMargin for each shape
  const size = 100
  const textMargin = 1

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const ts = calculateTextureSize(size / 2 + size * textMargin) * 2
  canvas.width = canvas.height = ts
  context.font = ts / (1 + 2 * textMargin) + 'pt Arial'
  context.fillStyle = backColor
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = color
  context.fillText(text, canvas.width / 2, canvas.height / 2)

  if (text === 6 || text === 9) {
    context.fillText('  .', canvas.width / 2, canvas.height / 2)
  }

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100ch',
    },
  },
  input: {
    color: "white"
  },

  text : {
      ...theme.typography.button,
      margin: theme.spacing(1),
      fontSize: "1.5rem",

      color: 'white',
      width: '20ch',
        '& input:valid + fieldset': {
          borderColor: 'white',
          borderWidth: 2,
        },
        '& input:invalid + fieldset': {
          borderColor: 'red',
          borderWidth: 2,
       
        },
        '& input:valid:focus + fieldset': {
          borderLeftWidth: 2,
          padding: '4px !important', // override inline-style
          borderColor: 'white',
          
        },
  },

  or : {
      ...theme.typography.caption,
      margin: theme.spacing(1),
      fontSize: "1rem",
      color: 'indigo'
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
    <Canvas concurrent shadowMap gl={{ alpha: false }} camera={{ position: [0, -12, 16] }}>
      <OrbitControls />
    <hemisphereLight castShadow intensity={0.35} />
    <spotLight position={[30, 0, 30]} angle={0.3} penumbra={1} intensity={2} castShadow shadow-mapSize-width={256} shadow-mapSize-height={256} />
    <pointLight position={[-30, 0, -30]} intensity={0.5} />
    <Physics gravity={[0, 0, -10]}>
    <Plane color={niceColors[17][4]} />
      <Plane color={niceColors[17][1]} position={[-10, 0, 0]} rotation={[0, 1, 0]} />
      <Plane color={niceColors[17][2]} position={[10, 0, 0]} rotation={[0, -1, 0]} />
      <Plane color={niceColors[17][3]} position={[0, 10, 0]} rotation={[1, 0, 0]} />
      <Plane color={niceColors[17][0]} position={[0, -10, 0]} rotation={[-1, 0, 0]} />
      
      <D6 position={[4, 5, 10]} rotation={[0, 3, 2]}/>
      <D6 position={[-4, 0, 10]} rotation={[-2, 0, 2]}/>
  
    </Physics>
      
      <group>
      <Html center >
      <form style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}
      >
          <form  noValidate autoComplete="off">
          <TextField className={classes.text} id="outlined-basic" label="Email" 
          variant="outlined" InputProps={{className:classes.input}} InputLabelProps={{
            style: { color: '#fff' },
          }}
          type="email" value={Email} onChange={onEmailHandler}/></form>

          <form  noValidate autoComplete="off">
          <TextField  className={classes.text} id="outlined-basic" label="Password" 
          variant="outlined" InputProps={{className:classes.input}} InputLabelProps={{
            style: { color: '#fff' },
          }}
          type="password" value={Password} onChange={onPasswordlHandler}/></form>

          <br /> 
          <Button className={classes.text} onClick={onSubmitHandler} color="primary">Login</Button>
          
          <div className={classes.or} > {"OR"} </div>
          <Button className={classes.text} onClick={onSubmitHandler} color="primary">SignUp ?</Button>

      </form>
      </Html>
      </group>

      </Canvas>
  )
}

export default withRouter(LoginPage)