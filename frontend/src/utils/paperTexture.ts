// frontend/src/utils/paperTexture.ts
import * as THREE from "three";

export function createPaperCanvas(
  width = 2048,
  height = 2048,
  paperImageSrc = "/assets/gov-paper.jpg"
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  const img = new Image();
  img.crossOrigin = "anonymous"; // safe for local dev
  img.src = paperImageSrc;

  // draw only after image loads
  img.onload = () => {
    try {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
    } catch (e) {
      // in some edge cases (CORS) drawImage can fail — log it
      console.error("Error drawing paper image on canvas:", e);
    }
  };

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.needsUpdate = true;

  // return img so caller can redraw it on every update
  return { canvas, ctx, texture, img };
}
