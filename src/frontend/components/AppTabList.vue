<script setup>
import BaseTabLine from './BaseTabLine.vue';

const props = defineProps({
  tab: Object,
});

</script>

<template>
  <div id="tableau">
    <template v-for="(ligne, index) in Object.entries(tab)" :key="index">
      <BaseTabLine :info="ligne[1]" :numero="index + 1">
      </BaseTabLine>
    </template>
  </div>
</template>

<style scoped>
#tableau {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-large); /* Espacement entre les lignes */
}
</style>