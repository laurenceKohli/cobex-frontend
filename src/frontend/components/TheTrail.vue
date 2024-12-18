<script setup>
    import AppTabList from './AppTabList.vue';
    import BaseMap from './BaseMap.vue';
    import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
    import { currentTrail } from '../store/utils';
import { computed } from 'vue';

    const id = currentTrail.value;
    // const id = "676036d5a79c5402d16502ac";
    console.log(id);
    const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
    const {data, error, loading} = parcoursCrud.read(id+'?include="postes"');

    console.log(data. loading, error);
    const nombreDePostes = computed(() => {
        return data.value.postesInclus.length;
    });

</script>

<template>
    <div v-if="error">{{ error }}</div>
    <div v-if="loading">...</div>
    <div id="parcours" v-else>
        <h1>{{ data.nom }}</h1>
        <p>{{ data.difficulte }}</p>
        <p v-if="data.descr">{{ data.descr }}</p>
        <p>Nombre de postes : {{ nombreDePostes }}</p>
        <template v-if="data.resultatsAct.length > 0">
            <AppTabList :tab="data.resultatsAct"></AppTabList>
        </template>
        <template v-else>
            <p>Il n'y a pas encore de résultats pour ce parcours.</p>
        </template>
        
         <BaseMap :points="data.postesInclus"></BaseMap>
    </div>
</template>

<style scoped>

</style>