import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer, ShaderPass } from "three-stdlib";

const vertexShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const fragmentShader = /* glsl */ `
  // https://www.shadertoy.com/view/4lGSzy
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform sampler2D uTex;

  vec3 mixc(vec3 col1, vec3 col2, float v) {
    v = clamp(v,0.0,1.0);
    return col1+v*(col2-col1);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * 2.0-1.0;
    p.y += 1.;

    vec3 col = vec3(0.);
    float nBands = 30.;
    float i = floor(uv.x * nBands);
    float f = fract(uv.x * nBands);

    float band = i/nBands;
    band *= band * band;
    band = band*0.995;
    band += 0.005;

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

    col *= smoothstep(0.05,0.1,f);
    col *= smoothstep(0.95,0.9,f);
    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;

class AudioTexture {
  width: number;
  height: number;
  scale: number;
  dpr: number;
  mp3src: string;

  texture?: THREE.Texture;
  composer?: EffectComposer;
  material?: THREE.ShaderMaterial;
  renderer?: THREE.WebGLRenderer;

  domain?: Uint8Array;
  frequency?: Uint8Array;
  audio?: HTMLAudioElement;
  analyserNode?: AnalyserNode;

  constructor({ width = 512, height = 512, mp3src, scale = 1, dpr = 1 }: any) {
    this.dpr = dpr;
    this.scale = scale;
    this.width = width;
    this.height = height;
    this.mp3src = mp3src;
    this.initScene();
  }

  initScene() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(this.width * this.scale, this.height * this.scale);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.texture = new THREE.Texture(this.renderer.domElement);
    this.composer = new EffectComposer(this.renderer);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uTex: { value: null },
      },
      vertexShader,
      fragmentShader,
    });

    this.composer.addPass(new ShaderPass(this.material));

    this.audio = document.createElement("audio");
    this.audio.src = this.mp3src;
    this.audio.play();

    const audioCtx = new AudioContext({ sampleRate: 44100 });
    const audioSource = audioCtx.createMediaElementSource(this.audio);
    this.analyserNode = audioCtx.createAnalyser();
    this.analyserNode.fftSize = 1024;
    this.analyserNode.smoothingTimeConstant = 0.8;

    audioSource.connect(this.analyserNode);
    this.analyserNode.connect(audioCtx.destination);

    this.domain = new Uint8Array(this.analyserNode.fftSize);
    this.frequency = new Uint8Array(this.analyserNode.frequencyBinCount);
  }

  update(time: number) {
    if (this.analyserNode && this.domain && this.frequency && this.material) {
      this.analyserNode.getByteTimeDomainData(this.domain);
      this.analyserNode.getByteFrequencyData(this.frequency);

      const mergedArray = new Uint8Array(
        this.domain.length + this.frequency.length
      );
      mergedArray.set(this.frequency);
      mergedArray.set(this.domain, this.frequency.length);

      const datatexture = new THREE.DataTexture(
        mergedArray,
        this.analyserNode.frequencyBinCount,
        2,
        THREE.RedFormat
      );

      this.material.uniforms.uTime.value = time;
      this.material.uniforms.uTex.value = datatexture;
      this.material.uniforms.uTex.value.needsUpdate = true;
    }

    if (this.composer && this.texture) {
      this.composer.render();
      this.texture.needsUpdate = true;
    }
  }

  dispose() {
    this.audio?.pause();
    this.analyserNode?.disconnect();

    this.domain = null!;
    this.frequency = null!;

    this.texture?.dispose();
    this.material?.dispose();
    this.composer?.dispose();
    this.renderer?.dispose();
  }
}

export function useAudioTexture(config: any) {
  const [audioTex, setAudioTex] = useState<AudioTexture | null>(null);
  const texRef = useRef<AudioTexture | null>(null);

  useEffect(() => {
    texRef.current = new AudioTexture(config);
    setAudioTex(texRef.current);

    return () => {
      setAudioTex(null);
      texRef.current?.dispose();
      texRef.current = null;
    };
  }, []);

  useFrame((state) => {
    if (!audioTex) return;
    audioTex.update(state.clock.getElapsedTime());
  });

  return { texture: audioTex?.texture };
}
