<script setup>
import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
import BaseCard from './BaseCard.vue';
import BaseButton from './BaseButton.vue';
import { compile, computed, ref, watch } from 'vue';
import { currentTrail, currentTrailName } from '../stores/utils';
import { finParcours } from '../stores/courseActuelle';
import { difficultySort } from '../composables/difficultySort';
import SimpleModal from './SimpleModal.vue';

const filterDifficulty = ref('tout');
const showFilterModal = ref(false);

const ville = window.location.href.split('#')[1];
const villeCapitalized = ville.charAt(0).toUpperCase() + ville.slice(1);

const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
const {data, error, loading} = parcoursCrud.readAll();
let nomVille = '';
let link = ref([]);
const sorted = ref("asc");

const toggleSortDifficulty = () => sorted.value === "asc" ? sorted.value = "desc" : sorted.value = "asc";

switch(ville){
    case 'yverdon':
        nomVille = villeCapitalized;
        break;
    default:
        nomVille = villeCapitalized;
        break;
}

watch(link, (newValue) => {
    currentTrail.value = newValue.id;
    currentTrailName.value = newValue.nom;
    window.location.href = `#parcours-detail`;
});

const showModal = () => {
    showFilterModal.value = true;
}

const applyFilters = () => {
    closeModal();
}

const resetFilters = () => {
    filterDifficulty.value = 'tout';
    closeModal();
}

const closeModal = () => {
    showFilterModal.value = false;
}

const parcoursFiltres = computed(() => {
    if (filterDifficulty.value === 'tout') return data.value;
    return data.value.filter((course) => course.difficulte === filterDifficulty.value);
});

const sortedParcours = computed(() => {
    if(sorted.value === "asc"){
        return parcoursFiltres.value?.toSorted(difficultySort);
    } else if(sorted.value === "desc") {
        return parcoursFiltres.value?.toSorted((a,b) => -difficultySort(a, b));
    }
});

const showLoadingModal = computed(() => loading.value);

</script>

<template>
    <div v-if="error" class="error"><h1>Erreur lors du chargement des parcours</h1></div>
    <div v-else>
        <div class="city">
            <h1>{{ nomVille }}</h1>
        </div>
        <div v-if="ville=='yverdon'" class="trailsList">
            <BaseButton @click="toggleSortDifficulty" class="secondary">
                Trier par difficulté {{ sorted === "asc" ? "▴" : "▾" }}
            </BaseButton>
            <BaseButton @click="showModal" class="secondary">
                Filtrer
            </BaseButton>
            <template v-for="parcours in sortedParcours">
                    <BaseCard
                        :info="parcours"
                        @click="link = {id : parcours.id, nom : parcours.nom}"
                    ></BaseCard>
            </template>
        </div>
        <div v-else>
            <p>Cette ville n'a pas encore de parcours.</p>
        </div>

        <div v-if="showFilterModal" class="modalBackdrop" @click="closeModal">
            <div class="modal" @click.stop>
                <div class="modalContent">
                    <div class="modalHeader">
                        <h3>Filtrer par</h3>
                    </div>
                    <div>
                        <div>
                            <h4><strong>Difficulté</strong></h4>
                            <div class="radioGroup">
                                <label>
                                    <input type="radio" name="difficulty" value="tout" v-model="filterDifficulty" />
                                    Tout
                                </label>
                                <label>
                                    <input type="radio" name="difficulty" value="facile" v-model="filterDifficulty" />
                                    Facile
                                </label>
                                <label>
                                    <input type="radio" name="difficulty" value="moyen" v-model="filterDifficulty" />
                                    Moyen
                                </label>
                                <label>
                                    <input type="radio" name="difficulty" value="difficile" v-model="filterDifficulty" />
                                    Difficile
                                </label>
                                <label>
                                    <input type="radio" name="difficulty" value="très difficile" v-model="filterDifficulty" />
                                    Très difficile
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modalFooter">
                        <BaseButton class="Button" @click="resetFilters">RÉINITIALISER</BaseButton>
                        <BaseButton @click="applyFilters">VALIDER</BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <SimpleModal :modalContent="'Parcours en chargement...'" :modalCondition="showLoadingModal"/>
</template>

<style scoped>

.error {
    color: red;
}

div.trailsList {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-large);
    flex-wrap: wrap;
    margin-top: 14px;
}

.modal {
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.modalContent {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

.modalBackdrop {
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #00000080;
    overflow: auto;
}
</style>