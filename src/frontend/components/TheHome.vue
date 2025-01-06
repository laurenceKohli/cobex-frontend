<script setup>
import BaseButton from './BaseButton.vue'
import BaseInputLabel from './BaseInputLabel.vue';
import BaseInput from './BaseInput.vue';

import readQR from '../composables/readQR';
import { useUserMedia } from '../composables/useUserMedia';
// import { useUserPosition } from '../composables/useUserPosition';
import { onMounted, computed } from 'vue';

const displayCity = (ville) => {
    window.location.href='#'+ville;
}

const { startup, isVideoActive, toggleCamera } = useUserMedia();
// const { getSwissPosition, position, error } = useUserPosition();

const buttonText = computed(() => {
    console.log(isVideoActive.value);
  return isVideoActive.value ? 'Prendre une photo' : 'Démarrer la caméra';
});

const handleClick = () => {
    console.log('click');
  const imageData = toggleCamera();
 
  if (imageData) {
    const qrResult = readQR(imageData);
    // getSwissPosition();
    // console.log(position.value.x + " " + position.value.y);
    document.getElementById("monImage").innerHTML = qrResult;
  }
};


onMounted(() => {
  startup();
});
</script>

<template>
    <h1>Parcours fixes de course d'orientation</h1>

    <div class="camera">
  <video id="video">Le flux vidéo n'est pas disponible.</video>
  <button @click="handleClick" id="startbutton">{{ buttonText }}</button>
</div>
<canvas id="canvas"></canvas>
<div class="output">
  <img id="photo" alt="L'image capturée sera affichée dans cette boîte." />
</div>
<p id="monImage"></p>

    <div id="choixVille">
        <h2>Dans quelle ville voulez-vous faire votre course?</h2>
        <div id="choix">
        <BaseButton @click="displayCity('bex')" class="secondary">
            Bex
        </BaseButton>
        <BaseButton @click="displayCity('stMaurice')" class="secondary">
            St-Maurice
        </BaseButton>
        <BaseButton @click="displayCity('yverdon')">
            Yverdon
        </BaseButton>
    </div>
    </div>
    <BaseInputLabel>Search</BaseInputLabel>
    <BaseInput placeholder="Search" />
</template>

<style scoped>
#choixVille {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
#choix {
    display: flex;
    justify-content: space-around;
    width: 100%;
}
video {
    display: none;
}

video.active {
    display: block;
}
</style>