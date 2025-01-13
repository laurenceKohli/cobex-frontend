<script setup>
    import AppTabList from './AppTabList.vue';
    import BaseMap from './BaseMap.vue';
    import BaseButton from './BaseButton.vue';
    import BaseTag from './BaseTag.vue';
    import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
    import { currentTrail } from '../stores/utils';
    import { computed } from 'vue';

    const id = currentTrail.value;
    const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
    const {data, error, loading} = parcoursCrud.read(id+'?include="postes"');

    console.log(data, loading, error);
    const nombreDePostes = computed(() => {
        return data.value.postesInclus.length;
    });

    const start = () => {
        window.location.href='#parcours-actif';
    }

</script>

<template>
    <div v-if="error">{{ error }}</div>
    <div v-if="loading">...</div>
    <div id="parcours" v-else>
        <h1>{{ data.nom }}</h1>
        <BaseTag :tag="data.difficulte"></BaseTag>
        <p v-if="data.descr">{{ data.descr }}</p>
        <p>Nombre de postes : {{ nombreDePostes }}</p>
        <BaseButton @click="start">
            Débuter le parcours
        </BaseButton>
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