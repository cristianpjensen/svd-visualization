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
  // The package gives the negative of all values, so invert them
  const U = new Matrix3().fromArray(
    svd.leftSingularVectors.to1DArray().map((x) => -x)
  );
  const S = new Matrix3().fromArray(svd.diagonalMatrix.to1DArray());
  const V = new Matrix3().fromArray(
    svd.rightSingularVectors.to1DArray().map((x) => -x)
  );

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
