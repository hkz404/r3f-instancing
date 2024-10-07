import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const tempColor = new THREE.Color();
const tempObject = new THREE.Object3D();
const tempVector2 = new THREE.Vector2();

const MatGrid = (props: any) => {
  const { resolution, imgData } = props;

  const data = Array.from({ length: resolution * resolution }, () => ({
    color: "#20ffa0",
    scale: 1,
  }));

  const meshRef = useRef<any>();
  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(resolution * resolution)
          .fill(0)
          .flatMap((_, i) => tempColor.set(data[i].color).toArray())
      ),
    [data, resolution]
  );

  useFrame(() => {
    if (!meshRef.current) return;

    let i = 0;
    let j = 0;
    for (let z = 0; z < resolution; z++) {
      for (let x = 0; x < resolution; x++) {
        const id = i++;
        tempVector2.set(x / resolution, z / resolution);
        tempObject.position.set(-resolution / 2 + x, 0, -resolution / 2 + z);

        if (imgData) {
          const heightScale = (((255 - imgData[j]) / 255) * resolution) / 30;
          tempObject.scale.setY(Math.max(heightScale, 0.1));

          if (imgData[j] < 255) {
            tempColor.set("#ff4060").toArray(colorArray, id * 3);
            meshRef.current.geometry.attributes.color.needsUpdate = true;
          }
        }

        j += 4;
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(id, tempObject.matrix);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, resolution * resolution]}
    >
      <boxGeometry args={[0.88, 2, 0.88]}>
        <instancedBufferAttribute
          attach='attributes-color'
          args={[colorArray, 3]}
        />
      </boxGeometry>
      <meshStandardMaterial toneMapped={false} vertexColors />
    </instancedMesh>
  );
};

export default MatGrid;
