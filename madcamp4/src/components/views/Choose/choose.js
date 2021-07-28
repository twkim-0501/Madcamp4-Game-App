import "./choose.css";
import * as THREE from "three";
import { OrbitControls, Stars, Sky } from "@react-three/drei";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { withRouter } from "react-router-dom";

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const Text = ({ text, position, vAlign = "center", hAlign = "center" }) => {
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
  useFrame(({ clock }) => {
    const size = new THREE.Vector3();
    mesh.current.geometry.computeBoundingBox();
    mesh.current.geometry.boundingBox.getSize(size);
    mesh.current.position.x =
      hAlign === "center" ? -size.x / 2 : hAlign === "right" ? 0 : -size.x;
    mesh.current.position.y =
      vAlign === "center" ? -size.y / 2 : vAlign === "top" ? 0 : -size.y;
    mesh.current.rotation.y = mesh.current.rotation.x = mesh.current.rotation.z =
      Math.sin(clock.getElapsedTime()) * 0.1;
  });
  return (
    <group position={position}>
      <mesh ref={mesh}>
        <textGeometry center args={[text, config]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  );
};

const onSubmitHandler = (event) => {
alert('hello')
}

function App(props) {
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
          <Text onClick={onSubmitHandler} text="PING" position={[-2, 0.25, -2]} />
          <Text text="PONG" position={[-2, -0.25, -2]} />

          <Text text="MINUS" position={[2, 0.25, -2]} />
          <Text text="AUCTION" position={[2, -0.25, -2]} />
        </perspectiveCamera>
      </Suspense>
      <ambientLight />
    </Canvas>
  );
}

export default withRouter(App)