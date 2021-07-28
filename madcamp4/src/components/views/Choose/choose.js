import "./choose.css";
import * as THREE from "three";
import { OrbitControls, Stars, Sky, Html } from "@react-three/drei";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState,  } from "react";
import { withRouter,  useHistory} from "react-router-dom";
import pingpong from './ping-pong.png'

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
  const [hover, setHover] = useState(false);
  // useFrame(()=> {
  //   mesh.current.rotation.x = mesh.current.rotation.y += 0.01
  //   if (active) {
  //     history.push('/scroll')
  //   }
  // })

  useFrame(({ clock }) => {
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
      }}> 
        <textGeometry center args={[text, config]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  );
};

function App(props) {
  let history = useHistory()
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
          
          <Text text="PING" position={[-2, 0.25, -2]} history={history} check={true}/>
          <Text text="PONG" position={[-2, -0.25, -2]} history={history} check={true}/>

          <Text text="MINUS" position={[2, 0.25, -2]} history={history} check={false}/>
          <Text text="AUCTION" position={[2, -0.25, -2]} history={history} check={false}/>
        </perspectiveCamera>
      </Suspense>
      <ambientLight />
    </Canvas>
  );
}

export default withRouter(App)