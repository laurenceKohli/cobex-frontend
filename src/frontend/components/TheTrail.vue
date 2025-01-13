<script setup>
    import AppTabList from './AppTabList.vue';
    import BaseMap from './BaseMap.vue';
    import BaseButton from './BaseButton.vue';
    import BaseTag from './BaseTag.vue';
    import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
    import { currentTrail } from '../stores/utils';
    import { nbPostesTotal, postesActifs } from '../stores/courseActuelle';
    import { computed, ref, watch, watchEffect } from 'vue';

    const id = currentTrail.value;
    const page = ref(0);
    console.log(page.value);

    const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
    const error = ref(false);
    const loading = ref(true);
    const data = ref(null);

    watch(page, () => {
        const {data: d, error: e, loading: l} = parcoursCrud.read(id+'?include="postes"&page='+page.value);
        watch([d, e, l], () => {
            error.value = e.value;
            loading.value = l.value;
            data.value = d.value;
            console.log(data.value);
        });                
    });

   const nombreDePages = computed(() => {
        return data.value?.nombrePages;
   });

    watch(data, (val) => {
        postesActifs.value = val.postesInclus.filter((res) => res.estAccessible);
        nbPostesTotal.value = val ? postesActifs.value.length : 0;
    });

    const start = () => {
        window.location.href='#parcours-actif';
    }
    setTimeout(() => {
        page.value = 1;
    }, 1);
</script>

<template>
    <div v-if="error">{{ error }}</div>
    <div v-if="loading">...</div>
    <div id="parcours" v-else>
        <h1>{{ data.nom }}</h1>
        <BaseTag :tag="data.difficulte"></BaseTag>
        <p v-if="data.descr">{{ data.descr }}</p>
        <p>Nombre de postes : {{ nbPostesTotal }}</p>
        <BaseButton @click="start">
            Débuter le parcours
        </BaseButton>
        <template v-if="data.resultatsAct.length > 0">
            <AppTabList :tab="data.resultatsAct"></AppTabList>
            <div class="page-nav" v-if="nombreDePages > 1">
                <BaseButton class="secondary" v-if="page > 1" @click="page--">Précédent</BaseButton>
                <div v-if="page == 1"></div>
                <p>Page {{ page }} sur {{ nombreDePages }}</p>
                <div v-if="page == nombreDePages"></div>
                <BaseButton class="secondary" v-if="page < nombreDePages" @click="page++">Suivant</BaseButton>
            </div>
        </template>
        <template v-else>
            <p>Il n'y a pas encore de résultats pour ce parcours.</p>
        </template>
         <BaseMap :points="postesActifs"></BaseMap>
    </div>
</template>

<style scoped>
    .page-nav {
        display: flex;
        justify-content: space-around;
        width: 100%;
    }
</style>