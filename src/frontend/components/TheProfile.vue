<script setup>
  import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
  import { ref, watch } from 'vue';
  import { isAuth, username } from '../stores/user';
  import { setDefaultHeaders } from '../composables/useFetchApi';

  import BaseInput from './BaseInput.vue';
  import BaseInputLabel from './BaseInputLabel.vue';
  import BaseInputError from './BaseInputError.vue';
  import BaseButton from './BaseButton.vue';

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
    <div>
      <div class="input">
        <BaseInputLabel for="name">Nom</BaseInputLabel>
        <BaseInput type="text" name="nom" id="name" v-model="name"/>
      </div>
      <BaseInputError v-if="usernameExists" message="ce nom de compte est déjà utilisé"/>
    </div>
    <div>
      <div class="input">
        <BaseInputLabel for="email">Mail</BaseInputLabel>
        <BaseInput type="email" name="mail" id="email" v-model="email"/>
      </div>
        <BaseInputError v-if="invalidEmail" message="veuillez entrer un email valide"/>
        <BaseInputError v-if="emailExists" message="cet email est déjà utilisé"/>
      </div>
    <div class="input">
      <BaseInputLabel for="password">Mot de passe</BaseInputLabel>
      <BaseInput type="text" name="mdp" id="password" v-model="password"/>
    </div>
    <div class="choix">
      <BaseButton type="submit">Créer un compte</BaseButton>
      <a @click="toggleCreate">J'ai déjà un compte</a>
    </div>
  </form>
  
  <form v-else @submit="submitLogin" method="post">
    <div class="input">
      <BaseInputLabel for="name">Nom</BaseInputLabel>
      <BaseInput type="text" name="nom" id="name" v-model="name"/>
    </div>
    <div class="input">
      <BaseInputLabel for="password">Mot de passe</BaseInputLabel>
      <BaseInput type="text" name="mdp" id="password" v-model="password"/>
    </div>
    <div class="choix">
      <BaseButton type="submit">Se connecter</BaseButton>
      <a @click="toggleCreate">Je n'ai pas de compte</a>
    </div>
  </form>
</template>

<style scoped>
  a:hover {
    text-decoration: underline;
  }

  form>div {
    margin-bottom: var(--spacing-large);
  }

  div.input{
    display: flex;
    align-items: center;
    gap: var(--spacing-medium);
  }

  .choix {
    display: flex;
    align-items: center;
    gap: var(--spacing-medium);
  }
</style>