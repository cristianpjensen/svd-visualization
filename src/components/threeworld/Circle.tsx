import { useEffect, useRef, useState } from "react";
import { MeshProps } from "@react-three/fiber";
import { Mesh, Vector3, Matrix3 } from "three";
import * as TWEEN from "@tweenjs/tween.js";

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
  const inverse = matrix.clone().invert();
  const transpose = matrix.clone().transpose();

  // The matrix is a rotation matrix if its determinant is 1 and the inverse is
  // equal to the transpose.
  if (
    isCloseTo(matrix.determinant(), 1) &&
    isMatrixCloseTo(inverse, transpose)
  ) {
    rotate(matrix, vector, mesh);
  } else {
    scale(vector, mesh);
  }
};

const rotate = (
  matrix: Matrix3,
  resultingVector: Vector3,
  mesh: Mesh
): void => {
  // Rotation angle is calculated by the trace.
  const m = matrix.elements;
  const trace = m[0] + m[4] + m[8];
  const theta = { value: Math.acos((trace - 1) / 2) };

  // If the trace is 3, then the matrix is the identity matrix, so no
  // transformation is needed.
  if (isCloseTo(trace, 3)) {
    return;
  }

  // Compute the rotation axis.
  // http://scipp.ucsc.edu/~haber/ph216/rotation_12.pdf (pages 6, 7)
  const n = new Vector3();
  n.set(m[7] - m[5], m[2] - m[6], m[3] - m[1]);
  n.multiplyScalar(1 / Math.sqrt((3 - trace) * (1 + trace)));
  // The rotation is the inverse of this vector.
  n.multiplyScalar(-1);

  // Store the vector from where we begin, because we will apply the rotation on
  // it for each angle in the tween and assign that position to the vector.
  const vector = mesh.position.clone();

  const angle = { value: 0 };
  const tween = new TWEEN.Tween(angle)
    .to(theta, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      const T = angle.value;

      // Compute rotation matrix for the current angle.
      // Source: http://scipp.ucsc.edu/~haber/ph216/rotation_12.pdf (page 5).
      const R = new Matrix3().set(
        n.x * n.x * (1 - Math.cos(T)) + Math.cos(T),
        n.x * n.y * (1 - Math.cos(T)) - n.z * Math.sin(T),
        n.x * n.z * (1 - Math.cos(T)) + n.y * Math.sin(T),
        n.y * n.x * (1 - Math.cos(T)) + n.z * Math.sin(T),
        n.y * n.y * (1 - Math.cos(T)) + Math.cos(T),
        n.y * n.z * (1 - Math.cos(T)) - n.x * Math.sin(T),
        n.z * n.x * (1 - Math.cos(T)) - n.y * Math.sin(T),
        n.z * n.y * (1 - Math.cos(T)) + n.x * Math.sin(T),
        n.z * n.z * (1 - Math.cos(T)) + Math.cos(T)
      );

      // Apply the rotation matrix to the beginning vector and assign it to the
      // actual vector.
      const rotatedVector = vector.clone().applyMatrix3(R);
      mesh.position.copy(rotatedVector);
    })
    .onComplete(() => {
      // After the rotation is complete, set the vector to its actual position.
      // This makes it easier to find bugs.
      mesh.position.copy(resultingVector);
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

// Helper function for inaccurate computations like floating-point arithmetic.
const isCloseTo = (a: number, b: number) => Math.abs(a - b) < 0.001;

// Helper function for inaccurate computations like floating-point arithmetic,
// constrained to 3x3 matrices.
const isMatrixCloseTo = (m1: Matrix3, m2: Matrix3) => {
  const m1Elements = m1.elements;
  const m2Elements = m2.elements;

  for (let i = 0; i < 9; i++) {
    if (!isCloseTo(m1Elements[i], m2Elements[i])) {
      return false;
    }
  }

  return true;
};
