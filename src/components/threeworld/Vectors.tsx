import { useEffect, useState } from "react";
import { Vector3 } from "three";
import { useStore } from "../../store";
import { Circle } from "./Circle";

export const Vectors = () => {
  const { vectors, matrix } = useStore((state) => ({
    vectors: state.vectors,
    matrix: state.lastMatrix,
  }));

  const [initVectors, setInitVectors] = useState<Array<Vector3>>([]);

  useEffect(() => {
    setInitVectors(vectors);
  }, [vectors]);

  return (
    <>
      {vectors.map((vector, i) => (
        <Circle
          key={i}
          vector={vector}
          appliedMatrix={matrix}
          position={initVectors[i]}
        />
      ))}
    </>
  );
};
