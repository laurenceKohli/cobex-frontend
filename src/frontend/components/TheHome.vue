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
    padding: 2rem;
    background-color: var(--background-color);
    border-radius: var(--border-radius);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#choix {
    display: flex;
    justify-content: space-around;
    width: 100%;
    flex-wrap: wrap;
    gap: 1rem;
}

h1, h2 {
    text-align: center;
    margin-bottom: var(--spacing-large);
}

@media (max-width: 768px) {
    #choix {
        flex-direction: column;
        align-items: center;
    }
}
</style>