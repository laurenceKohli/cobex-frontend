<script setup>

const props = defineProps({
    info: Object,
})

const emit = defineEmits(['handle-point'])
</script>

<template>
    <div
        class="card cursor-pointer"
        @click="emit('handle-point', { point: info })"
    >
        <p>{{ info.nom }}</p>
    </div>
</template>

<style scoped>

</style>