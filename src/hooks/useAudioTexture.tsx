import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { EffectComposer, ShaderPass } from "three-stdlib";

class AudioTexture {
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  texture!: THREE.Texture;
  material!: THREE.ShaderMaterial;
  domain!: Uint8Array;
  frequency!: Uint8Array;
  analyserNode!: AnalyserNode;
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.OrthographicCamera;
  audio!: HTMLAudioElement;
  composer!: EffectComposer;
  width: number;
  height: number;

  constructor({ width = 512, height = 512 }: any) {
    this.width = width;
    this.height = height;
    this.initScene();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(this.width, this.height);
    this.canvas = this.renderer.domElement;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.texture = new THREE.Texture(this.canvas);
    this.composer = new EffectComposer(this.renderer);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uTex: { value: null },
      },

      vertexShader: /* glsl */ `
        precision mediump float;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,

      fragmentShader: /* glsl */ `
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

          // 默认蓝色（频率最低）
          vec3 gradCol = colors[0];
          float n = float(nColors)-1.0;
          for(int i = 1; i < nColors; i++) {
            gradCol = mixc(gradCol, colors[i], (s-float(i-1)/n)*n);
          }

          // 柱子颜色
          col += vec3(1.0-smoothstep(0.0,0.01,p.y-s*1.5));
          col *= gradCol;

          // 每根柱子间增加间隙
          col *= smoothstep(0.05,0.1,f);
          col *= smoothstep(0.95,0.9,f);

          // 约束颜色不要超出边界
          col = clamp(col, 0.0, 1.0);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const pass = new ShaderPass(this.material);
    this.composer.addPass(pass);

    this.audio = document.createElement("audio");
    this.audio.src = "/r3f-instancing/shadertoy.mp3";
    this.audio.play();

    const audioCtx = new AudioContext({ sampleRate: 44100 });
    const mediaStreamAudioSourceNode = audioCtx.createMediaElementSource(
      this.audio
    );
    this.analyserNode = audioCtx.createAnalyser();
    this.analyserNode.fftSize = 1024;
    this.analyserNode.smoothingTimeConstant = 0.8;

    mediaStreamAudioSourceNode.connect(this.analyserNode);
    this.analyserNode.connect(audioCtx.destination);

    this.domain = new Uint8Array(this.analyserNode.fftSize);
    this.frequency = new Uint8Array(this.analyserNode.frequencyBinCount);
  }

  update(time: number) {
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

    this.composer.render();
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.audio.currentTime = 0;
    this.audio.pause();
    this.audio.src = "";
    this.analyserNode = null!;
    this.domain = null!;
    this.frequency = null!;
    this.texture.dispose();
    this.material.dispose();
    this.composer.dispose();
    this.audio.remove();
    this.canvas.remove();
  }
}

export function useAudioTexture(config: any) {
  const audioTex = useMemo(() => new AudioTexture(config), [config]);

  useFrame((state) => {
    if (audioTex) {
      audioTex.update(state.clock.getElapsedTime());
    }
  });

  useEffect(() => {
    return () => {
      audioTex.dispose();
    };
  }, []);

  return { texture: audioTex.texture };
}