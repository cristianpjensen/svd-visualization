import { useRef } from "react";
import { Mesh, Vector3 } from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { useStore } from "../store";

export const ThreeWorld = () => {
  return (
    <Canvas
      dpr={window.devicePixelRatio}
      style={{ height: window.innerHeight, width: window.innerWidth }}
      camera={{
        isPerspectiveCamera: true,
        near: 0.1,
        far: 1000,
        fov: 75,
        rotation: [-0.57, 0.74, 0.41],
        position: [9.42, 5.59, 8.72],
      }}
    >
      <ambientLight />
      <gridHelper args={[100, 100, "white", "gray"]} />
      <Vectors />
      <OrbitControls />
    </Canvas>
  );
};

const Vectors = () => {
  // Initial vectors
  const vectors = useStore((state) => state.vectors);

  return (
    <>
      {vectors.map((vector, i) => (
        <Circle key={i} vector={vector} />
      ))}
    </>
  );
};

interface CircleProps extends MeshProps {
  vector: Vector3;
}

const Circle = ({ vector, ...props }: CircleProps) => {
  const mesh = useRef<Mesh>();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.position.lerp(vector, 0.05);
    }
  });

  return (
    <mesh {...props} ref={mesh}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

/**
 * Moves `objVector` to the position of `vector` by scaling. It basically just
 * goes from the (x, y, z)-position of the object to the (x, y, z)-position of
 * the vector.
 * @param vector vector to go to.
 * @param mesh vector to move.
 */
const vectorScale = (vector: Vector3, mesh: Mesh) => {
  var pos = mesh.position.clone();

  new TWEEN.Tween(pos)
    .to({ x: vector.x, y: vector.y, z: vector.z }, 1000)
    .easing(TWEEN.Easing.Cubic.Out)
    .onUpdate(() => {
      mesh.position.set(pos.x, pos.y, pos.z);
      console.log(1);
    })
    .start();
};
