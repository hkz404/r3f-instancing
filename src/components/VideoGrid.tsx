import { useVideoTexture } from "@react-three/drei";
import { extend, Object3DNode, useFrame } from "@react-three/fiber";
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
  uniform vec2 uUv;
  uniform sampler2D uTex;

  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  void main() {
    vUv = uv;
    vec4 mvPosition = vec4( position, 1.0 );

    #ifdef USE_INSTANCING
      mvPosition = instanceMatrix * mvPosition;
    #endif

    vec3 color = texture(uTex, vec2(uUv.x, 1.-uUv.y)).rgb;

    float contrast = 0.5;
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    gray = (1.0 + contrast) * (gray - 0.5) + 0.5;

    mvPosition.y -= gray * 1.5;
    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
  }
`;

const fragmentShader = /*glsl*/ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uUv;
  uniform sampler2D uTex;

  void main() {
    vec3 color = texture(uTex, vec2(uUv.x, 1.-uUv.y)).rgb;
    gl_FragColor = vec4(vec3(color), 1.);
    #include <tonemapping_fragment>
  }
`;

const uniforms = {
  uTime: {
    value: 1.0,
  },
  uUv: {
    value: new THREE.Vector2(0, 0),
  },
  uTex: {
    value: new THREE.Texture(),
  },
};

const geometry = new THREE.BoxGeometry(0.88, 2, 0.88);

const material = new THREE.ShaderMaterial({
  uniforms,
  side: THREE.FrontSide,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const ShaderGrid = (props: any) => {
  const meshRef = useRef<any>();
  const { resolution, position } = props;

  const VideoMaterial = ({ src }: any) => {
    const texture = useVideoTexture(src);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    uniforms.uTex.value = texture;

    return (
      <meshStandardMaterial
        side={THREE.FrontSide}
        map={texture}
        toneMapped={false}
        transparent
        opacity={0.4}
      />
    );
  };

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
        position={[-resolution / 2 - 7 + position[0], position[1], position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[8, 8]} />
        <VideoMaterial src='/r3f-instancing/kunkun.mp4' />
      </mesh>

      <instancedUniformsMesh
        ref={meshRef}
        position={position}
        args={[geometry, material, resolution * resolution]}
      />
    </>
  );
};

export default ShaderGrid;
