<script setup>
import BaseNavLink from './BaseNavLink.vue';
import { onMounted, watch } from 'vue';

const props = defineProps({
  currentPath: {
    type: String,
    required: true
  }
});

const updateActiveClass = (path) => {
  // D'abord retirer la classe active de tous les liens
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Ajouter la classe active au lien correspondant au chemin actuel
  document
    .querySelector(`nav a[href="${path}"]`)
    ?.classList.add('active');
}

watch(() => props.currentPath, (newPath) => {
  updateActiveClass(newPath);
});

onMounted(() => {
    updateActiveClass(props.currentPath);
})
</script>

<template>
    <nav>
        <BaseNavLink icon="home" href="#home">Accueil</BaseNavLink>
        <BaseNavLink icon="account_circle" href="#profile">Profile</BaseNavLink>
    </nav>
</template>

<style scoped>
nav {
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-secondary);
    padding: 1rem 0rem;

    z-index: 1000;
}
</style>