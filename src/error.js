import Vue from "vue";

async function logger(developerMessage, errorOrEvent) {
  console.error(developerMessage, errorOrEvent);

  // Run background API call to save error details so developers can inspect later on

  // Log to user, easier to debug for now...
  alert(
    "Error! Contact developers for help\nOr relaunch app / Reinstall app" +
      "\n\n" +
      developerMessage +
      "\n" +
      errorOrEvent.message || errorOrEvent
  );
}

Vue.config.errorHandler = (err) => logger("Vue.config.errorHandler", err);

// event.reason contains the reason for the rejection
// event.promise contains the promise object
window.addEventListener("unhandledrejection", (event) =>
  logger("window.addEventListener.unhandledrejection", event)
);

window.onerror = (message, source, lineno, colno, error) =>
  logger("window.onerror", {
    error: error.message,
    message,
    source,
    lineno,
    colno,
  });
