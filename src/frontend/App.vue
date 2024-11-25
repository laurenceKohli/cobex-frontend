<script setup>
import { ref, computed } from 'vue';
import TheHome from './components/TheHome.vue';
import TheList from './components/TheList.vue';
import TheNavBar from './components/TheNavBar.vue';
import TheProfile from './components/TheProfile.vue';

 const routes = {
    '#home': {
      component: TheHome,
      label: 'Accueil',
    },
    '#liste': {
      component: TheList,
      label: 'Liste',
    },
    '#profile': {
      component: TheProfile,
      label: 'Profil',
    },
  }

  const currentPath = ref(window.location.hash);
  updateCurrentPath();

  function updateCurrentPath() {
    const path = window.location.hash;
    currentPath.value = routes[path] ? path : '#home';
  }

  window.addEventListener('hashchange', updateCurrentPath);

  const currentView = computed(() => {
    return routes[currentPath.value].component;
  })
</script>

<template>
    <main>
        <component :is="currentView" />
  </main>
  <TheNavBar :routes="routes" :currentPath="currentPath" />
</template>

<style scoped>

</style>