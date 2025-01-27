<script setup>
import AppNavTrail from './AppNavTrail.vue';
import BaseMap from './BaseMap.vue';
import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
import { computed, onMounted, ref, nextTick, watch } from 'vue';

import { currentTrail, currentTrailName } from '../stores/utils';
import { depart, nbPostesParcourus, nbPostesTotal, postesActifs, parcoursSaved, failedSave, stopTimer } from '../stores/courseActuelle';
import BaseButton from './BaseButton.vue';
import SimpleModal from './SimpleModal.vue';

import { startup, isVideoActive, toggleCamera, startVideo, stopVideo } from '../composables/useUserMedia';
import { getPosition, position } from '../composables/useUserPosition';
import { analyseQRCode } from '../composables/userActionsTrail';

    const id = currentTrail.value;
    const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
    const {data, error, loading} = parcoursCrud.read(id+'?include="postes"');

const buttonText = computed(() => {
  return isVideoActive.value ? 'Prendre une photo' : 'Démarrer la caméra';
});

const handleHashChange = () => {
  depart.value = false;
  nbPostesParcourus.value = 0;
  stopTimer();
}

window.onhashchange = handleHashChange;

const handleClick = async () => {
  const imageData = toggleCamera();
  
  if (nbPostesParcourus.value >= nbPostesTotal.value && !isVideoActive.value) {
    showCamera.value = false;
  }

  if (imageData) {
    await getPosition();
    const msg = analyseQRCode(imageData, position.value);
    document.getElementById("monImage").innerHTML = msg;
  }
};

const videoRef = ref(null);
const canvasRef = ref(null);

const showCamera = ref(false);

//ferme n'importe quelle modale ouverte (les deux modales sont incompatibles)
const handleClose = () => {
  parcoursSaved.value = false;
  failedSave.value = false;
};

const showCameraItem = async () => {
  showCamera.value = !showCamera.value;
  if (showCamera.value) {
    await nextTick();
    await startup(videoRef.value, canvasRef.value);
    await startVideo(); // Démarrer directement la caméra
  } else {
    stopVideo(); // Arrêter la caméra quand on ferme le modal
  }
}
</script>

<template>
    <div>
        <h2>{{ data?.nom }}</h2>
    </div>

    <!-- Modal Camera -->
    <div class="camera-modal" v-if="showCamera">
        <div class="modal-content">
            <div class="modal-header">
                <button class="close-btn" @click="showCameraItem">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="camera">
                <video ref="videoRef" id="video">Le flux vidéo n'est pas disponible.</video>
                <BaseButton icon="photo_camera" @click="handleClick">
                    {{ buttonText }}
                </BaseButton>
            </div>
            <canvas ref="canvasRef" id="canvas"></canvas>
            <p id="monImage"></p>
        </div>
    </div>

    <template v-if="depart && nbPostesParcourus < nbPostesTotal">
        <BaseMap :points="postesActifs" :draggable="true" :width=600 :height=500 />
        <BaseButton @click="showCameraItem" icon="qr_code_scanner">Scanner QR Code</BaseButton>
    </template>
    <template v-else-if="nbPostesParcourus >= nbPostesTotal">
        <p>Bravo, vous avez terminé le parcours !</p>
        <p>Scannez vite le QR code de fin pour terminer la course</p>
        <BaseButton @click="showCameraItem" icon="qr_code_scanner">Scanner QR Code</BaseButton>
    </template>
    <template v-else>
        <p>Scanner le QR code du départ pour démarrer la course</p>
        <BaseButton @click="showCameraItem" icon="qr_code_scanner">Scanner QR Code</BaseButton>
    </template> 
    <AppNavTrail/>
    <SimpleModal :modalContent="'Parcours sauvegardé avec succès.'" :modalCondition="parcoursSaved" :modalCloser="true" @close="handleClose"/>
    <SimpleModal :modalContent="'Échec de la sauvegarde du parcours'" :modalCondition="failedSave" :modalCloser="true" @close="handleClose"/>
</template>

<style scoped>
#canvas {
    display: none;
}

.camera-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
}

.modal-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
}

.close-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
}

video {
    width: 100%;
    max-width: 100%;
    display: block;
    margin-bottom: 1rem;
}

p {
    text-align: center;
    color: var(--text-color);
    margin-top: var(--spacing-medium);
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
    }
}
</style>