import Latex from "react-latex";
import * as THREE from "three";

import { VectorsAction } from "../App";
import "./MatrixTransform.css";
import "./MatrixTransform.css";

interface MatrixTransformProps {
  matrix: THREE.Matrix3;
  vectorsDispatch: (arg0: VectorsAction) => void;
  transpose?: boolean;
}

export default function MatrixTransform(props: MatrixTransformProps) {
  const { matrix, vectorsDispatch, transpose } = props;

  var matrixString = "";
  for (const i in matrix.elements) {
    const element = matrix.elements[i];

    if ((parseInt(i) + 1) % 3 === 0 && i !== "8") {
      matrixString += `${element.toFixed(2)}\\\\`;
    } else if (i !== "8") {
      matrixString += `${element.toFixed(2)}&`;
    } else {
      matrixString += element.toFixed(2);
    }
  }

  return (
    <div
      className="matrix"
      onClick={() =>
        vectorsDispatch({
          type: "apply-matrix",
          matrix: transpose ? matrix : matrix.transpose(),
        })
      }
    >
      <Latex>{`$$ \\begin{bmatrix} ${matrixString} \\end{bmatrix} ${
        transpose ? "^T" : ""
      } $$`}</Latex>
    </div>
  );
}
