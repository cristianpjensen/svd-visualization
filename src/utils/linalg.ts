import { MutableRefObject } from "react";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Generates a three-dimensional linear algebra graph.
 * @param ref referencing div element for visualisation.
 * @param scene scene object.
 * @param renderer renderer object.
 * @param material material object.
 */
export const graph = (
  ref: MutableRefObject<HTMLDivElement | null>,
  scene: THREE.Scene,
  renderer: THREE.Renderer,
  material: THREE.Material,
): void => {
  const dims = dimensions();

  const camera = new THREE.PerspectiveCamera(
    75,
    dims.width / dims.height,
    0.1,
    1000
  );

  const element = ref?.current?.appendChild(renderer.domElement);

  element && (element.style.margin = "0 auto");

  const axisGeometry = new THREE.CylinderGeometry(0.05, 0.05, 16, 64);
  const xAxis = new THREE.Mesh(axisGeometry, material);
  xAxis.rotation.z = Math.PI / 2;
  const yAxis = new THREE.Mesh(axisGeometry, material);
  const zAxis = new THREE.Mesh(axisGeometry, material);
  zAxis.rotation.x = Math.PI / 2;
  scene.add(xAxis);
  scene.add(yAxis);
  scene.add(zAxis);

  const coneGeometry = new THREE.ConeGeometry(0.3, 0.6, 64);
  const xCone = new THREE.Mesh(coneGeometry, material);
  xCone.position.x = 8;
  xCone.rotation.z = -Math.PI / 2;
  const yCone = new THREE.Mesh(coneGeometry, material);
  yCone.position.y = 8;
  const zCone = new THREE.Mesh(coneGeometry, material);
  zCone.position.z = 8;
  zCone.rotation.x = Math.PI / 2;
  scene.add(xCone);
  scene.add(yCone);
  scene.add(zCone);

  const tickGeometry = new THREE.BoxGeometry(0.03, 0.5, 0.03);

  for (let i = -7; i < 8; i++) {
    const xTick = new THREE.Mesh(tickGeometry, material);
    xTick.position.x = i;
    xTick.rotation.x = Math.PI / 2;
    const yTick = new THREE.Mesh(tickGeometry, material);
    yTick.position.y = i;
    yTick.rotation.z = Math.PI / 2;
    const zTick = new THREE.Mesh(tickGeometry, material);
    zTick.position.z = i;
    scene.add(xTick);
    scene.add(yTick);
    scene.add(zTick);
  }

  const light1 = new THREE.DirectionalLight(0xffffff, 0.7);
  const light2 = new THREE.DirectionalLight(0xffffff, 0.7);
  light1.position.set(8, 8, 8);
  light2.position.set(-8, -8, -8);
  scene.add(light1);
  scene.add(light2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  camera.rotation.set(-0.57, 0.74, 0.41);
  camera.position.set(9.42, 5.59, 8.72);

  const animate = () => {
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
  };

  animate();
}

/**
 * Returns a square of three dimensional vector coordinates.
 * @param x width of the x-axis.
 * @param y width of the y-axis.
 * @param z width of the z-axis.
 * @param vectors amount of vectors to use per side.
 * @returns coordinates to the appropriate vectors.
 */
export const squareTemplate = (
  x: number,
  y: number,
  z: number,
  vectors: number,
): Array<THREE.Vector3> => {
  let coords = [];

  for (let i = -0.5 * x; i <= 0.5 * x; i += x / (vectors - 1)) {
    coords.push(new THREE.Vector3(i, 0.5 * y, 0.5 * z));
    coords.push(new THREE.Vector3(i, -0.5 * y, 0.5 * z));
    coords.push(new THREE.Vector3(i, 0.5 * y, -0.5 * z));
    coords.push(new THREE.Vector3(i, -0.5 * y, -0.5 * z));
  }

  for (let i = -0.5 * y; i <= 0.5 * y; i += y / (vectors - 1)) {
    coords.push(new THREE.Vector3(0.5 * x, i, 0.5 * z));
    coords.push(new THREE.Vector3(-0.5 * x, i, 0.5 * z));
    coords.push(new THREE.Vector3(0.5 * x, i, -0.5 * z));
    coords.push(new THREE.Vector3(-0.5 * x, i, -0.5 * z));
  }

  for (let i = -0.5 * z; i <= 0.5 * z; i += z / (vectors - 1)) {
    coords.push(new THREE.Vector3(0.5 * x, 0.5 * y, i));
    coords.push(new THREE.Vector3(-0.5 * x, 0.5 * y, i));
    coords.push(new THREE.Vector3(0.5 * x, -0.5 * y, i));
    coords.push(new THREE.Vector3(-0.5 * x, -0.5 * y, i));
  }

  return coords;
}

interface DimsType {
  margin: Margin;
  padding: Margin;
  outerWidth: number;
  outerHeight: number;
  ticks: number;
  innerWidth: number;
  innerHeight: number;
  width: number;
  height: number;
  origin: { x: number; y: number };
  unit: { x: number; y: number };
}

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Returns the dimensions of the graph.
 * @returns object containing the dimensions of the graph.
 */
export const dimensions = (): DimsType => {
  const dims: any = {
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    padding: { top: 0, right: 0, bottom: 0, left: 0 },
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
    ticks: 10,
  };

  dims.innerWidth = dims.outerWidth - dims.margin.left - dims.margin.right;
  dims.innerHeight = dims.outerHeight - dims.margin.top - dims.margin.bottom;
  dims.width = dims.innerWidth - dims.padding.left - dims.padding.right;
  dims.height = dims.innerHeight - dims.padding.top - dims.padding.bottom;

  dims.origin = {
    x: dims.innerWidth / 2,
    y: dims.innerHeight / 2,
  };

  dims.unit = {
    x: dims.innerWidth / (dims.ticks + 1.5),
    y: dims.innerHeight / (dims.ticks + 1.5),
  };

  return dims;
};
