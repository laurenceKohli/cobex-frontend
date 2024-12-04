<script setup>
    import BaseButton from './BaseButton.vue';
    import { ref } from 'vue';
    showFilterModal = ref(true);
    applyFilters = () => {
        closeModal();
    }

    resetFilters = () => {
        filterDifficulty.value = 'tout';
        closeModal();
    }

    closeModal = () => {
        showFilterModal.value = false;
    }
</script>

<template>
    
    <div v-if="showFilterModal" class="modalBackdrop" @click="closeModal">
        <div class="modal" @click.stop>
            <div class="modalHeader">
                <h3>Filtrer par</h3>
            </div>
            <div class="modalContent">
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
                            <input type="radio" name="difficulty" value="tres difficile" v-model="filterDifficulty" />
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

</template>

<style scoped>
    .modalBackdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        z-index: 1000;
    }

    .modalHeader {
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #7d7d7d;
        padding-bottom: 8px;
        margin-bottom: 16px;
    }

    .modal {
        font-family: "Inter", sans-serif;
        background: #FAFAFA;
        width: 100%;
        max-width: 400px;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        padding: 16px;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
    }

    .modalContent {
        display: flex;
        flex-direction: column;
        align-items: left;
        gap: 16px;
    }

    .modalFooter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 16px;
        border-top: 1px solid #F0F0F0;
        margin-top: 16px;
    }

    .radioGroup {
        font-family: "Inter", sans-serif;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .radioGroupHorizontal {
        font-family: "Inter", sans-serif;
        display: flex;
        flex-direction: row;
        gap: 16px;
    }
</style>