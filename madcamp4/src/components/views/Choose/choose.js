import "./choose.css";
import * as THREE from "three";
import { OrbitControls, Stars, Sky, Html } from "@react-three/drei";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState,  } from "react";
import { withRouter,  useHistory} from "react-router-dom";
import pingpong from './ping-pong.png'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios"

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const Text = ({ text, position, vAlign = "center", hAlign = "center", history, check }) => {
  
  const font = useLoader(THREE.FontLoader, "/bold.blob");
  const config = useMemo(
    () => ({
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 32,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5
    }),
    [font]
  );
  const mesh = useRef();
  const [active, setActive] = useState(false);
  const [hover, set] = useState(false)
  // useFrame(()=> {
  //   mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  //   if (active) {
  //     history.push('/scroll')
  //   }
  // })

  useFrame(({ clock }) => {
    
    let scale = (mesh.current.scale.x += ((hover ? 1.3 : 1) - mesh.current.scale.x) * 0.1)
    mesh.current.scale.set(scale, scale, scale)
    
    const size = new THREE.Vector3();
      if (active) {
        setTimeout(() => {
          if (!check)
            history.push('/scroll')
          else history.push('/gamepage2')
        }, 10);
      }
      else {
        mesh.current.geometry.computeBoundingBox();
        mesh.current.geometry.boundingBox.getSize(size);
        mesh.current.position.x =
          hAlign === "center" ? -size.x / 2 : hAlign === "right" ? 0 : -size.x;
        mesh.current.position.y =
          vAlign === "center" ? -size.y / 2 : vAlign === "top" ? 0 : -size.y;
        mesh.current.rotation.y = mesh.current.rotation.x = mesh.current.rotation.z =
          Math.sin(clock.getElapsedTime()) * 0.1;
      }
  });
  return (
    <group position={position} >
      <mesh ref={mesh} onClick={() => {
        setActive(!active);
      }} 
      onPointerOver={() => set(true)} onPointerOut={() => set(false)}
      > 
        <textGeometry center args={[text, config]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  );
};

const useStyles = makeStyles((theme) => ({
  margin: {
    alignItems: "center",
    justifyContent: 'center',
    color: "white",
    backgroundColor: "red",
    fontSize: "15px",
    fontFamily: "futura",
  },
}));

function App(props) {
  let history = useHistory()
  const classes = useStyles();
  

  const logout= () => {
    axios.get('api/user/logout')
    .then(response => {
        if (response.data.ok) {
            alert('로그아웃되었습니다.')
            props.history.push('/login')
        }
    })
  }
  return (
    <Canvas className="canvas">
      <OrbitControls/>
      <Suspense fallback={null}>
        <perspectiveCamera
          fov={75}
          aspect={sizes.width / sizes.height}
          position={[0, 0, 3]}
          near={0.1}
          far={100}
        >
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />
          
          <Text text="PING" position={[-2.5, 0.25, -2]} history={history} check={true}/>
          <Text text="PONG" position={[-2.5, -0.25, -2]} history={history} check={true}/>

          <Text text="MINUS" position={[2, 0.25, -2]} history={history} check={false}/>
          <Text text="AUCTION" position={[2, -0.25, -2]} history={history} check={false}/>
        </perspectiveCamera>
      </Suspense>
      <ambientLight />
    </Canvas>
  );
}

export default withRouter(App)