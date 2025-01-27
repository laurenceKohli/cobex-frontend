<script setup>

import {  useFetchApiCrud } from '../composables/useFetchApiCrud';
import { computed, ref, watch } from 'vue';
import { isAuth, username, userId, doHookLogin, resultats } from '../stores/user';
import { setDefaultHeaders } from '../composables/useFetchApi';
import { finParcours } from '../stores/courseActuelle';

import SimpleModal from './SimpleModal.vue';
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

const connRef = ref(false);
const unexpResp = ref(false);
const globalLoading = ref(false);

function fetchResults() {
  const {data, error, loading} = resultCrud.fetchApiToRef({url: `resultats?utilisateurs=${userId.value}`, method: 'GET'});
  globalLoading.value = loading.value;
  watch(data, () => {
    globalLoading.value = loading.value;
    resultats.value = data.value;
  });
  watch(error, () => {
    globalLoading.value = loading.value;
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
  const {data, error, loading} = peopleCrud.create(formData);
  globalLoading.value = loading.value;
  watch(data, () => {
    globalLoading.value = loading.value;
    const jwt = data.value.token;
    if (!jwt) {
      console.error('No token in response');
      return;
    }
    setDefaultHeaders({ Authorization: 'Bearer ' + jwt });
    isAuth.value = true;
    username.value = data.value.utilisateur.nom;
    userId.value = data.value.utilisateur.id;
    doHookLogin();
  });
  watch(error, () => {
    globalLoading.value = loading.value;
    usernameExists.value = error.value.data.msg.includes('§§usernameExists§§');
    emailExists.value = error.value.data.msg.includes('§§emailExists§§');
    invalidEmail.value = error.value.data.msg.includes('§§invalidEmail§§');
    
    console.error('Error while creating account', error.value);
  });
}

function submitLogin(event) {
  event.preventDefault();
  const formData = {nom: name.value, mdp: password.value};
  const {data, error, loading} = peopleCrud.fetchApiToRef({url: 'utilisateurs/login', method: 'POST', data: formData});
  globalLoading.value = loading.value;
  watch(data, () => {
    globalLoading.value = loading.value;  
    const jwt = data.value.token;
    if (!jwt) {
      console.error('Unexpected response', data.value);
      unexpResp.value = true;
      return;
    }
    //else
    setDefaultHeaders({Authorization: 'Bearer ' + jwt});
    isAuth.value = true;
    connRef.value = false;
    unexpResp.value = false;
    username.value = data.value.utilisateur.nom;
    userId.value = data.value.utilisateur.id;
    fetchResults();
    doHookLogin();
  });
  watch(error, () => {
    globalLoading.value = loading.value;  
    console.error('Error while logging in', error.value);
    connRef.value = true;
  });
}

const handleClose = () => {
  console.log('closing modal');
  finParcours.value = false;
}

const showLoadingModal = computed(() => globalLoading.value);
</script>

<template>
  <div class="profile-container" v-if="isAuth">
    <p>Bonjour {{ username }}</p>
    <h2>Résultats effectués</h2>
    <template v-if="resultats.length > 0">
      <AppTabList :tab="resultats"></AppTabList>
    </template>
    <p v-else>Vous n'avez pas encore effectué de parcours</p>
  </div>

  <form class="auth-form" v-else-if="create" @submit="submitCreate" method="post">
    <div>
      <div class="input">
        <BaseInputLabel for="name">Nom</BaseInputLabel>
        <BaseInput type="text" name="nom" id="name" v-model="name" />
      </div>
      <BaseInputError v-if="usernameExists" message="ce nom de compte est déjà utilisé" />
    </div>
    <div>
      <div class="input">
        <BaseInputLabel for="email">Mail</BaseInputLabel>
        <BaseInput type="email" name="mail" id="email" v-model="email" />
      </div>
      <BaseInputError v-if="invalidEmail" message="veuillez entrer un email valide" />
      <BaseInputError v-if="emailExists" message="cet email est déjà utilisé" />
    </div>
    <div class="input">
      <BaseInputLabel for="password">Mot de passe</BaseInputLabel>
      <BaseInput type="text" name="mdp" id="password" v-model="password" />
    </div>
    <div class="choix">
      <BaseButton type="submit">Créer un compte</BaseButton>
      <a @click="toggleCreate">J'ai déjà un compte</a>
    </div>
  </form>

  <form class="auth-form" v-else @submit="submitLogin" method="post">
    <div class="input">
      <BaseInputLabel for="name">Nom</BaseInputLabel>
      <BaseInput type="text" name="nom" id="name" v-model="name" />
    </div>
    <div class="input">
      <BaseInputLabel for="password">Mot de passe</BaseInputLabel>
      <BaseInput type="text" name="mdp" id="password" v-model="password" />
    </div>
    <BaseInputError v-if="connRef" message="Identifiants incorrects"/>
    <BaseInputError v-if="unexpResp" message="Réponse non conforme reçue. Veuillez contacter le support informatique."/>
    <div class="choix">
      <BaseButton type="submit">Se connecter</BaseButton>
      <a @click="toggleCreate">Je n'ai pas de compte</a>
    </div>
  </form>

  <SimpleModal :modalContent="'Résultats en chargement...'" :modalCondition="showLoadingModal"/>
  <SimpleModal :modalContent="'Veuillez vous connecter pour enregistrer le parcours'" :modalCondition="finParcours" :modalCloser="true" @close="handleClose"/>
</template>

<style scoped>
a:hover {
  text-decoration: underline;
}

form>div {
  margin-bottom: var(--spacing-large);
}

div.input {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
}

.choix {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
}

.profile-container {
  padding: var(--spacing-large);
}

.auth-form {
  padding: var(--spacing-large);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  max-width: 400px;
  margin: auto;
}

@media (max-width: var(--breakpoint-medium)) {

  .profile-container,
  .auth-form {
    padding: var(--spacing-medium);
  }
}

@media (max-width: var(--breakpoint-small)) {

  .profile-container,
  .auth-form {
    padding: var(--spacing-small);
  }
}
</style>