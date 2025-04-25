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
		query: {
			options: "{perPage:1000}",
		},
		transform: (res) => res.result,
	},
);

onMounted(() => {
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