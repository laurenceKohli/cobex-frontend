<script setup>
import BaseButton from './BaseButton.vue'
import BaseInputLabel from './BaseInputLabel.vue';
import BaseInput from './BaseInput.vue';

const displayCity = (ville) => {
    window.location.href='#'+ville;
}
</script>

<template>
    <h1>Parcours fixes de course d'orientation</h1>

    <div id="choixVille">
        <h2>Dans quelle ville voulez-vous faire votre course?</h2>
        <div id="choix">
        <BaseButton @click="displayCity('bex')">
            Bex
        </BaseButton>
        <BaseButton @click="displayCity('stMaurice')">
            St-Maurice
        </BaseButton>
    </div>
    </div>
    <BaseInputLabel>Search</BaseInputLabel>
    <BaseInput placeholder="Search" />
</template>

<style scoped>
#choixVille {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
#choix {
    display: flex;
    justify-content: space-around;
    width: 100%;
}
</style>