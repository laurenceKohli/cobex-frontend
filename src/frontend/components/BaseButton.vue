<script setup>
    const props = defineProps({
        type: {
            type: String,
            default: 'button',
        },
        icon: {
            type: String,
        },
    })
</script>

<template>
    <button :type="type">
        <span class="material-symbols-outlined" v-if="icon"> {{ icon }} </span>
        <slot></slot>
    </button>
</template>

<style scoped>
 button{
    display: flex;
    align-items: center;
    height: 2.5rem;
    padding: 0 1rem;
    gap: 0.5rem;
 }
</style>