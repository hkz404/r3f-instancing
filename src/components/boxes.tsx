import { extend, Object3DNode, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";
import { InstancedUniformsMesh } from "three-instanced-uniforms-mesh";
extend({ InstancedUniformsMesh });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      instancedUniformsMesh: Object3DNode<any, any>;
    }
  }
}

const tempObject = new THREE.Object3D();
const tempVector2 = new THREE.Vector2();

const vertexShader = /*glsl*/ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 mvPosition = vec4( position, 1.0 );

    #ifdef USE_INSTANCING
      mvPosition = instanceMatrix * mvPosition;
    #endif

    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
  }
`;

const fragmentShader = /*glsl*/ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uUv;

  void main() {
    // gl_FragColor = vec4(uUv.x, 1.-uUv.y, sin(uTime), 1.);
    gl_FragColor = vec4(0.5 + 0.5*cos(uTime+uUv.xyx+vec3(0,2,4)), 1.);
    #include <tonemapping_fragment>
    // #include <encodings_fragment>
  }
`;

const uniforms = {
  uTime: {
    value: 1.0,
  },
  uUv: {
    value: new THREE.Vector2(0, 0),
  },
};

const geometry = new THREE.BoxGeometry(0.88, 2, 0.88);
const material = new THREE.ShaderMaterial({
  uniforms,
  side: THREE.FrontSide,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

// const material2 = new THREE.MeshStandardMaterial({ color: "lightgreen" });

const Boxes = () => {
  const meshRef = useRef<any>();

  const { resolution } = useControls({
    resolution: {
      value: 30,
      options: [10, 20, 30, 40, 50, 60, 70, 80, 100],
    },
  });

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    uniforms.uTime.value = time;

    let i = 0;
    for (let x = 0; x < resolution; x++) {
      for (let z = 0; z < resolution; z++) {
        const id = i++;
        tempVector2.set(x / resolution, z / resolution);
        tempObject.position.set(-resolution / 2 + x, 0, -resolution / 2 + z);
        // tempObject.scale.set(1, (x + z) / resolution, 1);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(id, tempObject.matrix);
        meshRef.current.setUniformAt("uUv", id, tempVector2);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedUniformsMesh
      ref={meshRef}
      args={[geometry, material, resolution * resolution]}
    />
  );
};

export default Boxes;
