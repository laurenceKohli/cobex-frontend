import jsQR from "jsqr";

export default function readQR(imageData) {
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  return code ? code.data : "aucun QR code détecté";
}