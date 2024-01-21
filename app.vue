<script setup lang="ts">
import Hls from "hls.js/dist/hls.min";
const { data: PLAYLIST } = await useFetch(
    'https://api.inicontent.com/iptv/playlist?_options[order_by]=["created_at","ASC"]&_options[per_page]=100&_options[columns]=["name","poster","source"]',
    { transform: (res: any) => res.result }
  ),
  currentSliderScrollPos = ref(0),
  currentChannel = ref(0);

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
  const VIDEO = <HTMLMediaElement>document.getElementById("player"),
      VIDEO_CONTAINER = <HTMLInputElement>document.getElementById("video-player");
    function toggleFullscreen() {
     if (!document.webkitFullscreenElement) {
      if (VIDEO_CONTAINER.requestFullScreen)
       VIDEO_CONTAINER.requestFullScreen();
      else if (VIDEO_CONTAINER.webkitRequestFullScreen)
       VIDEO_CONTAINER.webkitRequestFullScreen();
      else if (VIDEO_CONTAINER.mozRequestFullScreen)
       VIDEO_CONTAINER.mozRequestFullScreen();
     } else
      document.webkitExitFullscreen();
    }

  VIDEO_CONTAINER.addEventListener("dblclick", toggleFullscreen);

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
      VIDEO_CONTAINER.style.cursor = "auto";
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        (
          document.getElementById("controls") as HTMLInputElement
        ).style.display = "none";
        (
          document.getElementById("playlist") as HTMLInputElement
        ).style.display = "none";
        VIDEO_CONTAINER.style.cursor = "none";
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
    slideWidth = 120,
    slideMaxWidth = (document.getElementById("playlist") as HTMLInputElement)
      .clientHeight;

  (document.getElementById("list_up") as HTMLInputElement).addEventListener(
    "click",
    () => {
      var newSliderScrollPos = currentSliderScrollPos.value - slideWidth;
      if (newSliderScrollPos < 0) return;
      currentSliderScrollPos.value = newSliderScrollPos;
      sliderElement?.scrollTo({ top: newSliderScrollPos, behavior: "smooth" });
    }
  );

  (document.getElementById("list_down") as HTMLInputElement).addEventListener(
    "click",
    () => {
      var newSliderScrollPos = currentSliderScrollPos.value + slideWidth;
      if (newSliderScrollPos >= slideMaxWidth) return;
      currentSliderScrollPos.value = newSliderScrollPos;
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
  <div id="video-player">
    <video
      id="player"
      controls
      autoplay
      controlsList="nofullscreen nodownload"
    ></video>
    <div id="controls">
      <button id="list_up" style="display: none">
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
      <button id="list_down" style="display: none">
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
      <NuxtLink to="https://google.com" external>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="48px"
          height="48px"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
      </NuxtLink>
      <NuxtLink to="https://yacine-app.tv/" external>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 122.88" style="enable-background:new 0 0 122.88 122.88" xml:space="preserve">
            <g>
                <path style="fill-rule:evenodd;clip-rule:evenodd" d="M61.44,0c16.97,0,32.33,6.88,43.44,18c11.12,11.12,18,26.48,18,43.44c0,16.97-6.88,32.33-18,43.44 c-11.12,11.12-26.48,18-43.44,18S29.11,116,18,104.88C6.88,93.77,0,78.41,0,61.44C0,44.47,6.88,29.11,18,18 C29.11,6.88,44.47,0,61.44,0L61.44,0z M76.85,117.08L76.73,117l6.89-23.09L69.41,78.15L52.66,78L39.38,94.62l6.66,22.32l-0.15,0.1 c4.95,1.38,10.16,2.12,15.55,2.12C66.78,119.16,71.95,118.44,76.85,117.08L76.85,117.08z M12.22,91.61l24.34,0.12L49.28,75.8 l-5.26-16.12l-21.42-9.3L3.78,64.08C4.23,74.14,7.26,83.53,12.22,91.61L12.22,91.61z M16.77,24.88l7.4,22.14l19.98,8.68 l15.44-11.97V20.94L40.51,7.63c-7.52,2.93-14.28,7.39-19.89,13C19.27,21.98,17.98,23.4,16.77,24.88L16.77,24.88z M81.7,7.37 L63.3,20.77V43.7L77.8,54.91l20.81-8.92l7.18-21.49c-1.12-1.35-2.3-2.64-3.54-3.88C96.48,14.85,89.49,10.29,81.7,7.37L81.7,7.37z M119.09,64.36l-0.02,0.01L99.09,49.82l-19.81,8.49l-6.08,18.03l13.73,15.23c0.06,0.06,0.09,0.13,0.11,0.21l23.6-0.11 C115.56,83.65,118.59,74.34,119.09,64.36L119.09,64.36z"/>
            </g>
        </svg>
      </NuxtLink>
      <NuxtLink to="https://youtube.com/" external>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 461.001 461.001" xml:space="preserve">
            <g>
            	<path style="fill:#F61C0D;" d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728
            		c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137
            		C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607
            		c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/>
            </g>
        </svg>
      </NuxtLink>
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

#video-player {
  cursor: none;
  position: relative;
  height: 100vh;
}

#playlist {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 100%;
  height: 120px;
  overflow-y: auto;
  z-index: 99;
  transition: 0.5s;
  margin: 0;
  padding: 1rem;
  display: none;
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
  display: none;
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
