<script setup>
 import {  useFetchApiCrud } from '../composables/useFetchApiCrud';

 const peopleCrud = useFetchApiCrud('utilisateurs', import.meta.env.VITE_API_URL);
 const {data, error, loading} = peopleCrud.readAll();
 console.log(data);

</script>

<template>
    <p>Hello {{ data }}</p>
</template>

<style scoped>

</style>