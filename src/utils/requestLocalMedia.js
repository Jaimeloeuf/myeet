/**
 * Request for the user's camera and microphone
 * @param {Object} constraints https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 * Request audio and video by default
 */
export default async (constraints = { audio: true, video: true }) =>
  getGetUserMedia()(constraints);

/**
 * Get the getUserMedia function of the browser
 * MonkeyPatch code that ensures this will work even with browsers that only implement the legacy getUserMedia method
 */
function getGetUserMedia() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    return navigator.mediaDevices.getUserMedia;

  // Custom function with same API wrapped over legacy API
  return function (constraints) {
    // First get ahold of the legacy getUserMedia, if present
    // Monkeypatch for crossbrowser getUserMedia
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error to keep a consistent interface
    // return Promise.reject(new Error("getUserMedia is not implemented in this browser"));
    if (!navigator.getUserMedia)
      throw new Error("Input media not available on this browser!");

    console.warn("Using legacy [navigator.getUserMedia] method");

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise((resolve, reject) =>
      navigator.getUserMedia(constraints, resolve, reject)
    );
  };
}
