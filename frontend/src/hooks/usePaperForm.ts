import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createPaperCanvas } from "../utils/paperTexture";

type UsePaperFormProps = {
  mode: "login" | "signup";
  email: string;
  password: string;
  language?: string;
  state?: string;
};

export function usePaperForm({
  mode,
  email,
  password,
  language,
  state,
}: UsePaperFormProps) {
  const texRef = useRef<any>(null);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize canvas/texture once
  useEffect(() => {
    // We can reuse the createPaperCanvas utility but we might want to control the canvas element directly for the background
    // For now, let's keep the existing utility logic but adapt it.
    
    // Actually, for the background, we want a visible canvas.
    // For the 3D model, we want a texture.
    // Let's create an offscreen canvas for the texture logic as before.
    
    texRef.current = createPaperCanvas(1500, 2100, "/assets/gov-paper.png");
    const { texture: t } = texRef.current;
    
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = false;
    // Rotate texture for 3D model
    t.center.set(0.5, 0.5);
    t.rotation = (-90 * Math.PI) / 180;

    setTexture(t);
  }, []);

  // Draw function
  useEffect(() => {
    if (!texRef.current) return;

    const { ctx, texture, img, canvas } = texRef.current;

    const draw = () => {
      // 1. Draw to the texture canvas (for 3D model) - NEEDS FLIP
      drawForm(ctx, canvas.width, canvas.height, img, true);
      texture.needsUpdate = true;

      // 2. Draw to the visible background canvas (if attached) - NO FLIP
      if (canvasRef.current) {
        const bgCtx = canvasRef.current.getContext("2d");
        if (bgCtx) {
          canvasRef.current.width = canvas.width;
          canvasRef.current.height = canvas.height;
          drawForm(bgCtx, canvas.width, canvas.height, img, false);
        }
      }
    };

    const drawForm = (
      context: CanvasRenderingContext2D,
      w: number,
      h: number,
      image: HTMLImageElement,
      isMirrored: boolean
    ) => {
      context.save();
      
      if (isMirrored) {
        // Flip horizontally to fix mirrored UVs on 3D model
        context.translate(w, 0);
        context.scale(-1, 1);
      }

      context.clearRect(0, 0, w, h);
      context.drawImage(image, 0, 0, w, h);

      context.fillStyle = "#000";
      context.font = "bold 42px 'Courier New'";
      context.textBaseline = "bottom";

      // LOGIN COORDS
      const loginEmail = { x: 205, y: 715 };
      const loginPass = { x: 206, y: 760 };

      // SIGNUP COORDS
      const signupEmail = { x: 205, y: 1035 };
      const signupPass = { x: 206, y: 1086 };
      const signupLang = { x: 340, y: 1118 };
      const signupState = { x: 365, y: 1155 };

      if (mode === "login") {
        context.fillText(email ?? "", loginEmail.x, loginEmail.y);
        context.fillText(
          "*".repeat(password.length ?? 0),
          loginPass.x,
          loginPass.y
        );
      } else {
        context.fillText(email ?? "", signupEmail.x, signupEmail.y);
        context.fillText(
          "*".repeat(password.length ?? 0),
          signupPass.x,
          signupPass.y
        );

        if (language) context.fillText(language, signupLang.x, signupLang.y);
        if (state) context.fillText(state, signupState.x, signupState.y);
      }
      context.restore();
    };

    if (img.complete) draw();
    else img.onload = draw;
  }, [email, password, language, state, mode]);

  return { texture, canvasRef };
}
