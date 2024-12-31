<script setup>
import AppNavTrail from './AppNavTrail.vue';
import BaseMap from './BaseMap.vue';
import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
import { currentTrail, endTimer } from '../stores/utils';
import { depart, nbPostesParcourus, stopTimer } from '../stores/courseActuelle';
import { computed, onMounted } from 'vue';
import BaseButton from './BaseButton.vue';

import readQR from '../composables/readQR';
import { useUserMedia } from '../composables/useUserMedia';
import { useUserPosition } from '../composables/useUserPosition';

    const id = currentTrail.value;
    // const id = "676d6993c86c62d76b583a84"
    console.log(id);
    const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
    const {data, error, loading} = parcoursCrud.read(id+'?include="postes"');

    console.log(data. loading, error);
    const nombreDePostes = computed(() => {
        return data.value.postesInclus.length;
    });

    
//temporaire
const scan = () => {
    if (!depart.value) {
        depart.value = true;
    } else if(nbPostesParcourus.value < nombreDePostes.value) {
        nbPostesParcourus.value++;
    } else {
        stopTimer();
        console.log(endTimer.value);
    }
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
    scan();
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
    <div>
        <p>{{ data.nom }}</p>
    </div>

    <div class="camera">
  <video id="video">Le flux vidéo n'est pas disponible.</video>
  <BaseButton icon="photo_camera" @click="handleClick">
        {{ buttonText }}
    </BaseButton>
</div>
<canvas id="canvas"></canvas>
<!-- <div class="output">
  <img id="photo" alt="L'image capturée sera affichée dans cette boîte." />
</div> -->
<p id="monImage"></p>


    <template v-if="depart && nbPostesParcourus < nombreDePostes">
        <BaseMap :points="data.postesInclus" :draggable="true" :width=400 :height=500 />
    </template>
    <template v-else-if="nbPostesParcourus >= nombreDePostes">
        <p>Bravo, vous avez terminé le parcours !</p>
        <p>Scannez vite le QR code de fin pour terminer la course</p>

    </template>
    <template v-else>
        <p>Scanner le QR code du départ pour démarrer la course</p>
    </template> 
    <AppNavTrail
            :nbParcouru="nbPostesParcourus"
            :nbTotal="nombreDePostes"
        />
</template>

<style scoped>
video {
    display: none;
}

video.active {
    display: block;
}
</style>