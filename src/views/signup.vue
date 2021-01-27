<template>
  <div>
    <h1 id="title">myeet</h1>

    <br />
    <h2>SIGNUP</h2>

    <input
      @keypress.enter="signupButtonEventHandler"
      type="text"
      v-model="email"
      placeholder="Email"
    />
    <br />
    <br />

    <input
      @keypress.enter="signupButtonEventHandler"
      type="password"
      v-model="password"
      placeholder="Password"
    />
    <br />
    <br />

    <button @click="signupButtonEventHandler">SIGNUP</button>
    <br />
    <br />

    <router-link :to="{ name: 'login' }">
      If you have account ? click here
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
      return "Invalid password or email.";
    case "auth/email-already-in-use":
      return "Email already in use, please log in instead.<br />Reset password if you have forgotten it.";
    case "auth/network-request-failed":
      return "Oops, please check your internet connection!";
    default:
      return "Ugh, something went wrong! Try again please?";
  }
}

export default {
  name: "Signup",

  data() {
    return {
      email: "",
      password: "",
    };
  },

  methods: {
    async signupButtonEventHandler() {
      try {
        if (!this.email.length || !this.password.length)
          alert("Missing inputs!");

        // @todo Add logic to verify that the email is a TP student email

        // Make lowercase as Firebase auth like google ignores the email RFC and forces email case-insensitivity
        this.email = this.email.toLowerCase();

        // Create new user and send them a email verification email
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);
        // Send user email verification email right after account creation
        firebase.auth().currentUser.sendEmailVerification();

        // Sign user out, and wait until complete before redirect to prevent route gaurd from redirecting to home view
        await firebase.auth().signOut();

        // Show dialog to inform user to verify email
        alert("Verify your email first before logging in!");

        // Redirect to login view once user has been informed to verify email
        this.$router.push({ name: "login" });
      } catch (error) {
        // If there is an error before user is signed out, sign user out to try again
        if (firebase.auth().currentUser) firebase.auth().signOut();

        alert("Signup Failed: " + error_msg(error));
      }
    },
  },
};
</script>

<style scoped>
/* Set color of the titles using IDs */
#title {
  color: orange;
}

button {
  width: 80%;
  height: 3em;

  border: none;
  border-radius: 0.6em;

  color: white;
  font-size: 1.4em;

  background-color: orange;
}
</style>
