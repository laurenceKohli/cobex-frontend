<script setup>
import BaseButton from './BaseButton.vue'

const displayCity = (ville) => {
    window.location.href='#'+ville;
}

</script>

<template>
    <h1>Parcours fixes de course d'orientation</h1>

    <div id="choixVille">
        <h2>Dans quelle ville voulez-vous faire votre course?</h2>
        <div id="choix">
        <BaseButton @click="displayCity('bex')" class="secondary">
            Bex
        </BaseButton>
        <BaseButton @click="displayCity('stMaurice')" class="secondary">
            St-Maurice
        </BaseButton>
        <BaseButton @click="displayCity('yverdon')">
            Yverdon
        </BaseButton>
    </div>
    </div>
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
video {
    display: none;
}

video.active {
    display: block;
}
</style>