import create from "zustand";
import { Matrix3, Vector3 } from "three";

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
  matrix: new Matrix3().set(4, 1, 0, 1, 2, 0, 0, 0, 1),
  setMatrixIndex: (index, value) => {
    const m = get().matrix.elements;

    const newMatrix = new Matrix3();
    if (index === 0) {
      newMatrix.set(value, m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);
    } else if (index === 1) {
      newMatrix.set(m[0], value, m[2], m[3], m[4], m[5], m[6], m[7], m[8]);
    } else if (index === 2) {
      newMatrix.set(m[0], m[1], value, m[3], m[4], m[5], m[6], m[7], m[8]);
    } else if (index === 3) {
      newMatrix.set(m[0], m[1], m[2], value, m[4], m[5], m[6], m[7], m[8]);
    } else if (index === 4) {
      newMatrix.set(m[0], m[1], m[2], m[3], value, m[5], m[6], m[7], m[8]);
    } else if (index === 5) {
      newMatrix.set(m[0], m[1], m[2], m[3], m[4], value, m[6], m[7], m[8]);
    } else if (index === 6) {
      newMatrix.set(m[0], m[1], m[2], m[3], m[4], m[5], value, m[7], m[8]);
    } else if (index === 7) {
      newMatrix.set(m[0], m[1], m[2], m[3], m[4], m[5], m[6], value, m[8]);
    } else if (index === 8) {
      newMatrix.set(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], value);
    }

    set({ matrix: newMatrix });
  },
  resetMatrix: () =>
    set({
      vectors: INIT_VECTORS,
      lastMatrix: new Matrix3().fromArray([0, 0, 0, 0, 0, 0, 0, 0, 0]),
    }),
  applyMatrix: (matrix) => {
    const vectors = get().vectors;

    const updatedVectors = vectors.map((vector) => {
      const newVector = new Vector3().copy(vector);
      newVector.applyMatrix3(matrix);
      return newVector;
    });

    set({ vectors: updatedVectors, lastMatrix: matrix });
  },
  lastMatrix: new Matrix3().fromArray([0, 0, 0, 0, 0, 0, 0, 0, 0]),
  vectors: INIT_VECTORS,
}));
