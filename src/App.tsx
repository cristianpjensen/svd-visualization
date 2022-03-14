import { useEffect } from "react";
import * as TWEEN from "@tweenjs/tween.js";
import { useThree } from "@react-three/fiber";
import "katex/dist/katex.min.css";

import { ThreeWorld } from "./components/ThreeWorld";
import { Controls } from "./components/Controls";

const App = () => {
  return (
    <>
      <ThreeWorld />
      <Controls />
    </>
  );
};

export default App;
