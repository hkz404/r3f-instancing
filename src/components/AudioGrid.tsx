import { extend, Object3DNode, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { InstancedUniformsMesh } from "three-instanced-uniforms-mesh";
import { useAudioTexture } from "../hooks/useAudioTexture";
extend({ InstancedUniformsMesh });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      audioMaterial: any;
      instancedUniformsMesh: Object3DNode<any, any>;
    }
  }
}

const tempObject = new THREE.Object3D();
const tempVector2 = new THREE.Vector2();

const vertexShader = /*glsl*/ `
  uniform vec2 uUv;
  varying vec2 vUv;
  uniform sampler2D uTex;

  void main() {
    vUv = uv;
    vec4 mvPosition = vec4( position, 1.0 );

    #ifdef USE_INSTANCING
      mvPosition = instanceMatrix * mvPosition;
    #endif

    vec3 color = texture(uTex, vec2(uUv.x, 1.-uUv.y)).rgb;
    float gray = max(max(color.r, color.g), color.b);
    mvPosition.y += gray * 2.;

    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
  }
`;

const fragmentShader = /*glsl*/ `
  varying vec2 vUv;
  uniform vec2 uUv;
  uniform float uTime;
  uniform sampler2D uTex;

  void main() {
    vec3 col = texture(uTex, vec2(uUv.x, 1.-uUv.y)).rgb;

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
  }
`;

const uniforms = {
  uTime: { value: 1.0 },
  uTex: { value: null },
  uUv: { value: new THREE.Vector2(0, 0) },
};

const geometry = new THREE.BoxGeometry(0.88, 2, 0.88);

const material = new THREE.ShaderMaterial({
  uniforms,
  side: THREE.FrontSide,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const AudioGrid = (props: any) => {
  const meshRef = useRef<any>();
  const { resolution, position } = props;

  const { texture } = useAudioTexture({
    width: 120,
    height: 120,
    mp3src: "/r3f-instancing/shadertoy2.mp3",
  });
  material.uniforms.uTex.value = texture;

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    uniforms.uTime.value = time;

    let i = 0;
    for (let z = 0; z < resolution; z++) {
      for (let x = 0; x < resolution; x++) {
        const id = i++;
        tempVector2.set(x / resolution, z / resolution);
        tempObject.position.set(-resolution / 2 + x, 0, -resolution / 2 + z);
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(id, tempObject.matrix);
        meshRef.current.setUniformAt("uUv", id, tempVector2);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-resolution / 2 - 7 + position[0], position[1], position[2]]}
      >
        <planeGeometry args={[8, 8]} />
        {texture ? <meshBasicMaterial map={texture} /> : null}
      </mesh>

      <instancedUniformsMesh
        ref={meshRef}
        args={[geometry, material, resolution * resolution]}
      />
    </>
  );
};

export default AudioGrid;
