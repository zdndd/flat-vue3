import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia"; // 1. 引入 createPinia

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.mount("#app");
