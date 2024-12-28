<script setup>
 import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
import BaseCard from './BaseCard.vue';
import { ref, watch } from 'vue';
import { currentTrail } from '../stores/utils';

 const ville = window.location.href.split('#')[1];
 const villeCapitalized = ville.charAt(0).toUpperCase() + ville.slice(1);

 const parcoursCrud = useFetchApiCrud('parcours', import.meta.env.VITE_API_URL);
 const {data, error, loading} = parcoursCrud.readAll();
 let nomVille = '';
 let link = ref([]);

 switch(ville){
     case 'yverdon':
        nomVille = villeCapitalized;
        break;
     default:
        nomVille = villeCapitalized;
        break;
 }
 console.log(ville);

 //si link change alors on va sur la page du parcours
    watch(link, (newValue) => {
        console.log(newValue);
        currentTrail.value = newValue;
        window.location.href = `#parcours-detail`;
    });
</script>

<template>
    <div class="city">
        <h1>{{ nomVille }}</h1>
        <p>There are many cities in the world, but this one is mine.</p>
    </div>
    <div v-if="ville=='yverdon'" class="trailsList">
        <template v-for="parcours in data">
                <BaseCard
                    :info="parcours"
                    @click="link = parcours.id"
                ></BaseCard>
        </template>
    </div>
    <div v-else>
        <p>Cette ville n'a pas encore de parcours.</p>
    </div>
    
</template>

<style scoped>

</style>