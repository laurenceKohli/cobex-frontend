<script setup>
const props = defineProps({
    icon: {
        type: String,
        default: '',
    },
    href: {
        type: String,
        default: '',
    },
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
        color: inherit;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>