<script setup>
const props = defineProps({
    message: {
        type: String,
    },
})
</script>

<template>
    <div v-show="message">
        <p>
            {{ message }}
        </p>
    </div>
</template>

<style scoped>
p {
    color: var(--color-error);
}
</style>