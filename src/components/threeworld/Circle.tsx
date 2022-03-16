import { useEffect, useRef, useState } from "react";
import { MeshProps } from "@react-three/fiber";
import { Mesh, Vector3, Matrix3 } from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { EigenvalueDecomposition } from "ml-matrix";

interface CircleProps extends MeshProps {
  vector: Vector3;
  appliedMatrix: Matrix3;
}

export const Circle = ({
  vector,
  appliedMatrix: matrix,
  ...props
}: CircleProps) => {
  const mesh = useRef<Mesh>();

  const [color, setColor] = useState<string>("");

  useEffect(() => {
    const rgb = posToRGB(vector);
    setColor(rgb);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isCloseTo(matrix.determinant(), -1)) {
      const negativeDiagonalMatrix = new Matrix3().fromArray([
        -1, 0, 0, 0, -1, 0, 0, 0, -1,
      ]);
      matrix.multiply(negativeDiagonalMatrix);
    }

    if (mesh.current) {
      const currentMatrix = matrix.clone();
      move(currentMatrix, vector, mesh.current);
    }
  }, [mesh, vector, matrix]);

  return (
    <mesh {...props} ref={mesh}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshMatcapMaterial color={color} />
    </mesh>
  );
};

const move = (matrix: Matrix3, vector: Vector3, mesh: Mesh) => {
  // The matrix is a rotation matrix if its determinant is 1.
  if (isCloseTo(matrix.determinant(), 1)) {
    rotate(matrix, mesh);
  } else {
    scale(vector, mesh);
  }
};

const rotate = (matrix: Matrix3, mesh: Mesh): void => {
  const m = matrix.elements;
  const ev = new EigenvalueDecomposition([
    [m[0], m[3], m[6]],
    [m[1], m[4], m[7]],
    [m[2], m[5], m[8]],
  ]);

  // The rotation axis is the eigenvector with the corresponding eigenvalue 1.
  const eigenvectorIndex = ev.realEigenvalues.findIndex((e) => isCloseTo(e, 1));
  const k = new Vector3().fromArray(
    ev.eigenvectorMatrix.getColumn(eigenvectorIndex)
  );

  // Rotation angle is calculated by the trace.
  const trace = m[0] + m[4] + m[8];
  const theta = { value: Math.acos((trace - 1) / 2) };

  // Store the vector from where we being, because we will apply the rotation on
  // it for each angle in the tween and assign that position to the vector.
  const vector = mesh.position.clone();

  const angle = { value: 0 };
  const tween = new TWEEN.Tween(angle)
    .to(theta, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      const T = angle.value;
      const N = [-k.x, -k.y, -k.z];

      // Compute rotation matrix for the current angle.
      // Source: http://scipp.ucsc.edu/~haber/ph216/rotation_12.pdf (page 5).
      const R = new Matrix3().set(
        N[0] * N[0] * (1 - Math.cos(T)) + Math.cos(T),
        N[0] * N[1] * (1 - Math.cos(T)) - N[2] * Math.sin(T),
        N[0] * N[2] * (1 - Math.cos(T)) + N[1] * Math.sin(T),
        N[1] * N[0] * (1 - Math.cos(T)) + N[2] * Math.sin(T),
        N[1] * N[1] * (1 - Math.cos(T)) + Math.cos(T),
        N[1] * N[2] * (1 - Math.cos(T)) - N[0] * Math.sin(T),
        N[2] * N[0] * (1 - Math.cos(T)) - N[1] * Math.sin(T),
        N[2] * N[1] * (1 - Math.cos(T)) + N[0] * Math.sin(T),
        N[2] * N[2] * (1 - Math.cos(T)) + Math.cos(T)
      );

      // Apply the rotation matrix to the beginning vector and assign it to the
      // actual vector.
      const rotatedVector = vector.clone().applyMatrix3(R);
      mesh.position.copy(rotatedVector);
    })
    .onComplete(() => {
      // After the rotation is complete, set the vector to its actual position.
      // This makes it easier to find bugs.
      mesh.position.copy(vector.applyMatrix3(matrix));
    });

  tween.start();
};

export const scale = (vector: Vector3, mesh: Mesh): void => {
  var pos = mesh.position;

  const tween = new TWEEN.Tween(pos)
    .to(vector)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      mesh.position.set(pos.x, pos.y, pos.z);
    });

  tween.start();
};

// Since the vector is in three-dimensional space and RGB is a three-dimensional
// space, we can use it to assign a unique colour to each vector, so that we can
// keep track of the individual vectors.
const posToRGB = (vector: Vector3): string => {
  const x = Math.floor(((vector.x + 12) / 17) * 255);
  const y = Math.floor(((vector.y + 12) / 17) * 255);
  const z = Math.floor(((vector.z + 12) / 17) * 255);

  return `rgb(${x}, ${y}, ${z})`;
};

// Helper function because all the computations are not accurate, because they
// use floating-point numbers.
const isCloseTo = (a: number, b: number) => Math.abs(a - b) < 0.001;
