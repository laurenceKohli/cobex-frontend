<script setup>
    import AppTabList from './AppTabList.vue';
    import {  useFetchApiCrud } from '../composables/useFetchApiCrud';

    const id = "67598ec8e88b8b4e3c8fb18e";
    console.log(id);
    const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
    const {data, error, loading} = parcoursCrud.read(id);
    console.log(data);

    const nombreDePostes = data.postesInclus.length;

</script>

<template>
    <div id="parcours">
        <h1>{{ data.nom }}</h1>
        <p>{{ data.difficulte }}</p>
        <p>{{ data.descr }}</p>
        <p>Nombre de postes : {{ nombreDePostes }}</p>
        <!-- <AppTabList></AppTabList> -->
    </div>
</template>

<style scoped>

</style>