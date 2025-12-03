// frontend/src/components/TypewriterScene.tsx
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
  texture: THREE.CanvasTexture | null; // ✅ now passed from App.tsx
};

export default function TypewriterScene(props: Props) {
  const { texture } = props;

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0.8, 3.5], fov: 35 }}
    >
      <ambientLight intensity={1.0} />
      <directionalLight intensity={1.2} position={[4, 8, 4]} />

      <TypewriterModel {...props} texture={texture} />

      <OrbitControls enableZoom={false} target={[0, 0, 0]} />
    </Canvas>
  );
}

/* ---------------------------------------------------------
   Model component — REUSES the baked paper inside the GLB
--------------------------------------------------------- */
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
  const initialY = useRef<number>(0);
  const shakeIntensity = useRef<number>(0);
  const groupRef = useRef<THREE.Group>(null);

  const LOGIN_OFFSET = -0.35;
  const SIGNUP_OFFSET = 0.0;

  // simulate shake when typing
  useEffect(() => {
    shakeIntensity.current = 0.5;
  }, [email, password, language, state]);

  useFrame((_state, delta) => {
    if (!paperMeshRef.current) return;

    const totalChars =
      (email?.length || 0) +
      (password?.length || 0) +
      (language?.length || 0) +
      (state?.length || 0);

    const modeOffset = mode === "login" ? LOGIN_OFFSET : SIGNUP_OFFSET;

    const targetY = initialY.current + modeOffset + totalChars * 0.0005;

    paperMeshRef.current.position.y = THREE.MathUtils.lerp(
      paperMeshRef.current.position.y,
      targetY,
      delta * 5
    );

    if (groupRef.current) {
      shakeIntensity.current = THREE.MathUtils.lerp(
        shakeIntensity.current,
        0,
        delta * 10
      );

      const s = shakeIntensity.current * 0.05;
      groupRef.current.position.x = (Math.random() - 0.5) * s;
      groupRef.current.position.y = -0.5 + (Math.random() - 0.5) * s;
      groupRef.current.position.z = (Math.random() - 0.5) * s;
    }
  });

  useEffect(() => {
    console.log("🟦 GLTF Loaded — Scene Graph:");
    gltf.scene.traverse((o) => console.log(o.name));

    // paper mesh inside your GLB
    const baked =
      (gltf.scene.getObjectByName("paper_paper_0") as THREE.Mesh) ||
      (gltf.scene.getObjectByName("paper") as THREE.Mesh);

    if (!baked) {
      console.warn("❗ Paper mesh not found in GLB!");
      return;
    }

    paperMeshRef.current = baked;
    if (initialY.current === 0) initialY.current = baked.position.y;

    if (!texture) return;

    // Apply dynamic form texture
    if (Array.isArray(baked.material)) {
      baked.material.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial;
        mat.map = texture;
        mat.needsUpdate = true;
      });
    } else {
      const mat = baked.material as THREE.MeshStandardMaterial;
      mat.map = texture;
      mat.needsUpdate = true;
    }
  }, [gltf, texture]);

  return (
    <group ref={groupRef} scale={0.5} position={[0, -0.5, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}
