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
        <BaseNavLink icon="home" href="/">Accueil</BaseNavLink>
        <BaseNavLink icon="account_circle" href="/#profile">Profil</BaseNavLink>
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
    background-color: aqua;
    padding: 1rem 0rem;

    z-index: 1000;
}

a {
    color:var(--text-color);

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

    border: none;
    border-radius: 1.2rem;
}
</style>