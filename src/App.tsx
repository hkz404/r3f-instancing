import {
  Center,
  Environment,
  Grid,
  Loader,
  OrbitControls,
  PerformanceMonitor,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AudioGrid from "./components/AudioGrid";
import MatGrid from "./components/MatGrid";
import VideoGrid from "./components/VideoGrid";

const App = () => {
  const charRef = useRef<string>("");
  const [preview, setPreview] = useState<string>("");
  const [downsample, setDownsample] = useState<string>("");
  const [imgData, setImgData] = useState<Uint8ClampedArray>();
  const [audioCtrl, showAudioCtrl] = useState<boolean>(false);

  const { resolution } = useControls({
    resolution: {
      value: 30,
      options: [10, 20, 30, 40, 50, 60, 70, 80, 100],
    },
  });

  const location = useLocation();

  const chooseChar = (char: string) => {
    charRef.current = char;
    const offCanvas = document.createElement("canvas");
    offCanvas.width = offCanvas.height = 500;
    const offCtx = offCanvas.getContext("2d")!;
    offCtx.fillStyle = "white";
    offCtx.fillRect(0, 0, 500, 500);
    offCtx.font = "bold 400px Noto Sans TC";
    offCtx.fillStyle = "black";
    offCtx.textAlign = "center";
    offCtx.fillText(char, 250, 410, 500);
    const preview = offCanvas.toDataURL();
    setPreview(preview);

    const offCanvas2 = document.createElement("canvas");
    offCanvas2.width = resolution;
    offCanvas2.height = resolution;
    const offCtx2 = offCanvas2.getContext("2d")!;
    offCtx2.fillStyle = "white";
    offCtx2.fillRect(0, 0, 500, 500);
    offCtx2.imageSmoothingEnabled = true;
    offCtx2.drawImage(
      offCanvas,
      0,
      0,
      offCanvas.width,
      offCanvas.height,
      0,
      0,
      offCanvas2.width,
      offCanvas2.height
    );
    const preview2 = offCanvas2.toDataURL();
    setDownsample(preview2);

    setImgData(offCtx2.getImageData(0, 0, resolution, resolution).data);
  };

  useEffect(() => {
    if (!charRef.current) return;
    chooseChar(charRef.current);
  }, [resolution]);

  return (
    <>
      <Suspense>
        {location.pathname === "/" ? (
          <div className='ui-panel'>
            <h2>Choose a charactor : </h2>
            <ul>
              <li onClick={() => chooseChar("M")}>M</li>
              <li onClick={() => chooseChar("中")}>中</li>
              <li onClick={() => chooseChar("あ")}>あ</li>
              <li onClick={() => chooseChar("한")}>한</li>
            </ul>

            {preview ? (
              <div className='flow'>
                <div className='item'>
                  <h3>Texture preview :</h3>
                  <img src={preview} alt='' width='100px' />
                </div>
                <div className='item'>
                  <span className='arrow'>→</span>
                </div>
                <div className='item'>
                  <h3>Downsampling :</h3>
                  <img src={downsample} alt='' width='100px' />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {location.pathname === "/audio" ? (
          <>
            {/* <div className='ui-panel'>
              <audio
                src='/r3f-instancing/shadertoy.mp3'
                autoPlay={false}
                controls
                id='audioSource'
              />
            </div> */}

            {!audioCtrl ? (
              <div className='play-btn'>
                <img
                  src='/r3f-instancing/play.svg'
                  alt=''
                  width='100px'
                  onClick={() => {
                    showAudioCtrl(true);
                  }}
                />
              </div>
            ) : null}
          </>
        ) : null}

        <Canvas dpr={[1, 2]} camera={{ position: [-22, 30, 45], fov: 45 }}>
          <directionalLight position={[0, 5, 0]} intensity={1} />
          <Environment files='./sunset.hdr' environmentIntensity={1} />

          {location.pathname === "/" ? (
            <Center top>
              <MatGrid resolution={resolution} imgData={imgData} />
            </Center>
          ) : null}

          {location.pathname === "/video" ? (
            <VideoGrid resolution={resolution} position={[0, 2.5, 0]} />
          ) : null}

          {location.pathname === "/audio" && audioCtrl ? (
            <AudioGrid resolution={resolution} position={[0, 2.5, 0]} />
          ) : null}

          <Grid
            renderOrder={-1}
            position={[0, 0, 0]}
            infiniteGrid
            cellSize={0.6}
            cellThickness={0.6}
            sectionSize={3.3}
            sectionThickness={1.5}
            sectionColor='#181818'
            fadeDistance={1000}
          />

          <OrbitControls
            makeDefault
            enabled={true}
            maxPolarAngle={Math.PI / 3}
            minDistance={20}
            maxDistance={180}
          />

          <Monitor />

          <EffectComposer>
            {/* <ToneMapping /> */}
            <N8AO distanceFalloff={1} aoRadius={2} intensity={1} />
          </EffectComposer>

          <Perf position='top-left' />
        </Canvas>
      </Suspense>
      <Loader />
    </>
  );
};

const Monitor = () => {
  const state = useThree();
  const [degraded, degrade] = useState(false);

  useEffect(() => {
    if (!degraded) return;
    console.log("degrade!");
    state.setDpr(1);
  }, [degraded]);

  return <PerformanceMonitor onDecline={() => degrade(true)} />;
};

export default App;
