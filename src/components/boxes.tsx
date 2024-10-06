import * as THREE from "three";
import { useRef } from "react";
import { extend, useFrame, Object3DNode } from "@react-three/fiber";
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

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    // VERTEX POSITION
    vec4 mvPosition = vec4( position, 1.0 );

    #ifdef USE_INSTANCING
      mvPosition = instanceMatrix * mvPosition;
    #endif

    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float iTime;
  uniform vec2 cUv;

  void main() {
    // gl_FragColor = vec4(cUv.x, 1.-cUv.y, sin(iTime), 1.);
    gl_FragColor = vec4(0.5 + 0.5*cos(iTime+cUv.xyx+vec3(0,2,4)), 1.);
  }
`;

const uniforms = {
  iTime: {
    value: 1.0,
  },
  cUv: {
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

const Boxes = () => {
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    uniforms.iTime.value = time;

    let i = 0;
    for (let x = 0; x < 20; x++) {
      for (let z = 0; z < 20; z++) {
        const id = i++;
        tempVector2.set(x / 20, z / 20);
        tempObject.position.set(-10 + x, 0, -10 + z);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(id, tempObject.matrix);
        meshRef.current.setUniformAt("cUv", id, tempVector2);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedUniformsMesh ref={meshRef} args={[geometry, material, 400]} />
  );
};

export default Boxes;
