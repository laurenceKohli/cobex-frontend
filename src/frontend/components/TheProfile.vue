<script setup>
  import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
  import { ref, watch } from 'vue';
  import { resultats } from '../stores/resultats';
  import { isAuth, username, userId } from '../stores/user';
  import { setDefaultHeaders } from '../composables/useFetchApi';

  import AppTabList from './AppTabList.vue';
  import BaseInput from './BaseInput.vue';
  import BaseInputLabel from './BaseInputLabel.vue';
  import BaseInputError from './BaseInputError.vue';
  import BaseButton from './BaseButton.vue';

  const peopleCrud = useFetchApiCrud('utilisateurs', import.meta.env.VITE_API_URL);
  const resultCrud = useFetchApiCrud('resultats', import.meta.env.VITE_API_URL);

  const create = ref(false);
  const name = ref('');
  const password = ref('');
  const email = ref('');
  const usernameExists = ref(false);
  const invalidEmail = ref(false);
  const emailExists = ref(false);

  const resultData = ref([]);

  function fetchResults() {
    const {data, error} = resultCrud.fetchApiToRef({url: `resultats?utilisateurs=${userId.value}&include=parcours`, method: 'GET'});
    watch(data, () => {
      resultData.value = data.value;
      console.log(resultData.value);
    });
    watch(error, () => {
      console.error('Error while fetching results', error.value);
    });
  }

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
      username.value = data.value.utilisateur.nom;
      userId.value = data.value.utilisateur.id;
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
      fetchResults();
      setDefaultHeaders({Authorization: 'Bearer ' + jwt});
      isAuth.value = true;
      username.value = data.value.utilisateur.nom;
      userId.value = data.value.utilisateur.id;
    });
    watch(error, () => {
      console.error('Error while logging in', error.value);
    });
  }
</script>

<template>
  <div v-if="isAuth">
    <p>Bonjour {{ username }}</p>
    <h2>Résultats effectués</h2>
    <template v-if="resultData.length > 0">
      <AppTabList :tab="resultData"></AppTabList>
    </template>
  </div>

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