import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vectors } from "./threeworld/Vectors";
import { RenderCycler } from "./threeworld/RenderCycler";

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
      <gridHelper args={[100, 100, "white", "rgb(40, 40, 40)"]} />
      <Vectors />
      <RenderCycler />
      <OrbitControls />
    </Canvas>
  );
};
