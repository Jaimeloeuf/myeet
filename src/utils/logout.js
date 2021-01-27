/**
 * Signout current user, clear vuex store state and redirects to login
 * @function logout
 */
export default async function logout() {
  // Asynchronously load firebase es module and use its default export.
  const { default: firebase } = await import("firebase/app");

  if (!confirm("Logout?")) return;

  // Signout current user
  await firebase.auth().signOut();

  // Clear storage mediums used for data storage by "vuex-persistedstate" plugin
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to login view
  this.$router.push({ name: "login" });
}
