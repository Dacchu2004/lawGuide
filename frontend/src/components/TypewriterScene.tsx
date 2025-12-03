import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type Props = {
  mode: "login" | "signup";
  email: string;
  password: string;
  language?: string;
  state?: string;
  texture: THREE.CanvasTexture | null;
};

export default function TypewriterScene({
  mode,
  email,
  password,
  language,
  state,
  texture,
}: Props) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0.8, 3.5], fov: 35 }}
    >
      <ambientLight intensity={1.0} />
      <directionalLight intensity={1.2} position={[4, 8, 4]} />

      <TypewriterModel
        mode={mode}
        email={email}
        password={password}
        language={language}
        state={state}
        texture={texture}
      />

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}

function TypewriterModel({
  mode,
  email,
  password,
  language,
  state,
  texture,
}: Props) {
  const gltf = useGLTF("/assets/typewriter.glb");
  const paperMeshRef = useRef<THREE.Mesh | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const shake = useRef(0);

  useEffect(() => {
    shake.current = 0.3;
  }, [mode, email, password, language, state]);

  useFrame((_s, delta) => {
    if (!groupRef.current) return;
    shake.current = THREE.MathUtils.lerp(shake.current, 0, delta * 8);

    const s = shake.current * 0.05;
    groupRef.current.position.x = (Math.random() - 0.5) * s;
    groupRef.current.position.y = -0.5 + (Math.random() - 0.5) * s;
    groupRef.current.position.z = (Math.random() - 0.5) * s;
  });

  useEffect(() => {
    const baked =
      (gltf.scene.getObjectByName("paper_paper_0") as THREE.Mesh) ||
      (gltf.scene.getObjectByName("paper") as THREE.Mesh);

    if (!baked || !texture) return;

    paperMeshRef.current = baked;

    texture.flipY = false;
    texture.center.set(0.5, 0.5);
    texture.rotation = (-90 * Math.PI) / 180;

    if (Array.isArray(baked.material)) {
      baked.material.forEach((m) => {
        (m as THREE.MeshStandardMaterial).map = texture;
        m.needsUpdate = true;
      });
    } else {
      (baked.material as THREE.MeshStandardMaterial).map = texture;
      baked.material.needsUpdate = true;
    }
  }, [texture, gltf]);

  return (
    <group ref={groupRef} scale={0.5} position={[0, -0.5, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}
