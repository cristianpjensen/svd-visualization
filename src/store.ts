import create from "zustand";
import { Matrix3, Vector3 } from "three";
import _ from "lodash";

/**
 * Returns a square of three dimensional vector coordinates.
 * @param x width of the x-axis.
 * @param y width of the y-axis.
 * @param z width of the z-axis.
 * @param vectors amount of vectors to use per side.
 * @returns coordinates to the appropriate vectors.
 */
const squareTemplate = (
  x: number,
  y: number,
  z: number,
  vectors: number
): Array<Vector3> => {
  let coords = [];

  for (let i = -0.5 * x; i <= 0.5 * x; i += x / (vectors - 1)) {
    coords.push(new Vector3(i, 0.5 * y, 0.5 * z));
    coords.push(new Vector3(i, -0.5 * y, 0.5 * z));
    coords.push(new Vector3(i, 0.5 * y, -0.5 * z));
    coords.push(new Vector3(i, -0.5 * y, -0.5 * z));
  }

  for (let i = -0.5 * y; i <= 0.5 * y; i += y / (vectors - 1)) {
    coords.push(new Vector3(0.5 * x, i, 0.5 * z));
    coords.push(new Vector3(-0.5 * x, i, 0.5 * z));
    coords.push(new Vector3(0.5 * x, i, -0.5 * z));
    coords.push(new Vector3(-0.5 * x, i, -0.5 * z));
  }

  for (let i = -0.5 * z; i <= 0.5 * z; i += z / (vectors - 1)) {
    coords.push(new Vector3(0.5 * x, 0.5 * y, i));
    coords.push(new Vector3(-0.5 * x, 0.5 * y, i));
    coords.push(new Vector3(0.5 * x, -0.5 * y, i));
    coords.push(new Vector3(-0.5 * x, -0.5 * y, i));
  }

  return coords;
};

interface Store {
  matrix: Matrix3;
  setMatrixIndex: (index: number, value: number) => void;
  resetMatrix: () => void;
  applyMatrix: (matrix: Matrix3) => void;
  lastMatrix: Matrix3;
  vectors: Array<Vector3>;
}

const INIT_VECTORS = squareTemplate(10, 10, 10, 5);

export const useStore = create<Store>((set, get) => ({
  matrix: new Matrix3().set(1, 2, 3, 4, 5, 6, 7, 8, 9),
  setMatrixIndex: (index, value) => {
    const matrix = get().matrix;
    const newMatrix = new Matrix3().copy(matrix);
    newMatrix.elements[index] = value;

    set({ matrix: newMatrix });
  },
  resetMatrix: () => set({ vectors: INIT_VECTORS }),
  applyMatrix: (matrix) => {
    const vectors = get().vectors;
    console.log(matrix.elements);

    const updatedVectors = _.cloneDeep(vectors).map((vec) =>
      vec.applyMatrix3(matrix)
    );

    set({ vectors: updatedVectors, lastMatrix: matrix });
  },
  lastMatrix: new Matrix3().identity(),
  vectors: INIT_VECTORS,
}));
