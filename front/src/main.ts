import { createApp } from "vue";

import App from "./App.vue";
import router from "@/router/index.ts";
import store from "@/store/index.ts";
import 'uno.css'
const app = createApp(App);


app.use(router).use(store).mount("#app");
