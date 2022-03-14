import { useEffect, useState } from "react";
import Latex from "react-latex-next";
import { Matrix3 } from "three";
import { useStore } from "../store";

import "./MatrixTransform.css";

interface MatrixTransformProps {
  matrix: Matrix3;
  transpose?: boolean;
}

export const MatrixTransform = ({
  matrix,
  transpose,
}: MatrixTransformProps) => {
  const applyMatrix = useStore((state) => state.applyMatrix);
  const [matrixLatex, setMatrixLatex] = useState<string>("");

  useEffect(() => {
    let latex = "$$\\begin{bmatrix}";
    matrix.elements.forEach((elem, i) => {
      if ((i + 1) % 3 === 0 && i + 1 !== 9) {
        latex += `${elem.toFixed(2)} \\\\`;
      } else if (i === 8) {
        latex += elem.toFixed(2);
      } else {
        latex += `${elem.toFixed(2)} &`;
      }
    });

    if (transpose) {
      latex += "\\end{bmatrix}^\\top$$";
    } else {
      latex += "\\end{bmatrix}$$";
    }

    setMatrixLatex(latex);
  }, [matrix]);

  return (
    <div
      className="matrix"
      style={{ marginTop: transpose ? -4 : 0 }}
      onClick={() => {
        if (transpose) {
          applyMatrix(matrix.transpose());
        } else {
          applyMatrix(matrix);
        }
      }}
    >
      <Latex>{matrixLatex}</Latex>
    </div>
  );
};
