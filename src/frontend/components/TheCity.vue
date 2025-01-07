<script setup>
import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
import BaseCard from './BaseCard.vue';
import BaseButton from './BaseButton.vue';
import { compile, computed, ref, watch } from 'vue';
import { currentTrail } from '../stores/utils';
import { difficultySort } from '../composables/difficultySort';
// import { ref } from 'vue';

const filterDifficulty = ref('tout');
const showFilterModal = ref(false);

 const ville = window.location.href.split('#')[1];
 const villeCapitalized = ville.charAt(0).toUpperCase() + ville.slice(1);

 const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
 const {data, error, loading} = parcoursCrud.readAll();
 //stocker une copie des données pour pouvoir annuler le tri
 //let dataCopy = [...data];
 let nomVille = '';
 let link = ref([]);
 const sorted = ref("asc");

const toggleSortDifficulty = () => sorted.value === "asc" ? sorted.value = "desc" : sorted.value = "asc";
    // if(sorted === "desc"){
    //     parcoursFiltres.value.sort(difficultySort);
    //     sorted = "asc";
    // } else if(sorted === "asc") {
    //     parcoursFiltres.value.sort(difficultySort).reverse();
    //     sorted = "desc";
    // }
// }

 switch(ville){
     case 'yverdon':
        nomVille = villeCapitalized;
        break;
     default:
        nomVille = villeCapitalized;
        break;
 }

 //si link change alors on va sur la page du parcours
watch(link, (newValue) => {
    console.log(newValue);
    currentTrail.value = newValue;
    window.location.href = `#parcours-detail`;
});

const showModal = () => {
    showFilterModal.value = true;
    console.log(showFilterModal.value);
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

watch(filterDifficulty, (newValue) => {
    console.log("diff:"+newValue);
});

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



</script>

<template>
    <div class="city">
        <h1>{{ nomVille }}</h1>
    </div>
    <div v-if="ville=='yverdon'" class="trailsList">
        <BaseButton @click="toggleSortDifficulty" class="secondary">
            Trier par difficulté
        </BaseButton>
        <BaseButton @click="showModal" class="secondary">
            Filtrer
        </BaseButton>
        <template v-for="parcours in sortedParcours">
                <BaseCard
                    :info="parcours"
                    @click="link = parcours.id"
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
    
</template>

<style scoped>
div.trailsList {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-large);
    flex-wrap: wrap;
    margin-top: 14px;
}

.modal {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
}

.modalContent {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
</style>