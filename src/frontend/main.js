import { createApp } from 'vue';
import { Quasar } from 'quasar';
import App from './App.vue';

const myApp = createApp(App)
myApp.use(Quasar, {
  plugins: {},
  config: {
    brand: { negative: 'tomato' },
    dark: 'auto',
  },
});
myApp.mount('#app');