<script setup>
import { useFetchApiCrud } from '../composables/useFetchApiCrud';
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
const { data, error, loading } = parcoursCrud.readAll();

let nomVille = '';
let link = ref([]);
const sorted = ref("asc");

const toggleSortDifficulty = () => sorted.value === "asc" ? sorted.value = "desc" : sorted.value = "asc";

switch (ville) {
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
    if (sorted.value === "asc") {
        return parcoursFiltres.value?.toSorted(difficultySort);
    } else if (sorted.value === "desc") {
        return parcoursFiltres.value?.toSorted((a, b) => -difficultySort(a, b));
    }
});

const showLoadingModal = computed(() => loading.value);
</script>

<template>
    <div v-if="error" class="error">
        <h1>Erreur lors du chargement des parcours</h1>
    </div>
    <div v-else>
        <div class="city">
            <h1>{{ nomVille }}</h1>
        </div>
        <div v-if="ville == 'yverdon'" class="trailsList">
            <div class="buttons">
                <BaseButton @click="toggleSortDifficulty" class="secondary">
                    Trier par difficulté {{ sorted === "asc" ? "▴" : "▾" }}
                </BaseButton>
                <BaseButton @click="showModal" class="secondary">
                    Filtrer
                </BaseButton>
            </div>
            <div id="trails">
                <template v-for="parcours in sortedParcours">
                    <BaseCard :info="parcours" @click="link = { id: parcours.id, nom: parcours.nom }"></BaseCard>
                </template>
            </div>
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
                                    <input type="radio" name="difficulty" value="difficile"
                                        v-model="filterDifficulty" />
                                    Difficile
                                </label>
                                <label>
                                    <input type="radio" name="difficulty" value="très difficile"
                                        v-model="filterDifficulty" />
                                    Très difficile
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modalFooter">
                    <BaseButton class="secondary" @click="resetFilters">Réinitialiser</BaseButton>
                    <BaseButton @click="applyFilters">Valider</BaseButton>
                </div>
            </div>
        </div>
    </div>
    <SimpleModal :modalContent="'Parcours en chargement...'" :modalCondition="showLoadingModal" />
</template>

<style scoped>
.city {
    text-align: center;
    margin-bottom: var(--spacing-large);
}

.trailsList {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-large);
    margin-top: 14px;
}

.buttons {
    display: flex;
    justify-content: center;
    gap: var(--spacing-medium);
    margin-bottom: var(--spacing-large);
}

.error {
    color: var(--color-error);
}

#trails {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-large);
    flex-wrap: wrap;
    justify-content: center;
}

.modalBackdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background-color: var(--background-color-light);
    padding: var(--spacing-large);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    width: 90%;
    max-width: 500px;
}

.modalHeader {
    margin-bottom: var(--spacing-medium);
}

.radioGroup {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-small);
}

.modalFooter {
    display: flex;
    justify-content: space-between;
    margin-top: var(--spacing-large);
}

@media (max-width: 768px) {
    .trailsList {
        align-items: center;
    }

    #trails {
        flex-direction: column;
        align-items: center;
    }

    .modal {
        width: 95%;
    }
}
</style>