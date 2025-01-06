<script setup>
import { ref } from 'vue';

const props = defineProps({
    point: String,
    isActive: Boolean,
})

const active = ref('');
if (props.isActive) {
    active.value = 'active';
}

</script>

<template>
    <div id="point">
        <div class="point" :style="{ left: point.x + 'px', top: point.y + 'px' }">
            <span class="material-symbols-outlined" :class="active">location_on</span>
        </div>
    </div>
</template>

<style scoped>
span {
    font-size: 2rem;
    color: var(--color-facile);
}

.active {
    color: var(--color-primary);
}
</style>