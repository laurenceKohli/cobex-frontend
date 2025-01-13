<script setup>
import AppNavTrail from './AppNavTrail.vue';
import BaseMap from './BaseMap.vue';
import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
import { currentTrail } from '../stores/utils';
import { depart, nbPostesParcourus, nbPostesTotal } from '../stores/courseActuelle';
import { computed, onMounted } from 'vue';
import BaseButton from './BaseButton.vue';

import { startup, isVideoActive, toggleCamera } from '../composables/useUserMedia';
import { getPosition, position } from '../composables/useUserPosition';
import { analyseQRCode } from '../composables/userActionsTrail';

    const id = currentTrail.value;
    console.log(id);
    const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
    const {data, error, loading} = parcoursCrud.read(id+'?include="postes"');

    console.log(data, error, loading);
    //A CHANGER
    nbPostesTotal.value = 2;
    console.log(nbPostesTotal.value);

const buttonText = computed(() => {
    console.log(isVideoActive.value);
  return isVideoActive.value ? 'Prendre une photo' : 'Démarrer la caméra';
});

const handleClick = async () => {
    console.log('click');
  const imageData = toggleCamera();
 
  if (imageData) {
    await getPosition();
    const msg = analyseQRCode(imageData, position.value);
    document.getElementById("monImage").innerHTML = msg;
  }
};


onMounted(() => {
  startup();
});

</script>

<template>
    <div>
        <p>{{ data?.nom }}</p>
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


    <template v-if="depart && nbPostesParcourus < nbPostesTotal">
        <BaseMap :points="data.postesInclus" :draggable="true" :width=400 :height=500 />
    </template>
    <template v-else-if="nbPostesParcourus >= nbPostesTotal">
        <p>Bravo, vous avez terminé le parcours !</p>
        <p>Scannez vite le QR code de fin pour terminer la course</p>

    </template>
    <template v-else>
        <p>Scanner le QR code du départ pour démarrer la course</p>
    </template> 
    <AppNavTrail/>
</template>

<style scoped>
#canvas {
    display: none;
}

video {
    display: none;
}

video.active {
    display: block;
}
</style>