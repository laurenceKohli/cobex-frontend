<script setup>
import BaseTag from './BaseTag.vue';

const props = defineProps({
    info: Object,
})
</script>

<template>
    <div class="card">
        <p class="nom">{{ info.nom }}</p>
        <div class="details">
            <BaseTag :tag="info.difficulte"></BaseTag>
            <p>{{ info.nbr_posts }} postes</p>
        </div>
    </div>
</template>

<style scoped>
.card {
    border: var(--color-secondary) var(--border-width-medium) solid;
    border-radius: var(--border-radius);
    padding: var(--spacing-medium);
    width: 100%;
    max-width: 300px;
    box-shadow: var(--box-shadow);
    transition: transform var(--default-transition);
}

.card:hover {
    transform: translateY(-5px);
}

.nom {
    font-size: 1.5rem;
    color: var(--color-primary);
    margin: var(--spacing-medium) 0;
}

.details {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-medium);
}
</style>