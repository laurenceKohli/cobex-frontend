<script setup>
// defini un props pour le composant avec tag qui est optionnel
const props = defineProps({
    tag: {
        type: String,
        default: () => 'facile',
    }
})

</script>

<template>
    <div class="tag" :class="tag">
        {{ tag }}
    </div>
</template>

<style scoped>
.tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    padding: 0.2rem 0.8rem;
    border-radius: 0.35rem;
}

.facile {
    background-color: var(--color-facile);
}

.moyen {
    background-color: var(--color-moyen);
}

.difficile {
    background-color: var(--color-difficile);
}
</style>