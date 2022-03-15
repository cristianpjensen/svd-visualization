import { useEffect, useRef } from "react";
import { MeshProps } from "@react-three/fiber";
import { Mesh, Vector3, Matrix3, Matrix4, Euler } from "three";
import * as TWEEN from "@tweenjs/tween.js";
import _ from "lodash";

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

  useEffect(() => {
    if (mesh.current) {
      // Check if it is a scale matrix (by checking whether is S).
      const m = matrix.elements;
      const isScaleMatrix =
        m[1] + m[2] + m[3] + m[5] + m[6] + m[7] === 0 &&
        m[0] + m[4] + m[8] !== 0;
      if (isScaleMatrix) {
        scale(vector, mesh.current);
      } else {
        rotate(matrix, mesh.current);
      }
    }
  }, [mesh, vector, matrix]);

  return (
    <mesh position={vector} {...props} ref={mesh}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshMatcapMaterial color="lightgreen" />
    </mesh>
  );
};

/**
 * Rotates the vector with the rotation matrix. Make sure that the length stays
 * the same after the transformation, because this function only works with
 * rotation matrices. If there is any chance of the matrix not being a rotation
 * matrix, make use of the `vectorScale()` function.
 *
 * This calculates the euler angle from the rotation matrix, after which it
 * tweens between 0 and the euler angle. Then, every iteration of the tween, it
 * computes the matrix for the current euler angle and applies it to the vector.
 * @param matrix rotation matrix.
 * @param objVector vector object to move.
 */
const rotate = (matrix: Matrix3, objVector: Mesh): void => {
  // get angle and rotation axis from matrix
  const [m00, m10, m20, m01, m11, m21, m02, m12, m22] = matrix.elements;

  const m = new Matrix4();
  m.set(m00, m01, m02, 1, m10, m11, m12, 1, m20, m21, m22, 1, 0, 0, 0, 1);

  var eu = new Euler();
  eu.setFromRotationMatrix(m, "ZYX");

  const initPos = _.cloneDeep(objVector.position);
  var euler = {
    x: 0,
    y: 0,
    z: 0,
  };
  const e = { x: eu.x, y: eu.y, z: eu.z };

  const tween = new TWEEN.Tween(euler)
    .to(e, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      const eulerMatrix = new Matrix3();

      // https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Conversion_formulae_between_formalisms
      const { x, y, z } = euler;
      eulerMatrix.set(
        Math.cos(y) * Math.cos(z),
        -Math.cos(x) * Math.sin(z) + Math.sin(x) * Math.sin(y) * Math.cos(z),
        Math.sin(x) * Math.sin(z) + Math.cos(x) * Math.sin(y) * Math.cos(z),
        Math.cos(y) * Math.sin(z),
        Math.cos(x) * Math.cos(z) + Math.sin(x) * Math.sin(y) * Math.sin(z),
        -Math.sin(x) * Math.cos(z) + Math.cos(x) * Math.sin(y) * Math.sin(z),
        -Math.sin(y),
        Math.sin(x) * Math.cos(y),
        Math.cos(x) * Math.cos(y)
      );

      const init = _.cloneDeep(initPos);
      const pos = init.applyMatrix3(eulerMatrix);
      objVector.position.set(pos.x, pos.y, pos.z);
    });

  tween.start();
};

/**
 * Moves `objVector` to the position of `vector` by scaling. It basically just
 * goes from the (x, y, z)-position of the object to the (x, y, z)-position of
 * the vector.
 * @param vector vector to go to.
 * @param objVector vector to move.
 */
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
