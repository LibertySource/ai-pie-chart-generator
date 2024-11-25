import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'

const app = createApp(App);

// Add the version to global properties
app.config.globalProperties.$appVersion = __APP_VERSION__;

app.mount('#app');