import {
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
import { Suspense, useEffect, useState } from "react";
import ShaderGrid from "./components/ShaderGrid";

const App = () => {
  const { resolution } = useControls({
    resolution: {
      value: 30,
      options: [10, 20, 30, 40, 50, 60, 70, 80, 100],
    },
  });

  return (
    <>
      <Suspense>
        <Canvas dpr={[1, 2]} camera={{ position: [-8, 32, 40], fov: 45 }}>
          <directionalLight position={[0, 5, 0]} intensity={4} />
          <Environment files='./sunset.hdr' environmentIntensity={1} />

          <ShaderGrid resolution={resolution} />

          <Grid
            renderOrder={-1}
            position={[0, -2, 0]}
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
            {/* <Bloom
              mipmapBlur
              levels={5}
              intensity={0.5}
              luminanceThreshold={0.5}
              luminanceSmoothing={0.5}
            /> */}
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
