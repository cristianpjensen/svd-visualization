import create from "zustand";
import { Matrix3, Vector3 } from "three";
import _ from "lodash";
import { squareTemplate } from "./utils/linalg";

interface Store {
  matrix: Matrix3;
  setMatrixIndex: (index: number, value: number) => void;
  resetMatrix: () => void;
  applyMatrix: (matrix: Matrix3) => void;
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

    const updatedVectors = _.cloneDeep(vectors).map((vec) =>
      vec.applyMatrix3(matrix)
    );

    set({ vectors: updatedVectors });
  },
  vectors: INIT_VECTORS,
}));
