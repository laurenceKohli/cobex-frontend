<script setup>
import AppTabList from './AppTabList.vue';
import BaseMap from './BaseMap.vue';
import BaseButton from './BaseButton.vue';
import BaseTag from './BaseTag.vue';
import { useFetchApiCrud } from '../composables/useFetchApiCrud';
import { currentTrail } from '../stores/utils';
import { nbPostesTotal, postesActifs } from '../stores/courseActuelle';
import { computed, ref, watch } from 'vue';

const id = currentTrail.value;
const page = ref(0);
const pageLimit = ref(0);

const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
const error = ref(false);
const loading = ref(true);
const data = ref(null);

watch(page, () => {
    const { data: d, error: e, loading: l } = parcoursCrud.read(id + '?include="postes"&page=' + page.value);
    watch([d, e, l], () => {
        error.value = e.value;
        loading.value = l.value;
        data.value = d.value;
        if (pageLimit.value === 0 && data.value.resultatsAct.length !== 0 && page.value === 1) {
            pageLimit.value = data.value.resultatsAct.length;
        }
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
    window.location.href = '#parcours-actif';
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
        <div id="details">
            <BaseTag :tag="data.difficulte"></BaseTag>
            <p>Nombre de postes : {{ nbPostesTotal }}</p>
        </div>
        <p v-if="data.descr">{{ data.descr }}</p>
        <BaseButton @click="start">
            Débuter le parcours
        </BaseButton>
        <template v-if="data.resultatsAct.length > 0">
            <AppTabList :tab="data.resultatsAct" :pageData="{ page, pageLimit }"></AppTabList>
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
#parcours {
    padding: var(--spacing-large);
    max-width: 800px;
    margin: auto;
    text-align: center;
}

#details {
    display: flex;
    justify-content: center;
    gap: var(--spacing-medium);
    margin-bottom: var(--spacing-medium);
    text-align: center;
}

.page-nav {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: var(--spacing-large) 0;
}

h1 {
    margin-bottom: var(--spacing-medium);
}

p {
    margin-bottom: var(--spacing-small);
}

@media (max-width: 768px) {
    #parcours {
        padding: var(--spacing-medium);
        padding-bottom: var(--spacing-large);
    }

    .page-nav {
        flex-direction: column;
        gap: var(--spacing-small);
    }
}
</style>