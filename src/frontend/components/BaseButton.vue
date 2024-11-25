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
        <span class="material-symbols-rounded"> {{ icon }} </span>
        <slot/>
    </button>
</template>

<style scoped>

</style>