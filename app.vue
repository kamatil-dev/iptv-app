<script setup lang="ts">
import Hls from "hls.js/dist/hls.min";
const { data: PLAYLIST } = await useFetch(
  'https://api.inicontent.com/iptv/playlist?_options[order_by]=["created_at","ASC"]&_options[per_page]=100&_options[columns]=["name","poster","source"]',
  { transform: (res: any) => res.result }
);
const currentChannel = ref(0);

const ChangeChannel = (index: number) => {
  const hls = new Hls();
  const VIDEO = <HTMLMediaElement>document.getElementById("player");
  currentChannel.value = index;
  VIDEO.setAttribute("poster", PLAYLIST.value[index].poster);
  hls.loadSource(PLAYLIST.value[index].source);
  hls.attachMedia(VIDEO);
  hls.on(Hls.Events.MANIFEST_PARSED, () => VIDEO.play());
};

onMounted(() => {
  const hls = new Hls();
  const VIDEO = <HTMLMediaElement>document.getElementById("player");
  (document.getElementById("sound_up") as HTMLInputElement).addEventListener(
    "click",
    () => {
      if (VIDEO.volume < 1)
        VIDEO.volume = Number((VIDEO.volume + 0.2).toFixed(2));
    }
  );
  (document.getElementById("sound_down") as HTMLInputElement).addEventListener(
    "click",
    () => {
      if (VIDEO.volume >= 0.2)
        VIDEO.volume = Number((VIDEO.volume - 0.2).toFixed(2));
    }
  );
  // (document.getElementById("turn_off") as HTMLInputElement).addEventListener(
  //   "click",
  //   () => {}
  // );
  VIDEO.setAttribute("poster", PLAYLIST.value[0].poster);
  hls.loadSource(PLAYLIST.value[0].source);
  hls.attachMedia(VIDEO);
  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    // VIDEO.muted = true;
    VIDEO.play();

    var timeout: NodeJS.Timeout;
    var duration = 3000;
    document.addEventListener("mousemove", function () {
      (document.getElementById("controls") as HTMLInputElement).style.display =
        "flex";
      (document.getElementById("playlist") as HTMLInputElement).style.display =
        "grid";
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        (
          document.getElementById("controls") as HTMLInputElement
        ).style.display = "none";
        (
          document.getElementById("playlist") as HTMLInputElement
        ).style.display = "none";
      }, duration);
    });
  });

  VIDEO.addEventListener("mouseup", (e) => {
    e.preventDefault();
    var e = e || window.event;
    if (e.button === 0) {
      if (VIDEO.paused) VIDEO.play();
      else VIDEO.pause();
    } else if (e.button === 4) {
      if (currentChannel.value > 0) ChangeChannel(currentChannel.value - 1);
    } else if (e.button === 3) {
      if (currentChannel.value < PLAYLIST.value.length)
        ChangeChannel(currentChannel.value + 1);
    }
  });

  var sliderElement = document.getElementById("playlist"),
    currentSliderScrollPos = 0,
    slideWidth = 120,
    slideMaxWidth = (document.getElementById("playlist") as HTMLInputElement)
      .clientHeight;

  (document.getElementById("list_up") as HTMLInputElement).addEventListener(
    "click",
    () => {
      var newSliderScrollPos = currentSliderScrollPos - slideWidth;
      if (newSliderScrollPos < 0) return;
      currentSliderScrollPos = newSliderScrollPos;
      sliderElement?.scrollTo({ top: newSliderScrollPos, behavior: "smooth" });
    }
  );

  (document.getElementById("list_down") as HTMLInputElement).addEventListener(
    "click",
    () => {
      var newSliderScrollPos = currentSliderScrollPos + slideWidth;
      if (newSliderScrollPos >= slideMaxWidth) return;
      currentSliderScrollPos = newSliderScrollPos;
      sliderElement?.scrollTo({ top: newSliderScrollPos, behavior: "smooth" });
    }
  );

  function throttle(wait: number) {
    var time = Date.now();

    return function (event: any) {
      if (Math.abs(event.deltaY) < 4) return;
      if (time + wait - Date.now() < 0) {
        if (event.deltaY < 0) {
          if (VIDEO.volume < 1)
            VIDEO.volume = Number((VIDEO.volume + 0.2).toFixed(2));
        } else if (event.deltaY > 0)
          if (VIDEO.volume >= 0.2)
            VIDEO.volume = Number((VIDEO.volume - 0.2).toFixed(2));
        time = Date.now();
      }
    };
  }

  VIDEO.addEventListener("wheel", throttle(100));
});
</script>

<template>
  <div class="video-player">
    <video
      id="player"
      controls
      autoplay
      controlsList="nofullscreen nodownload"
    ></video>
    <div id="controls">
      <button id="list_up">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          shape-rendering="geometricPrecision"
          text-rendering="geometricPrecision"
          image-rendering="optimizeQuality"
          fill-rule="evenodd"
          clip-rule="evenodd"
          viewBox="0 0 512 346.35"
        >
          <path
            fill-rule="nonzero"
            d="M410.1 346.35 256 201.69 101.9 346.35 0 240.31 256 0l256 240.31z"
          />
        </svg>
      </button>
      <button id="list_down">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          shape-rendering="geometricPrecision"
          text-rendering="geometricPrecision"
          image-rendering="optimizeQuality"
          fill-rule="evenodd"
          clip-rule="evenodd"
          viewBox="0 0 512 346.35"
        >
          <path
            fill-rule="nonzero"
            d="M410.1 0 256 144.66 101.9 0 0 106.04l256 240.31 256-240.31z"
          />
        </svg>
      </button>
      <button id="sound_up">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 122.88 95.14"
          style="enable-background: new 0 0 122.88 95.14"
          xml:space="preserve"
        >
          <g>
            <path
              d="M95.18,26.66c0-1.88,1.52-3.4,3.4-3.4c1.88,0,3.4,1.52,3.4,3.4v17.51h17.51c1.88,0,3.4,1.52,3.4,3.4 c0,1.88-1.52,3.4-3.4,3.4h-17.51v17.51c0,1.88-1.52,3.4-3.4,3.4c-1.88,0-3.4-1.52-3.4-3.4V50.96H77.67c-1.88,0-3.4-1.52-3.4-3.4 c0-1.88,1.52-3.4,3.4-3.4h17.51V26.66L95.18,26.66z M10.82,22.49H35.9L57.26,1c1.32-1.33,3.46-1.33,4.79-0.01 c0.67,0.66,1,1.53,1,2.4h0.01v88.36c0,1.88-1.52,3.4-3.4,3.4c-0.95,0-1.81-0.39-2.43-1.02L36.08,76.29H10.82 c-2.98,0-5.68-1.22-7.64-3.18C1.22,71.15,0,68.45,0,65.47V33.31c0-2.98,1.22-5.68,3.17-7.64C5.13,23.71,7.84,22.49,10.82,22.49 L10.82,22.49z M37.3,29.28H10.82c-1.1,0-2.11,0.45-2.84,1.19c-0.73,0.73-1.19,1.74-1.19,2.84v32.16c0,1.1,0.45,2.11,1.19,2.84 c0.73,0.73,1.74,1.19,2.84,1.19H37.3v0.02c0.77,0,1.54,0.26,2.18,0.79l16.79,14.15V11.61L39.88,28.09 C39.26,28.82,38.33,29.28,37.3,29.28L37.3,29.28z"
            />
          </g>
        </svg>
      </button>
      <button id="sound_down">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 122.88 99.44"
          style="enable-background: new 0 0 122.88 99.44"
          xml:space="preserve"
        >
          <g>
            <path
              d="M84.03,53.27c-1.96,0-3.55-1.59-3.55-3.55c0-1.96,1.59-3.55,3.55-3.55h35.3c1.96,0,3.55,1.59,3.55,3.55 c0,1.96-1.59,3.55-3.55,3.55H84.03L84.03,53.27z M11.31,23.51h26.22L59.85,1.04c1.38-1.39,3.62-1.39,5-0.01 c0.7,0.69,1.04,1.6,1.04,2.51h0.01v92.36c0,1.96-1.59,3.55-3.55,3.55c-0.99,0-1.89-0.41-2.54-1.07L37.72,79.74H11.31 c-3.11,0-5.94-1.27-7.99-3.32C1.27,74.37,0,71.55,0,68.43V34.82c0-3.11,1.27-5.94,3.32-7.99C5.37,24.78,8.19,23.51,11.31,23.51 L11.31,23.51z M38.99,30.61H11.31c-1.15,0-2.21,0.47-2.97,1.24c-0.76,0.76-1.24,1.82-1.24,2.97v33.62c0,1.15,0.48,2.2,1.24,2.97 c0.77,0.77,1.82,1.24,2.97,1.24h27.68v0.02c0.8,0,1.61,0.27,2.27,0.83l17.55,14.79V12.13L41.69,29.36 C41.03,30.12,40.07,30.61,38.99,30.61L38.99,30.61z"
            />
          </g>
        </svg>
      </button>
      <!-- <button id="turn_off">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="113.525px"
          height="122.879px"
          viewBox="0 0 113.525 122.879"
          enable-background="new 0 0 113.525 122.879"
          xml:space="preserve"
        >
          <g>
            <path
              d="M78.098,13.509l0.033,0.013h0.008c2.908,1.182,5.699,2.603,8.34,4.226c2.621,1.612,5.121,3.455,7.467,5.491 c11.992,10.408,19.58,25.764,19.58,42.879v0.016h-0.006c-0.006,15.668-6.361,29.861-16.633,40.127 c-10.256,10.256-24.434,16.605-40.09,16.613v0.006h-0.033h-0.015v-0.006c-15.666-0.004-29.855-6.357-40.123-16.627l-0.005,0.004 C6.365,95.994,0.015,81.814,0.006,66.15H0v-0.033v-0.039h0.006c0.004-6.898,1.239-13.511,3.492-19.615 c0.916-2.486,2.009-4.897,3.255-7.21C13.144,27.38,23.649,18.04,36.356,13.142l2.634-1.017v2.817v18.875v1.089l-0.947,0.569 l-0.007,0.004l-0.008,0.005l-0.007,0.004c-1.438,0.881-2.809,1.865-4.101,2.925l0.004,0.004c-1.304,1.079-2.532,2.242-3.659,3.477 h-0.007c-5.831,6.375-9.393,14.881-9.393,24.22v0.016h-0.007c0.002,9.9,4.028,18.877,10.527,25.375l-0.004,0.004 c6.492,6.488,15.457,10.506,25.349,10.512v-0.006h0.033h0.015v0.006c9.907-0.002,18.883-4.025,25.374-10.518 S92.66,76.045,92.668,66.148H92.66v-0.033V66.09h0.008c-0.002-6.295-1.633-12.221-4.484-17.362 c-0.451-0.811-0.953-1.634-1.496-2.453c-2.719-4.085-6.252-7.591-10.359-10.266l-0.885-0.577v-1.042V15.303v-2.857L78.098,13.509 L78.098,13.509z M47.509,0h18.507h1.938v1.937v49.969v1.937h-1.938H47.509h-1.937v-1.937V1.937V0H47.509L47.509,0z"
            />
          </g>
        </svg>
      </button> -->
    </div>
    <div id="playlist">
      <div
        v-for="({ poster, name }, index) in PLAYLIST"
        :key="index"
        class="item"
        :style="{ backgroundImage: 'url(' + poster + ')' }"
        :class="{ active: currentChannel === index }"
        @click="() => ChangeChannel(index)"
      >
        <span class="name">{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<style>
@font-face {
  font-family: "Cairo";
  src: url(Cairo-Regular.ttf) format("truetype");
}

* {
  outline: none;
}

body,
span {
  font-family: "Cairo", sans-serif;
}

body {
  margin: 0;
}

::-webkit-scrollbar {
  display: none;
}

* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#player::-webkit-media-controls-fullscreen-button,
#player::-webkit-media-controls-play-button,
#player::-webkit-media-controls-volume-control-container {
  display: none;
}

#player {
  position: fixed;
  height: 100vh;
  width: 100vw;
  overflow: scroll;
  background: #000;
  object-fit: fill;
}

.video-player {
  position: relative;
  height: 100vh;
}

#playlist {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120px;
  overflow-y: auto;
  z-index: 99;
  transition: 0.5s;
  margin: 0;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 1rem;
}

#playlist .item {
  height: 6rem;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  background-color: #000;
  position: relative;
  user-select: none;
  cursor: pointer;
  opacity: 0.7;
  border-radius: 15px;
}

#playlist .item:hover,
#playlist .item.active {
  opacity: 1;
  outline: 3px double #000;
}

#playlist .item .name {
  font-size: 16px;
  position: absolute;
  left: 1em;
  bottom: 0.8em;
  display: inline-block;
  max-width: 86%;
  color: #fff;
  text-shadow: 1px 1px 2px #000, -1px 1px 2px #000, 1px -1px 2px #000,
    -1px -1px 2px #000;
}

#playlist .item.active::after {
  content: "";
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 6px;
  height: 6px;
  border-radius: 100%;
  display: inline-block;
  margin-left: 4px;
  background-color: green;
}

#controls {
  z-index: 100;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 15px;
  right: 15px;
  gap: 15px;
}

#controls button {
  width: 45px;
  height: 45px;
  border-radius: 50px;
  border: 2px solid #000;
}
#controls button svg {
  width: 100%;
  height: 100%;
}
#controls button:hover svg {
  fill: #fff;
}
#controls button:hover {
  background: #000;
  color: #fff;
}
</style>
