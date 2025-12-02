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
  img.src = paperImageSrc;

  img.onload = () => {
    ctx.drawImage(img, 0, 0, width, height);
  };

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return { canvas, ctx, texture };
}
