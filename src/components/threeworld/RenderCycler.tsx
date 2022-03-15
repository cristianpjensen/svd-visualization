import { memo, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import * as TWEEN from "@tweenjs/tween.js";

export const RenderCycler = memo(() => {
  const { gl, scene, camera } = useThree();

  const render = useCallback(() => {
    gl.render(scene, camera);
  }, [gl, scene, camera]);

  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    TWEEN.update();
    render();
  }, [render]);

  animate();

  return <></>;
});
