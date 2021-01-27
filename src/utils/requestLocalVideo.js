// Request for the user's camera and microphone
export default function requestLocalVideo(
  successCallback,
  errorCallback,
  avOptions = { audio: true, video: true }
) {
  // Monkeypatch for crossbrowser getUserMedia
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  if (!navigator.getUserMedia) throw new Error("No input video available!");

  // Request audio and video by default
  navigator.getUserMedia(avOptions, successCallback, errorCallback);
}
