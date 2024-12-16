<script setup>
  import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
  import { ref, watch } from 'vue';
  import { isAuth } from '../stores/user';
  import { username } from '../stores/user';
  import { setDefaultHeaders } from '../composables/useFetchApi';

  const peopleCrud = useFetchApiCrud('utilisateurs', import.meta.env.VITE_API_URL);

  const create = ref(false);
  const name = ref('');
  const password = ref('');
  const email = ref('');
  const usernameExists = ref(false);
  const invalidEmail = ref(false);
  const emailExists = ref(false);

  function toggleCreate() {
    create.value = !create.value;
  }

  function submitCreate(event) {
    event.preventDefault();
    usernameExists.value = false;
    emailExists.value = false;
    invalidEmail.value = false;

    const formData = {nom: name.value, mdp: password.value, mail: email.value};
    const {data, error} = peopleCrud.create(formData);
    watch(data, () => {
      const jwt = data.value.token;
      if (!jwt) {
        console.error('No token in response');
        return;
      }
      setDefaultHeaders({Authorization: 'Bearer ' + jwt});
      isAuth.value = true;
      username.value = name.value;
    });
    watch(error, () => {
      console.error('Error while creating account', error.value);

      usernameExists.value = error.value.data.msg.includes('§§usernameExists§§')
      emailExists.value = error.value.data.msg.includes('§§emailExists§§')
      invalidEmail.value = error.value.data.msg.includes('§§invalidEmail§§')

      console.error('Error while logging in', error.value);
    });
  }

  function submitLogin(event) {
    event.preventDefault();
    const formData = {nom: name.value, mdp: password.value};
    const {data, error} = peopleCrud.fetchApiToRef({url: 'utilisateurs/login', method: 'POST', data: formData}); 
    watch(data, () => {
      const jwt = data.value.token;
      if (!jwt) {
        console.error('No token in response');
        return;
      }
      setDefaultHeaders({Authorization: 'Bearer ' + jwt});
      isAuth.value = true;
      username.value = name.value;
    });
    watch(error, () => {
      console.error('Error while logging in', error.value);
    });
  }
</script>

<template>
  <p v-if="isAuth">Bonjour {{ username }}</p>

  <form v-else-if="create" @submit="submitCreate" method="post">
    <label for="name">Nom</label>
    <input type="text" name="nom" id="name" v-model="name"/>
    <em v-if="usernameExists">ce nom de compte est déjà utilisé</em>
    <br>
    <label for="email">Mail</label>
    <input type="email" name="mail" id="email" v-model="email"/>
    <em v-if="invalidEmail">veuillez entrer un email valide</em>
    <em v-if="emailExists">cet email est déjà utilisé</em>
    <br>
    <label for="password">Mot de passe</label>
    <input type="text" name="mdp" id="password" v-model="password"/>
    <br>
    <button type="submit">Créer un compte</button>
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
  a:hover {
    text-decoration: underline;
  }
</style>