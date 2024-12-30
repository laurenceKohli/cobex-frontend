import { ref } from 'vue';

export function useUserMedia() {
  const width = 320;
  const height = ref(0);
  const streaming = ref(false);
  
  const video = ref(null);
  const canvas = ref(null);
  const photo = ref(null);
  const isVideoActive = ref(false);
  let videoStream = null;

  function startup() {
    video.value = document.getElementById("video");
    canvas.value = document.getElementById("canvas");
    photo.value = document.getElementById("photo");
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
      canvas.value.setAttribute("width", width);
      canvas.value.setAttribute("height", height.value);
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
      canvas.value.width = width;
      canvas.value.height = height.value;
      context.drawImage(video.value, 0, 0, width, height.value);

      const imageData = context.getImageData(0, 0, width, height.value);
      stopVideo();
      return imageData;
    }
    return null;
  }

  function startVideo() {
    isVideoActive.value = true;
    return navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        videoStream = stream;
        video.value.srcObject = stream;
        video.value.classList.toggle("active");
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

  function toggleCamera() {
    if (isVideoActive.value) {
      const imageData = takepicture();
      return imageData;
    } else {
      startVideo();
      return null;
    }
  }

  return {
    startup,
    takepicture,
    clearphoto,
    width,
    height,
    isVideoActive,
    startVideo,
    stopVideo,
    toggleCamera
  };
}

export function useUserPosition(){
    const position = ref(null);
    const error = ref(null);
    
    // Demande au navigateur de détecter la position actuelle de l'utilisateur et retourne une Promise
    // et retourne un objet {lat: x, long: y} en format WGS84 
    function getPosition() {
        return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
            position.value = {
                lat: pos.coords.latitude,
                long: pos.coords.longitude
            };
            resolve(pos);
            },
            (err) => {
            error.value = err;
            reject(err);
            }
        );
        });
    }

    function getSwissPosition(){
        return getPosition().then((pos) => {
            console.log(pos);
            const swissPos = convertCoordonate(pos.coords.latitude, pos.coords.longitude);
            position.value = {
                x: swissPos.x,
                y: swissPos.y
            };
        });
    }
    
    return {
        position,
        error,
        getSwissPosition
    };
}

function convertCoordonate(lat, long){
    //convert to sexagesimal
    const lat2 = (convertDecimalToSexagesimal(lat)- 169028.66)/10000; 
    const long2 = (convertDecimalToSexagesimal(long)- 26782.5)/10000;
    console.log(lat2, long2);
    //convert to CH1903
    const x = 200147.07 + 308807.95 * lat2 + 3745.25 * lat2 * lat2 + 76.63 * long2 * long2 - 194.56 * lat2 * lat2 * long2 + 119.79 * long2 * long2 * long2;
    const y = 600072.37 + 211455.93 * long2 - 10938.51 * lat2 * long2 - 0.36 * long2 * lat2 * lat2 - 44.54 * long2 * long2 * long2;
    return {x, y}; 
}

function convertDecimalToSexagesimal(decimal){
    console.log(decimal);
    const deg = Math.floor(decimal);
    console.log(deg);
    const min = Math.floor((decimal - deg) * 60);
    const sec =((decimal - deg - min / 60) * 3600);
    const nombre = deg +"°"+ min +"'"+ sec + "''";
    console.log(nombre);
    return {nombre};
}