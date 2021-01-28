<template>
  <div>
    Your ID: <b>{{ peer && peer.id }}</b>
    <br />

    <p v-if="peer && peer.id">
      <small> Share the following link with your pal to call! </small>
      <br />
      Link:
      <button @click="copyShareableLink">
        <b>{{ shareableLink }}</b>
      </button>
      <button v-if="nativeShareAvail" @click="shareLink">
        <b>Share Link</b>
      </button>

      <!-- @todo Add a share button -->
    </p>
    <br />
    <br />

    <button @click="onMyCamera">
      <b>On cam</b>
    </button>
    <button @click="offMyCamera">
      <b>Off cam</b>
    </button>

    <div>
      <!-- 
        Video of the current user
        Video is muted, otherwise you'll hear yourself ...
        Attributes are needed to prevent video from freezing on the first frame on iOS safari
      -->
      <video
        id="my-camera"
        width="100%"
        height="100%"
        muted
        autoplay
        playsinline
      />
      <!-- Make this overlay -->
      <p>You</p>
    </div>

    <br />
    <br />

    <div>
      <!-- Video of the connected peer -->
      <video id="peer-camera" width="100%" height="100%" autoplay playsinline />
      <span id="connectedPeerID">
        {{ connectedPeerID || "Not connected yet" }}
      </span>
    </div>

    <br />
    <br />

    <div id="buttons">
      <input
        v-model="connectedPeerID"
        type="text"
        placeholder="Peer ID"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />

      <button @click="endCall" id="submitButton">Close</button>
      <button @click="startCall" id="submitButton">Call</button>
    </div>

    <!-- <div id="buttons">
      <button @click="logout" id="logoutButton">Logout</button>

      <button @click="submitButtonEventHandler" id="submitButton">
        Submit
      </button>
    </div> -->
  </div>
</template>

<script>
import logout from "../utils/logout";
import requestLocalVideo from "../utils/requestLocalVideo";

import Peer from "peerjs";

// Pass the provided stream (video and audio) to the desired video element
function passStreamToVideoElement(stream, elementID) {
  // Retrieve video element using the element's HTML ID
  const video = document.getElementById(elementID);
  // Set given stream as the video source object
  video.srcObject = stream;
}

export default {
  name: "home",

  data() {
    return {
      userID: localStorage.getItem("userID"),

      connectedPeerID: undefined,

      // Ref to peerJS
      peer: undefined,

      // MediaStream object's of webcam stream and peer's webcam stream
      localStream: undefined,
      otherStream: undefined,

      // date: (function () {
      //   const now = new Date();
      //   now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      //   return now.toISOString().slice(0, 16);
      // })(),
    };
  },

  computed: {
    nativeShareAvail() {
      return !!navigator.share;
    },

    shareableLink() {
      return "https://app.myeet.me/?callUser=" + this.peer.id;
    },
  },

  mounted() {
    // Omiting id to get a random one from the server.
    const peer = new Peer();
    this.peer = peer;

    peer.on("call", this.answerCall);
  },

  methods: {
    copyShareableLink() {
      // @todo Show something to indicate copied -> implement a Toastbox component
      navigator.clipboard.writeText(this.shareableLink).then(console.log);
    },

    async shareLink() {
      if (!navigator.share)
        alert("Native sharing not available on your device");

      await navigator.share({
        // url: this.shareableLink,
        // Send a sentence instead of the id only....
        text: this.peer.id,
      });
    },

    onMyCamera() {
      requestLocalVideo(
        (stream) => {
          this.localStream = stream;
          passStreamToVideoElement(stream, "my-camera");
        },

        function (err) {
          alert("Cannot access your camera!");
          console.error(err);
        }
      );
    },

    // @todo Need to kill video on app close too
    offMyCamera() {
      this.localStream.getTracks().forEach((track) => track.stop());
    },

    // Call a peer
    startCall() {
      // Call a peer, providing our local mediaStream
      const call = this.peer.call(this.connectedPeerID, this.localStream);
      call.on("stream", function (stream) {
        this.otherStream = stream;
        console.log("Call responded!", stream);
        // `stream` is the MediaStream of the remote peer.
        // Add it to our HTML video element
        passStreamToVideoElement(stream, "peer-camera");
      });
    },

    // Answer a call from a peer
    answerCall(call) {
      if (!confirm("Incoming call!")) return;

      // Answer the call, providing our mediaStream
      call.answer(this.localStream);
      call.on("stream", function (stream) {
        this.otherStream = stream;
        // `stream` is the MediaStream of the remote peer.
        // Add it to our HTML video element
        passStreamToVideoElement(stream, "peer-camera");
      });
    },

    endCall() {
      this.peer.call.close();
    },

    logout,
  },
};
</script>

<style scoped>
/* To make the video mirrored */
video {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}
</style>
