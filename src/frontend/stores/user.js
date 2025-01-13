import { ref } from 'vue';

export const isAuth = ref(false);
export const username = ref('');
export const userId = ref('');

let doAfterLogin = () => {};

export function addHookLogin(callback) {
    doAfterLogin = callback;
}
export function doHookLogin() {
    doAfterLogin();
    doAfterLogin = () => {};
}
