<script setup>
import BaseTabLine from './BaseTabLine.vue';

const props = defineProps({
    tab: Object,
})

</script>

<template>
    <div id="tableau">
        <template v-for="ligne in tab">
            <BaseTabLine :info="ligne">
            </BaseTabLine>
        </template>
    </div>
</template>

<style scoped>

</style>