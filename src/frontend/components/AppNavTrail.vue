<script setup>
import BaseNavLink from './BaseNavLink.vue';
import { depart, timerValue, nbPostesParcourus, nbPostesTotal } from '../stores/courseActuelle'
import { quitTrail } from '../composables/userActionsTrail'

</script>

<template>
     <div class="nav">
        <template v-if="depart && nbPostesParcourus < nbPostesTotal">
            <p>{{ nbPostesParcourus }} / {{ nbPostesTotal }}</p>
            <p>{{ timerValue }}</p>
        </template>
        <template v-else-if="depart && nbPostesParcourus === nbPostesTotal">
            <p>Scannez l'arrivée</p>
            <p>{{ timerValue }}</p>
        </template>
        <template v-else>
            <p>Scannez le départ</p>
        </template>
        <BaseNavLink
            icon="cancel"
            class="quit"
            href="#home"
            @click="quitTrail()"
            >Quitter</BaseNavLink>
    </div>
</template>

<style scoped>
.nav {
    background-color: var(--color-secondary);

    display: flex;
    position: fixed;
    justify-content: space-between;
    align-items: center;
    ;
    gap: var(--spacing-large);
    bottom: 0;
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