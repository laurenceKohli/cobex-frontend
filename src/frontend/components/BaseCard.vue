<script setup>

const props = defineProps({
    info: Object,
})
</script>

<template>
    <div>
        <p>{{ info.nom }}</p>
        <p>{{ info.difficulte }}</p>
        <p>{{ info.nbr_posts }}</p>
    </div>
</template>

<style scoped>
 div{
    border: 2px solid var(--color-primary);
 }
</style>