<script setup>
const props = defineProps({
    info: Object,
})
</script>

<template>
    <div class="ligne">
        <p v-if="info.nom">{{ info.nom }}</p>
        <p v-if="info.temps">{{ info.temps }}</p>
    </div>
</template>

<style scoped>

</style>