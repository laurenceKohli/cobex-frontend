import { ref } from 'vue';

  const width = 320;
  const height = ref(0);
  const streaming = ref(false);
  
  const video = ref(null);
  const canvas = ref(null);
//   const photo = ref(null);
export  const isVideoActive = ref(false);
  let videoStream = null;

 export function startup() {
    video.value = document.getElementById("video");
    canvas.value = document.getElementById("canvas");
    // photo.value = document.getElementById("photo");
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
    //   canvas.value.setAttribute("width", width);
    //   canvas.value.setAttribute("height", height.value);
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
    //   canvas.value.width = width;
    //   canvas.value.height = height.value;
    //   context.drawImage(video.value, 0, 0, width, height.value);

      const imageData = context.getImageData(0, 0, width, height.value);
      stopVideo();
      return imageData;
    }
    return null;
  }

  function startVideo() {
    isVideoActive.value = true;
    video.value.classList.toggle("active");
    return navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        videoStream = stream;
        video.value.srcObject = stream;
        return video.value.play();
      });
  }

  function stopVideo() {
    if (videoStream) {
      isVideoActive.value = false;
      videoStream.getTracks().forEach(track => track.stop());
      video.value.srcObject = null;
      video.value.classList.toggle("active");
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
