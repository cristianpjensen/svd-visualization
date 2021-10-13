import { useEffect, useRef, useState, useReducer } from "react";
import { SingularValueDecomposition } from "ml-matrix";
import Latex from "react-latex";
import * as THREE from "three";
import _ from "lodash";

import { vectorCreate, vectorRotate, vectorScale } from "./utils/vectors";
import { graph, dimensions, squareTemplate } from "./utils/linalg";
import MatrixInput from "./components/MatrixInput";
import MatrixTransform from "./components/MatrixTransform";
import Reset from "./components/Reset";
import Info from "./components/Info";

export type VectorsAction =
  | { type: "apply-matrix"; matrix: THREE.Matrix3 }
  | { type: "reset" }
  | { type: "init" };

type VectorsState = {
  vectors: Array<THREE.Vector3>;
  objects: Array<THREE.Mesh>;
};

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const dims = dimensions();

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(dims.width, dims.height);
  renderer.outputEncoding = THREE.sRGBEncoding;
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 50,
  });

  useEffect(() => {
    graph(ref, scene, renderer, material);

    // eslint-disable-next-line
  }, []);

  /**
   * Initialises the three dimensional vectors in a 5x5x5 cube.
   * @returns initialised vector coordinates with appropriate objects.
   */
  const vectorsInit = () => {
    const squareCoords = squareTemplate(5, 5, 5, 5);
    const objects: Array<THREE.Mesh> = [];
    squareCoords.forEach((vec) => {
      objects.push(vectorCreate(vec, scene));
    });

    return { vectors: squareCoords, objects: objects };
  };

  /**
   * Does all the computation that determine the new state of the vectors.
   * @param state state of the vectors.
   * @param action either apply matrix or reset vectors.
   * @returns new state.
   */
  const vectorsReducer = (
    state: VectorsState,
    action: VectorsAction
  ): VectorsState => {
    switch (action.type) {
      case "apply-matrix":
        const updatedVectors = _.cloneDeep(state.vectors).map((vec) =>
          vec.applyMatrix3(action.matrix)
        );

        var scaled = 0;
        updatedVectors.forEach((vec, i) => {
          const object = state.objects[i];

          const vecLength = Math.round(vec.length() * 100) / 100;
          const objVecLength = Math.round(object.position.length() * 100) / 100;

          if (vecLength !== objVecLength) {
            scaled += 1;
          }
        });

        // if one should scale, scale all of them, because
        // scale always works, but rotation can mess up if it should scale
        if (scaled) {
          updatedVectors.forEach((vec, i) => {
            const object = state.objects[i];
            vectorScale(vec, object);
          });
        } else {
          updatedVectors.forEach((_, i) => {
            const object = state.objects[i];
            vectorRotate(action.matrix, object);
          });
        }

        return {
          vectors: updatedVectors,
          objects: state.objects,
        };

      case "reset":
        const newVectors = vectorsInit().vectors;
        newVectors.forEach((vec, i) => vectorScale(vec, state.objects[i]));

        return {
          vectors: newVectors,
          objects: state.objects,
        };

      default:
        throw new Error();
    }
  };

  // eslint-disable-next-line
  const [vectors, vectorsDispatch] = useReducer(
    vectorsReducer,
    undefined,
    vectorsInit
  );

  // do not use three.matrix3 type for these, since it has to be used by a
  // different package and requires user input
  const [row1, setRow1] = useState([1, 2, 3]);
  const [row2, setRow2] = useState([4, 5, 6]);
  const [row3, setRow3] = useState([7, 8, 9]);
  const svd = new SingularValueDecomposition([row1, row2, row3]);

  return (
    <>
      <div>
        <div ref={ref} />
        <div style={{ marginBottom: 6, marginTop: -265 }}>
          <Reset vectorsDispatch={vectorsDispatch} />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <MatrixInput
            rows={[
              [row1, setRow1],
              [row2, setRow2],
              [row3, setRow3],
            ]}
          />
          <div
            style={{
              marginLeft: 3,
              marginRight: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Latex>$$=$$</Latex>
          </div>
          <MatrixTransform
            matrix={new THREE.Matrix3().fromArray([
              ...svd.leftSingularVectors.getRow(0),
              ...svd.leftSingularVectors.getRow(1),
              ...svd.leftSingularVectors.getRow(2),
            ])}
            vectorsDispatch={vectorsDispatch}
          />
          <MatrixTransform
            matrix={new THREE.Matrix3().fromArray([
              ...svd.diagonalMatrix.getRow(0),
              ...svd.diagonalMatrix.getRow(1),
              ...svd.diagonalMatrix.getRow(2),
            ])}
            vectorsDispatch={vectorsDispatch}
          />
          <MatrixTransform
            matrix={new THREE.Matrix3().fromArray([
              ...svd.rightSingularVectors.getRow(0),
              ...svd.rightSingularVectors.getRow(1),
              ...svd.rightSingularVectors.getRow(2),
            ])}
            vectorsDispatch={vectorsDispatch}
            transpose
          />
        </div>
      </div>
      <Info />
    </>
  );
}

export default App;
