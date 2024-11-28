<template>
    <div id="video-player">
        <video id="player" controls autoplay controlslist="nofullscreen nodownload"></video>
        <div id="controls">
            <NuxtLink to="https://google.com" external>
                <IconsGoogle />
            </NuxtLink>
            <NuxtLink to="https://youtube.com/results?search_query=أفلام+مغربية" external>
                <IconsMovie />
            </NuxtLink>
            <NuxtLink to="https://youtube.com/results?search_query=وثائقي" external>
                <IconsYoutube />
            </NuxtLink>
            <NuxtLink to="https://yacine-app.tv" external>
                <IconsSport />
            </NuxtLink>
        </div>
        <div id="playlist">
            <div v-for="(item, index) in PLAYLIST" :key="index"
                :class="`item${currentChannel === index ? ' active' : ''}`"
                :style="{ backgroundImage: `url(${item.poster.publicURL})` }" @click="ChangeChannel(index)">
                <span class="name">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import Hls from "hls.js";

const { data: PLAYLIST } = await useFetch(
	"https://api.inicontent.com/IPTV/playlist",
	{
		transform: (res) => res.result,
	},
);

onMounted(() => {
	Object.defineProperty(document, "referrer", {
		get: () => "https://snrtlive.ma/",
	});

	const hls = new Hls();
	const VIDEO = document.getElementById("player");
	const VIDEO_CONTAINER = document.getElementById("video-player");

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			VIDEO_CONTAINER.requestFullscreen?.();
		} else {
			document.exitFullscreen();
		}
	}

	VIDEO_CONTAINER.addEventListener("dblclick", toggleFullscreen);

	if (!PLAYLIST.value) return;

	VIDEO.setAttribute("poster", PLAYLIST.value[0].poster.publicURL);
	hls.loadSource(PLAYLIST.value[0].source);
	hls.attachMedia(VIDEO);
	hls.on(Hls.Events.MANIFEST_PARSED, () => {
		VIDEO.play();

		let timeout;
		const duration = 3000;
		document.addEventListener("mousemove", () => {
			document.getElementById("controls").style.display = "flex";
			document.getElementById("playlist").style.display = "grid";
			VIDEO_CONTAINER.style.cursor = "auto";
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				document.getElementById("controls").style.display = "none";
				document.getElementById("playlist").style.display = "none";
				VIDEO_CONTAINER.style.cursor = "none";
			}, duration);
		});
	});

	VIDEO.addEventListener("mouseup", (e) => {
		e.preventDefault();
		if (!PLAYLIST.value) return;

		if (e.button === 0) {
			if (VIDEO.paused) VIDEO.play();
			else VIDEO.pause();
		} else if (e.button === 4 && currentChannel.value > 0) {
			ChangeChannel(currentChannel.value - 1);
		} else if (
			e.button === 3 &&
			currentChannel.value < PLAYLIST.value.length - 1
		) {
			ChangeChannel(currentChannel.value + 1);
		}
	});

	VIDEO.addEventListener("wheel", throttle(100));

	function ChangeChannel(index) {
		if (!PLAYLIST.value) return;
		const VIDEO = document.getElementById("player");
		currentChannel.value = index;
		VIDEO.setAttribute("poster", PLAYLIST.value[index].poster.publicURL);
		hls.loadSource(PLAYLIST.value[index].source);
		hls.attachMedia(VIDEO);
		hls.on(Hls.Events.MANIFEST_PARSED, () => VIDEO.play());
	}

	function throttle(wait) {
		let time = Date.now();

		return (event) => {
			if (Math.abs(event.deltaY) < 4) return;
			if (time + wait - Date.now() < 0) {
				if (event.deltaY < 0 && VIDEO.volume < 1) {
					VIDEO.volume = Math.min(VIDEO.volume + 0.2, 1);
				} else if (event.deltaY > 0 && VIDEO.volume > 0) {
					VIDEO.volume = Math.max(VIDEO.volume - 0.2, 0);
				}
				time = Date.now();
			}
		};
	}
});

const currentChannel = ref(0);
</script>

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

* {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

::-webkit-scrollbar,
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
	text-shadow: 1px 1px 2px #000, -1px 1px 2px #000, 1px -1px 2px #000, -1px -1px
		2px #000;
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