<script setup>
import AppNavTrail from './AppNavTrail.vue';
import BaseMap from './BaseMap.vue';
import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
import { currentTrail, endTimer } from '../stores/utils';
import { depart, nbPostesParcourus, stopTimer } from '../stores/courseActuelle';
import { computed } from 'vue';

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
import BaseButton from './BaseButton.vue';

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

</script>

<template>
    <div>
        <p>{{ data.nom }}</p>
    </div>

    <BaseButton icon="photo_camera" @click="scan">
        Scan
    </BaseButton>

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

</style>