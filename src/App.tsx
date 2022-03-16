import "katex/dist/katex.min.css";

import { ThreeWorld } from "./components/ThreeWorld";
import { Controls } from "./components/Controls";
import { Help } from "./components/Help";

const App = () => {
  return (
    <>
      <ThreeWorld />
      <Controls />
      <Help />
    </>
  );
};

export default App;
