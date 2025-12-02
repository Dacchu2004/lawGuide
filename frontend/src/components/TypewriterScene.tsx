import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { createPaperCanvas } from "../utils/paperTexture";

function TypewriterModel({ typedText }: { typedText: string }) {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF("/assets/typewriter.glb");

  const paper = useRef<any>(null);

  // Load Paper Texture
  useEffect(() => {
    const { canvas, ctx, texture } = createPaperCanvas(
      2048,
      2048,
      "/assets/gov-paper.jpg"
    );

    paper.current = { canvas, ctx, texture };

    const paperMesh = gltf.scene.getObjectByName("Paper") as THREE.Mesh;
    if (paperMesh) {
      const material = new THREE.MeshStandardMaterial({ map: texture });
      if (material.map) material.map.flipY = false;
      paperMesh.material = material;
      paperMesh.material.needsUpdate = true;
    }
  }, [gltf]);

  // Draw text on paper
  useEffect(() => {
    if (!paper.current) return;
    const { ctx, texture } = paper.current;

    ctx.clearRect(0, 0, 2048, 2048);

    ctx.font = "48px 'Times New Roman'";
    ctx.fillStyle = "#111";

    let x = 200;
    let y = 450;

    typedText.split("").forEach((char) => {
      ctx.fillText(char, x, y);
      x += 32;
      if (x > 1600) {
        x = 200;
        y += 70;
      }
    });

    texture.needsUpdate = true;
  }, [typedText]);

  return (
    <group
      ref={group}
      scale={0.25}               // slightly larger
      position={[0, -0.2, 0.5]}    // LIFT TYPEWRITER UP
      rotation={[0, Math.PI * 2.0, 0]}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}

export default function TypewriterScene({ typedText }: { typedText: string }) {
  return (
    <Canvas
      style={{ background: "#d6d6d6" }} // FIX: remove white background
      camera={{
        position: [0, 1.5, 6],  // LIFT CAMERA UP
        fov: 35,
      }}
    >
      <ambientLight intensity={1} />
      <directionalLight intensity={1.2} position={[4, 8, 4]} />

      <TypewriterModel typedText={typedText} />

      <OrbitControls
        enableZoom={false}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 4}
      />
    </Canvas>
  );
}
