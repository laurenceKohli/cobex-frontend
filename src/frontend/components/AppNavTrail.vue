<script setup>
import { defineProps, ref } from 'vue';
import BaseNavLink from './BaseNavLink.vue';
import { depart, timerValue } from '../stores/courseActuelle'

const props = defineProps({
    nbParcouru: {
        type: Number,
        default: 0,
    },
    nbTotal: {
        type: Number,
        default: 0,
    }
});
console.log(props.nbParcouru, props.nbTotal);

</script>

<template>
     <div class="nav">
        <template v-if="depart && nbParcouru < nbTotal">
            <p>{{ nbParcouru }} / {{ nbTotal }}</p>
            <p>{{ timerValue }}</p>
        </template>
        <template v-else-if="depart && nbParcouru === nbTotal">
            <p>Scannez l'arrivée</p>
            <p>{{ timerValue }}</p>
        </template>
        <template v-else>
            <p>Scannez le départ</p>
        </template>
        <BaseNavLink
            icon="cancel"
            class="quit"
            >Quitter</BaseNavLink>
    </div>
</template>

<style scoped>
.nav {
    background-color: var(--color-primary);

    display: flex;
    position: fixed;
    justify-content: space-between;
    align-items: center;
    ;
    gap: var(--spacing-large);
    /*  bottom: 0; */
    left: 0;
    right: 0;
    padding: 1rem 0rem;
    z-index: 1001;
}
.nav > * {
    white-space: nowrap;
    width: 100%;
    text-align: center;
}

.quit {
    color: var(--color-error);
}
</style>