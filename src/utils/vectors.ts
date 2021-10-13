import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import _ from "lodash";

/**
 * Creates a dot to represent a vector in `scene`. It also assigns a colour,
 * based on initial position, which makes it easier to differentiate between
 * vectors after transformations.
 * @param vector coordinates.
 * @param scene scene to add vector to.
 * @returns sphere object.
 */
export const vectorCreate = (
  vector: THREE.Vector3,
  scene: THREE.Scene
): THREE.Mesh => {
  const rgb = posToRGB(vector);

  const material = new THREE.MeshPhongMaterial({
    color: rgb,
    specular: rgb,
    shininess: 10,
  });

  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(vector.x, vector.y, vector.z);
  scene.add(sphere);

  return sphere;
};

/**
 * Computes the RGB colour code to assign to a vector. It basically just
 * assigns the x-, y-, and z-component to the red, green, and blue channel,
 * respectively.
 * @param vector three dimensional vector.
 * @returns rgb colour code.
 */
const posToRGB = (vector: THREE.Vector3): string => {
  const x = Math.floor(((vector.x + 8) / 17) * 255);
  const y = Math.floor(((vector.y + 8) / 17) * 255);
  const z = Math.floor(((vector.z + 8) / 17) * 255);

  return `rgb(${x}, ${y}, ${z})`;
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
export const vectorRotate = (
  matrix: THREE.Matrix3,
  objVector: THREE.Mesh
): void => {
  // get angle and rotation axis from matrix
  const [m00, m10, m20, m01, m11, m21, m02, m12, m22] = matrix.elements;

  const m = new THREE.Matrix4();
  m.set(m00, m01, m02, 1, m10, m11, m12, 1, m20, m21, m22, 1, 0, 0, 0, 1);

  var eu = new THREE.Euler();
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
      const eulerMatrix = new THREE.Matrix3();

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
export const vectorScale = (
  vector: THREE.Vector3,
  objVector: THREE.Mesh
): void => {
  var pos = objVector.position;

  const tween = new TWEEN.Tween(pos)
    .to(vector)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      objVector.position.set(pos.x, pos.y, pos.z);
    });

  tween.start();
};
