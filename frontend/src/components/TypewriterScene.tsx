import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { usePaperForm } from "../hooks/usePaperForm";

type Props = {
  mode: "login" | "signup";
  email: string;
  password: string;
  language?: string;
  state?: string;
};

export default function TypewriterScene(props: Props) {
  const { texture } = usePaperForm(props);

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
   Model component — REUSING baked paper mesh
--------------------------------------------------------- */
function TypewriterModel({
  mode,
  email,
  password,
  language,
  state,
  texture,
}: Props & { texture: THREE.CanvasTexture | null }) {
  const gltf = useGLTF("/assets/typewriter.glb");
  const paperMeshRef = useRef<THREE.Mesh | null>(null);
  const initialY = useRef<number>(0);
  const shakeIntensity = useRef<number>(0);
  const groupRef = useRef<THREE.Group>(null);

  // Adjust these to calibrate the paper position
  const LOGIN_OFFSET = -0.35; // Move paper DOWN to show top section
  const SIGNUP_OFFSET = 0.0; // Default position (seems to be signup area)

  // Trigger shake on typing
  useEffect(() => {
    shakeIntensity.current = 0.5;
  }, [email, password, language, state]);

  useFrame((_state, delta) => {
    if (!paperMeshRef.current) return;

    // Calculate total characters typed (for subtle movement)
    const totalChars =
      (email?.length || 0) +
      (password?.length || 0) +
      (language?.length || 0) +
      (state?.length || 0);

    // Determine base position based on mode
    const modeOffset = mode === "login" ? LOGIN_OFFSET : SIGNUP_OFFSET;

    // Target position: Base + Typing Progress
    const targetY = initialY.current + modeOffset + totalChars * 0.0005;

    // Smooth lerp
    paperMeshRef.current.position.y = THREE.MathUtils.lerp(
      paperMeshRef.current.position.y,
      targetY,
      delta * 5
    );

    // Shake animation
    if (groupRef.current) {
      shakeIntensity.current = THREE.MathUtils.lerp(
        shakeIntensity.current,
        0,
        delta * 10
      );
      const shake = shakeIntensity.current * 0.05;
      groupRef.current.position.x = (Math.random() - 0.5) * shake;
      groupRef.current.position.y = -0.5 + (Math.random() - 0.5) * shake;
      groupRef.current.position.z = (Math.random() - 0.5) * shake;
    }
  });

  useEffect(() => {
    console.log("🟦 GLTF Loaded — Scene Graph:");
    gltf.scene.traverse((o) => console.log(o.name));

    // Find baked paper plane
    // Prioritize specific mesh name 'paper_paper_0' as 'paper' might be a Group
    const baked =
      (gltf.scene.getObjectByName("paper_paper_0") as THREE.Mesh | undefined) ||
      (gltf.scene.getObjectByName("paper") as THREE.Mesh | undefined);

    if (baked) {
      paperMeshRef.current = baked;
      if (initialY.current === 0) initialY.current = baked.position.y;
    }

    if (!baked) {
      console.warn("❗ Paper mesh not found");
      return;
    }

    if (!baked.material) {
      console.warn(
        "❗ Paper object found but has no material (likely a Group)"
      );
      return;
    }

    if (texture) {
      // Replace baked material map safely
      if (Array.isArray(baked.material)) {
        baked.material.forEach((m) => {
          (m as THREE.MeshStandardMaterial).map = texture;
          m.needsUpdate = true;
        });
      } else {
        (baked.material as THREE.MeshStandardMaterial).map = texture;
        baked.material.needsUpdate = true;
      }
    }
  }, [gltf, texture]);

  return (
    <group ref={groupRef} scale={0.5} position={[0, -0.5, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}
