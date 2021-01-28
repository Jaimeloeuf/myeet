import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// Importing error module for its side effect
import "./error";

import firebase from "firebase/app";
import "firebase/auth";

Vue.config.productionTip = false;

// Register global custom directive called `v-autofocus`
import autofocus from "./directives/autofocus";
Vue.directive("autofocus", autofocus);

// firebaseConfig auto generated in project settings
firebase.initializeApp({
  apiKey: "AIzaSyDK33__mcWGYOYvZgFh4XJshp0JPgDKyKI",
  authDomain: "myeet-me.firebaseapp.com",
  projectId: "myeet-me",
  appId: "1:222716799948:web:f9c2abd6de70f339538b69",
});

// App variable to store reference to the vue App object
let app;

/**
 * @notice Why new vue is wrapped in this.
 * Wait for firebase to finish initialization before creating the app.
 * So that the router navigation wont break due to invalid auth
 */
const unsubscribe = firebase.auth().onAuthStateChanged(() => {
  // Prevent app initialization from running more than once
  if (!app)
    // Create new vue app
    app = new Vue({
      router,
      render: (h) => h(App),
    }).$mount("#app");

  // Use the firebase.Unsubscribe function returned from adding auth state change listner to unsubscribe
  // To prevent new Vue from running more than once
  unsubscribe();
});
