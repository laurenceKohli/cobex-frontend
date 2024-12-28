<script setup>
import BaseNavLink from './BaseNavLink.vue';
import { onMounted } from 'vue';

const addActiveClass = (path) => {
    document
        .querySelector(`nav a[href="/${path}"]`)
        ?.querySelector('span')
        ?.classList.add('active')
}

onMounted(() => {
    const url = window.location.pathname.split('/')
    if (url.some((el) => el === 'home') || url.every((el) => el === '')) {
        addActiveClass('')
    }
    if (
        url.some((el) => el === 'profile') ||
        url.some((el) => el === 'about') ||
        url.some((el) => el === 'register') ||
        url.some((el) => el === 'login')
    ) {
        addActiveClass('profile')
    }
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