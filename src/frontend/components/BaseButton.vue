<script setup>
    const props = defineProps({
        type: {
            type: String,
            default: 'button',
        },
        icon: {
            type: String,
        },
        class: {
            type: String,
            default: '',
        }
    })
</script>

<template>
    <button :type="type" :class="class">
        <span class="material-symbols-outlined" v-if="icon"> {{ icon }} </span>
        <slot></slot>
    </button>
</template>

<style scoped>
 button{
    display: flex;
    align-items: center;
    height: 2.5rem;
    gap: var(--spacing-small);
    background-color: var(--color-primary);
    border-radius: var(--border-radius);
    border: none;
    padding: var(--spacing-medium);
 }

    button:hover{
        color: var(--color-secondary);
    }

    button:focus{
        color: var(--color-secondary);
    }

.secondary{
    border: var(--color-primary) solid var(--border-width-small);
    background-color: transparent;
}

.cancel{
    border: var(--color-error) solid var(--border-width-small);
    background-color: transparent;
}

.delete{
    background-color: var(--color-error);
}
</style>