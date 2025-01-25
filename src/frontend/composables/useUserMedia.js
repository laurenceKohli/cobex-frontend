import { ref } from 'vue';

const width = 320;
const height = ref(0);
const streaming = ref(false);
export const isVideoActive = ref(false);
const video = ref(null);
const canvas = ref(null);
let videoStream = null;

export function startup(videoElement, canvasElement) {
  if (!videoElement || !canvasElement) {
    console.error('Elements video/canvas non trouvés');
    return;
  }
  
  video.value = videoElement;
  canvas.value = canvasElement;
  video.value.addEventListener("canplay", handleCanPlay, false);
  clearphoto();
}

function handleCanPlay(ev) {
  if (!streaming.value) {
    height.value = video.value.videoHeight / (video.value.videoWidth / width);
    if (isNaN(height.value)) {
      height.value = width / (4 / 3);
    }
    video.value.setAttribute("width", width);
    video.value.setAttribute("height", height.value);
    streaming.value = true;
  }
}

function clearphoto() {
  const context = canvas.value.getContext("2d");
  const data = canvas.value.toDataURL("image/png");
}

function takepicture() {
  const context = canvas.value.getContext("2d");
  if (width && height.value) {
    const imageData = context.getImageData(0, 0, width, height.value);
    stopVideo();
    return imageData;
  }
  return null;
}

export function startVideo() {
  if (!video.value) {
    console.error('Element video non trouvé');
    return Promise.reject(new Error('Video element not found'));
  }
  
  isVideoActive.value = true;
  
  return navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" }, audio: false })
    .then((stream) => {
      videoStream = stream;
      video.value.srcObject = stream;
      return video.value.play();
    })
    .catch(error => {
      isVideoActive.value = false;
      console.error('Erreur accès caméra:', error);
      throw error;
    });
}

export function stopVideo() {
  if (!video.value) return;
  
  if (videoStream) {
    isVideoActive.value = false;
    videoStream.getTracks().forEach(track => track.stop());
    video.value.srcObject = null;
    video.value.classList?.toggle("active");
  }
}

export function toggleCamera() {
  if (isVideoActive.value) {
    const imageData = takepicture();
    return imageData;
  } else {
    startVideo();
    return null;
  }
}