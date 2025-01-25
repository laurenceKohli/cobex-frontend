<script setup>
import { ref, watch } from 'vue';
import { currentTrail } from '../stores/utils';

const props = defineProps({
    info: Object,
    numero: {
        type : Number,
        optional: true
    }
})

let link = ref([]);
watch(link, (newValue) => {
        currentTrail.value = newValue;
        window.location.href = `#parcours-detail`;
    });
</script>

<template>
    <div class="ligne">
        <p class="numero" v-if="numero">{{ numero }}</p>
        <p class="nom" v-if="info.user">{{ info.user }}</p>
        <p class="nom" v-if="info.parcours?.nom" @click="link = info.parcours.id">{{ info.parcours.nom }}</p>
        <p class="temps" v-if="info.temps">{{ info.temps }}</p>
    </div>
</template>

<style scoped>
/**
 * ceci est la ligne d'un tableau
 */
.ligne{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-small) var(--spacing-medium);
    border-radius: var(--border-radius);
    font-weight: bold;
    text-align: center;
    gap : var(--spacing-large)
}

.ligne:nth-child(3n) p{
    border: var(--color-primary) solid var(--border-width-medium);
}

.ligne:nth-child(3n + 1) p {
    border: var(--color-secondary) solid var(--border-width-medium);
}

.ligne:nth-child(3n + 2) p {
    border: var(--color-tertiary) solid var(--border-width-medium);
}

.ligne p {
    margin: 0;
    font-size: 1.1rem;
    padding: var(--spacing-medium) var(--spacing-small);
    border-radius: var(--border-radius); /* Coins légèrement arrondis */
}

.numero {
    flex: 0 0 10%; /*Taille fixe pour la position */
}

.nom {
    flex: 1; /* La colonne nom prend l'espace restant */
    text-transform: uppercase;
}

.temps {
    flex: 0 0 15%; /* Taille fixe pour les points */
}
</style>