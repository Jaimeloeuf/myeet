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

    <!-- 
      Display video of the current user
      Note: mute your own video, otherwise you'll hear yourself ...
    -->
    <div class="text-center">
      <!-- Attributes are needed to prevent video from freezing on the first frame on iOS safari -->
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

    <!-- Display video of the connected peer -->
    <div class="text-center">
      <video id="peer-camera" width="100%" height="100%" autoplay="autoplay" />
      <span class="label label-info" id="connectedPeerID">
        {{ connectedPeerID || "Not connected yet" }}
      </span>
    </div>

    <br />
    <br />

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

/**
 * Handle the providen stream (video and audio) to the desired video element
 *
 * @param {*} stream
 * @param {*} element_id
 */
function onReceiveStream(stream, element_id) {
  // Retrieve the video element according to the desired
  const video = document.getElementById(element_id);
  // Set the given stream as the video source object
  video.srcObject = stream;

  // Store a global reference of the stream
  // window.peer_stream = stream;
}

export default {
  name: "home",

  data() {
    return {
      userID: localStorage.getItem("userID"),

      connectedPeerID: undefined,

      // Ref to peerJS
      peer: undefined,

      localStream: undefined,

      // date: (function () {
      //   const now = new Date();
      //   now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      //   return now.toISOString().slice(0, 16);
      // })(),
    };
  },

  computed: {
    shareableLink() {
      return "https://app.vroom.com/?callUser=" + this.peer.id;
    },
  },

  mounted() {
    // Omiting id to get a random one from the server.
    const peer = new Peer();
    this.peer = peer;

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        // Will print 'hi!'
        console.log(data);
      });
      conn.on("open", () => {
        conn.send("hello!");
      });
    });

    peer.on("call", (call) => {
      requestLocalVideo(
        (stream) => {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", (remoteStream) => {
            // Show stream in some <video> element.

            // Store a global reference of the other user stream
            window.peer_stream = stream;
            // Display the stream of the other user in the peer-camera video element !
            onReceiveStream(stream, "peer-camera");
          });
        },
        (err) => {
          console.error("Failed to get local stream", err);
        }
      );
    });
  },

  methods: {
    copyShareableLink() {
      // @todo Show something to indicate copied -> implement a Toastbox component
      navigator.clipboard.writeText(this.shareableLink).then(console.log);
    },

    onMyCamera() {
      requestLocalVideo(
        (stream) => {
          this.localStream = stream;
          onReceiveStream(stream, "my-camera");
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

    async connect() {
      const conn = this.peer.connect(this.peerID);

      conn.on("open", () => {
        alert("connected");
        conn.send("hi!");
      });
    },

    async answer() {},

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
