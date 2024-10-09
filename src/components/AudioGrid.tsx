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

    // vec3 color = texture(uTex, vec2(uUv.x, 1.-uUv.y)).rgb;

    // float contrast = 0.5;
    // float gray = dot(color, vec3(0.299, 0.587, 0.114));
    // gray = (1.0 + contrast) * (gray - 0.5) + 0.5;

    // mvPosition.y -= gray * 2.;
    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
  }
`;

const fragmentShader = /*glsl*/ `
  varying vec2 vUv;
  uniform vec2 uUv;
  uniform float uTime;
  uniform sampler2D uTex;

  vec3 mixc(vec3 col1, vec3 col2, float v) {
    v = clamp(v, 0.0, 1.0);
    return col1 + v * (col2 - col1);
  }

  void main() {
    vec2 uv = vec2(uUv.x, 1.-uUv.y);
    vec2 p = uv * 2.0-1.0;
    p.y += 1.;

    vec3 col = vec3(0.0);

    float nBands = 32.0;
    float i = floor(uv.x * nBands);
    float f = fract(uv.x * nBands);

    float band = i/nBands;
    // band *= band * band;
    // band = band*0.995;
    // band += 0.005;

    float s = texture(uTex, vec2(band, 0.25)).x;

    const int nColors = 4;
    vec3 colors[nColors];
    colors[0] = vec3(0.0,0.0,1.0);
    colors[1] = vec3(0.0,1.0,1.0);
    colors[2] = vec3(1.0,1.0,0.0);
    colors[3] = vec3(1.0,0.0,0.0);

    vec3 gradCol = colors[0];
    float n = float(nColors)-1.0;
    for(int i = 1; i < nColors; i++) {
      gradCol = mixc(gradCol, colors[i], (s-float(i-1)/n)*n);
    }

    col += vec3(1.0-smoothstep(0.0,0.01,p.y-s*1.5));
    col *= gradCol;

    // col *= smoothstep(0.05,0.1,f);
    // col *= smoothstep(0.95,0.9,f);

    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
    // #include <tonemapping_fragment>
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
  // side: THREE.FrontSide,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const AudioGrid = (props: any) => {
  const meshRef = useRef<any>();
  const { resolution, position } = props;

  const { texture } = useAudioTexture({ width: 512, height: 512 });
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
        position={[-resolution / 2 - 7 + position[0], position[1], position[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      <instancedUniformsMesh
        ref={meshRef}
        args={[geometry, material, resolution * resolution]}
      />
    </>
  );
};

export default AudioGrid;
