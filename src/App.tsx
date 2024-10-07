import { Center, Grid, Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import { Perf } from "r3f-perf";
import { Suspense } from "react";
import "./App.css";
import Boxes from "./components/boxes";

const App = () => {
  return (
    <>
      <Suspense>
        <Canvas camera={{ position: [-8, 32, 40], fov: 45 }}>
          <directionalLight position={[0, 5, 0]} intensity={4} />
          {/* <Environment files='./sunset.hdr' environmentIntensity={1} /> */}

          <Center top>
            <Boxes />
          </Center>

          <Grid
            renderOrder={-1}
            position={[0, 0, 0]}
            infiniteGrid
            cellSize={0.6}
            cellThickness={0.6}
            sectionSize={3.3}
            sectionThickness={1.5}
            sectionColor='#181818'
            fadeDistance={60}
          />

          <OrbitControls makeDefault enabled={true} />

          <Perf position='top-left' />

          <EffectComposer>
            {/* <DepthOfField
              target={[0, 0, 0]}
              focalLength={0.3}
              bokehScale={15}
              height={100}
            /> */}
            {/* <HueSaturation saturation={-0.1} /> */}
            {/* <BrightnessContrast brightness={0} contrast={0.1} /> */}
            {/* <WaterEffect factor={0.75} /> */}
            {/* <TiltShift2 samples={16} blur={0.9} /> */}
            {/* <Bloom
              mipmapBlur
              levels={5}
              radius={0.9}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.8}
              intensity={0.5}
            /> */}
            {/* <ToneMapping /> */}
            <N8AO distanceFalloff={1} aoRadius={2} intensity={1} />
          </EffectComposer>

          {/* <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
            <GizmoViewport
              axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
              labelColor='white'
            />
          </GizmoHelper> */}
        </Canvas>
      </Suspense>
      <Loader />
    </>
  );
};

export default App;
