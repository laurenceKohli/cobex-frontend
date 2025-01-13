<script setup>
    import AppTabList from './AppTabList.vue';
    import BaseMap from './BaseMap.vue';
    import BaseButton from './BaseButton.vue';
    import BaseTag from './BaseTag.vue';
    import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
    import { currentTrail } from '../stores/utils';
    import { computed, ref, watch, watchEffect } from 'vue';

    const id = currentTrail.value;
    const page = ref(0);
    // const id = "676036d5a79c5402d16502ac";
    console.log(id);
    console.log(page.value);
    const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
    // const {data, error, loading} = parcoursCrud.read(id+'?include="postes"&page='+page.value);
    // console.log(data.value);
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

    const nombreDePostes = computed(() => {
        return data.value?.postesInclus.length;
    });

    const nombreDePages = computed(() => {
        return data.value?.nombrePages;
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
        <p>Nombre de postes : {{ nombreDePostes }}</p>
        <BaseButton @click="start">
            Débuter le parcours
        </BaseButton>
        <template v-if="data.resultatsAct.length > 0">
            <AppTabList :tab="data.resultatsAct"></AppTabList>
            <div class="page-nav" v-if="nombreDePages > 1">
                <BaseButton class="previous" v-if="page > 1" @click="page--">Précédent</BaseButton>
                <p>Page {{ page }} sur {{ nombreDePages }}</p>
                <BaseButton class="next" v-if="page < nombreDePages" @click="page++">Suivant</BaseButton>
            </div>
        </template>
        <template v-else>
            <p>Il n'y a pas encore de résultats pour ce parcours.</p>
        </template>
         <BaseMap :points="data.postesInclus"></BaseMap>
    </div>
</template>

<style scoped>
    .page-nav {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
</style>