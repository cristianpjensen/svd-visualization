import { SingularValueDecomposition } from "ml-matrix";
import Latex from "react-latex-next";
import { Matrix3 } from "three";
import { MatrixInput } from "./controls/MatrixInput";
import { MatrixTransform } from "./controls/MatrixTransform";
import { useStore } from "../store";
import { Refresh } from "./controls/Refresh";

export const Controls = () => {
  const matrix = useStore((state) => state.matrix);
  const m = matrix.transpose().elements;
  const svd = new SingularValueDecomposition([
    [m[0], m[1], m[2]],
    [m[3], m[4], m[5]],
    [m[6], m[7], m[8]],
  ]);
  const U = new Matrix3().fromArray(svd.leftSingularVectors.to1DArray());
  const S = new Matrix3().fromArray(svd.diagonalMatrix.to1DArray());
  const V = new Matrix3().fromArray(svd.rightSingularVectors.to1DArray());

  // If U and V are both reflection matrices (determinants equal to -1), they
  // will result in a rotation matrix. So, we turn them both into rotation
  // matrices because the animation for rotations is nicer than for reflections.
  if (isCloseTo(U.determinant(), -1) && isCloseTo(V.determinant(), -1)) {
    const negativeDiagonalMatrix = new Matrix3().fromArray([
      -1, 0, 0, 0, -1, 0, 0, 0, -1,
    ]);
    U.multiply(negativeDiagonalMatrix);
    V.multiply(negativeDiagonalMatrix);
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        width: "100%",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          backgroundColor: "black",
          borderColor: "gray",
          borderWidth: 2,
          borderRadius: 16,
          borderStyle: "solid",
          padding: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Refresh />
        </div>
        <div
          style={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <MatrixInput />
          <Latex>$$=$$</Latex>
          <MatrixTransform matrix={U} />
          <MatrixTransform matrix={S} />
          <MatrixTransform matrix={V} transpose />
        </div>
      </div>
    </div>
  );
};

// Helper function for inaccurate computations like floating-point arithmetic.
const isCloseTo = (a: number, b: number) => Math.abs(a - b) < 0.001;
