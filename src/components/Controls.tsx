import { SingularValueDecomposition } from "ml-matrix";
import Latex from "react-latex-next";
import { Matrix3 } from "three";
import { useStore } from "../store";
import { MatrixInput } from "./controls/MatrixInput";
import { MatrixTransform } from "./controls/MatrixTransform";

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
          display: "flex",
          padding: 16,
          alignItems: "center",
        }}
      >
        <MatrixInput />
        <Latex>$$=$$</Latex>
        <MatrixTransform matrix={U} />
        <MatrixTransform matrix={S} />
        <MatrixTransform matrix={V} transpose />
      </div>
    </div>
  );
};
