<script setup>
  import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
  import { ref } from 'vue';
  import { isAuth } from '../stores/user';
  import { username } from '../stores/user';
  import { setDefaultHeaders } from '../composables/useFetchApi';

  const peopleCrud = useFetchApiCrud('utilisateurs', import.meta.env.VITE_API_URL);

  const create = ref(false);
  const name = ref('');
  const password = ref('');
  const email = ref('');

  function toggleCreate() {
    create.value = !create.value;
  }

  function submitCreate(event) {
    event.preventDefault();
    const formData = {nom: name.value, mdp: password.value, mail: email.value};
    const {data, error} = peopleCrud.create(formData);
    watch(data, () => {
        jwt = data.token;
        if (jwt) {
            setDefaultHeaders({Authorization: 'Bearer ' + jwt});
        }
        isAuth.value = true;
        username.value = name.value;
    });
  }

  function submitLogin(event) {
    event.preventDefault();
    const formData = {nom: name.value, mdp: password.value};
    const {data, error} = peopleCrud.fetchApiToRef({url: 'utilisateurs/login', method: 'POST', data: formData}); 
    watch(data, () => {
        const jwt = data.token;
        if (jwt) {
            setDefaultHeaders({Authorization: 'Bearer ' + jwt});
        }
        isAuth.value = true;
        username.value = name.value;
    });
  }
</script>

<template>
  <p v-if="isAuth">Bonjour {{ username }}</p>

  <form v-else-if="create" @submit="submitCreate" method="post">
    <label for="name">Nom</label>
    <input type="text" name="nom" id="name" v-model="name"/>
    <br> 
    <label for="email">Mail</label>
    <input type="email" name="mail" id="email" v-model="email"/>
    <br>
    <label for="password">Mot de passe</label>
    <input type="text" name="mdp" id="password" v-model="password"/>
    <br>
    <button type="submit">Se connecter</button>
    <br>
    <a @click="toggleCreate">J'ai déjà un compte</a>
  </form>
  
  <form v-else @submit="submitLogin" method="post">
    <label for="name">Nom</label>
    <input type="text" name="nom" id="name" v-model="name"/>
    <br>
    <label for="password">Mot de passe</label>
    <input type="text" name="mdp" id="password" v-model="password"/>
    <br>
    <button type="submit">Se connecter</button>
    <br>
    <a @click="toggleCreate">Je n'ai pas de compte</a>
  </form>
</template>

<style scoped>
  
</style>