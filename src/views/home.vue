<template>
  <div>
    Your ID: <b>{{ peer && peer.id }}</b>
    <br />

    <p v-if="peer && peer.id">
      <small> Share the following link with your pal to call! </small>
      <br />
      Link:
      <button
        v-if="clipboardAvailable"
        @click="writeToClipboard(shareableLink)"
      >
        <b>{{ shareableLink }}</b>
      </button>
      <button
        v-if="nativeShareAvailable"
        @click="
          nativeShare({
            url: shareableLink,
            // @todo Send a sentence instead of the id only....
            // text: peer.id,
          })
        "
      >
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
      <!-- @todo Make this overlay -->
      <p>You</p>

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
    </div>

    <div>
      <!-- Video of the connected peer -->
      <video id="peer-camera" width="100%" height="100%" autoplay playsinline />

      <!-- @todo Make this overlay -->
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
      <button @click="startCall(connectedPeerID)" id="submitButton">
        Call
      </button>
    </div>

    <div id="buttons">
      <button @click="logout" id="logoutButton">Logout</button>
    </div>
  </div>
</template>

<script>
import logout from "../utils/logout";
import requestLocalMedia from "../utils/requestLocalMedia";
import { clipboardAvailable, writeToClipboard } from "../utils/clipboard";
import { nativeShareAvailable, nativeShare } from "../utils/nativeShare";

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
      clipboardAvailable,
      nativeShareAvailable,

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
    shareableLink() {
      return "https://myeet-me.web.app/#home/?callUser=" + this.peer.id;
    },
  },

  mounted() {
    // Omiting id to get a random one from the server.
    const peer = new Peer();
    this.peer = peer;

    peer.on("call", this.answerCall);
  },

  methods: {
    // @todo Show something to indicate copied -> implement a Toastbox component
    writeToClipboard,
    nativeShare,

    // Await for it to set the local MediaStream onto the vue object
    async onMyCamera() {
      try {
        this.localStream = await requestLocalMedia();
        passStreamToVideoElement(this.localStream, "my-camera");
      } catch (err) {
        console.error(err);
        alert("Cannot access your camera!");
      }
    },

    // @todo Need to kill video on app close too
    offMyCamera() {
      this.localStream.getTracks().forEach((track) => track.stop());
    },

    /**
     * Call a peer
     *
     * Always pass in the peerID, because when this method is used directly in the event handler attribute of the HTML element
     * The mouse click event object will be passed in as the first arguement instead.
     */
    async startCall(peerID) {
      // @todo If user choose to not on their camera, create a voice only media stream
      // Only run this if camera is not already on
      // Ensure video feed is started before calling peer.call
      // Await to ensure mediaStream is created before running peer.call, as that will fail with a invalid mediaStream
      if (!this.localStream) await this.onMyCamera();

      // Call a peer with our local mediaStream
      const call = this.peer.call(peerID, this.localStream);

      // Attach MediaStream of the remote peer to the peer's video element
      call.on("stream", (remoteStream) => {
        this.otherStream = remoteStream;

        // Add it to our HTML video element
        passStreamToVideoElement(remoteStream, "peer-camera");
      });
    },

    // Answer a call from a peer
    async answerCall(call) {
      // Send over a userID, so we know who is calling....
      if (!confirm("Incoming call!")) return;

      // @todo If user choose to not on their camera, create a voice only media stream
      // Only run this if camera is not already on
      // Ensure video feed is started before calling peer.call
      // Await to ensure mediaStream is created before running peer.call, as that will fail with a invalid mediaStream
      if (!this.localStream) await this.onMyCamera();

      // Answer the call, providing our mediaStream
      call.answer(this.localStream);

      // Attach MediaStream of the remote peer to the peer's video element
      call.on("stream", (remoteStream) => {
        this.otherStream = remoteStream;

        // Add it to our HTML video element
        passStreamToVideoElement(remoteStream, "peer-camera");
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
video {
  border: 1px solid rgb(228, 228, 228);
}

/* To make the video mirrored */
video {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}
</style>
