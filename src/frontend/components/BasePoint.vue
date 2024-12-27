<script setup>
    import { onMounted } from 'vue';

 const props = defineProps({
     point: String
 })

 onMounted(() => {
     console.log(point);
 })

</script>

<template>
    <div id="point">
        <div class="point" :style="{left: point.x + 'px', top: point.y + 'px'}"></div>
    </div>
</template>

<style scoped>

</style>