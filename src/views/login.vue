<template>
  <div>
    <h1 id="title">myeet</h1>

    <br />
    <h2>LOGIN</h2>

    <input
      @keypress.enter="loginButtonEventHandler"
      type="text"
      v-model="email"
      placeholder="Email"
    />
    <br />
    <br />

    <input
      @keypress.enter="loginButtonEventHandler"
      type="password"
      v-model="password"
      placeholder="Password"
    />
    <br />
    <br />

    <button @click="loginButtonEventHandler">LOGIN</button>
    <br />
    <br />

    <router-link :to="{ name: 'signup' }">
      Create a new account here!
    </router-link>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

// Function to map and return a given err.code to a user friendly message
function error_msg(err) {
  switch (err.code) {
    case "auth/wrong-password":
      return "Invalid password or email!";
    case "auth/network-request-failed":
      return "Oops, check your internet connection!";
    case "auth/user-not-found":
      return "Sorry but you dont have an account with us";
    case "email/no-verify":
      return "Please verify email before trying again";
    default:
      return "Something went wrong! Please try again.";
  }
}

export default {
  name: "Login",

  data() {
    return {
      // Create these 2 variables with empty string
      email: "",
      password: "",
    };
  },

  methods: {
    async loginButtonEventHandler() {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);

        if (!firebase.auth().currentUser.emailVerified) {
          // Throw new error with pre-defined code to get the right error_msg
          const error = new Error();
          error.code = "email/no-verify";
          throw error;
        }

        // Await for async dispatch to ensure app only starts after user info is available.
        // await this.$store.dispatch("getUserDetails", this.email);
        // this.$store.dispatch("init");

        // Route to the home page, after login
        this.$router.replace({ name: "home" });
      } catch (error) {
        // Only resend verification email if needed, but both will end early after signout without continuing to normal error handling
        if (error.code === "email/no-verify") {
          if (
            confirm(
              "Please verify your email first! Resend verification email?"
            )
          )
            firebase.auth().currentUser.sendEmailVerification();
          return await firebase.auth().signOut();
        }

        // If there is an error but user is somehow logged in, sign user out to try again
        if (firebase.auth().currentUser) await firebase.auth().signOut();

        alert("Authentication Failed: " + error_msg(error));
      }
    },
  },
};
</script>

<style scoped>
/* Set color of the titles using IDs */
#title {
  color: green;
}

button {
  width: 80%;
  height: 3em;

  border: none;
  border-radius: 0.6em;

  color: white;
  font-size: 1.4em;

  background-color: green;
}
</style>
