<script setup>
const props = defineProps({
    icon: {
        type: String,
        default: '',
    },
    href: {
        type: String,
    }
})
</script>

<template>
     <a :href="href">
        <span class="material-symbols-outlined"> {{ icon }} </span>
        <slot />
    </a>
</template>

<style scoped>
    a {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        width: 100%;
    }

    span {
        display: flex;
        align-self: center;
        justify-content: center;

        width: 60%;
        margin-bottom: 0.1rem;
        padding: 0.2rem;
}

a.active, a.active span {
    color: var(--color-tertiary);
}
</style>