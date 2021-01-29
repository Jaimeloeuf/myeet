// Simple utils module to handle the "contacts" book, that is stored in localStorage, and can be synced to a server or file storage platform like google drive

function get() {
  return JSON.parse(localStorage.getItem("contacts")) || {};
}

function write(contacts = {}) {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function clearAll() {
  localStorage.removeItem("contacts");
}

function set(userName, peerID) {
  const contacts = get();
  contacts[userName] = peerID;
  write(contacts);
}

export default { get, set, clearAll };
