import { NuxtLink, IconsGoogle, IconsSport, IconsYoutube } from "#components";
import Hls from "hls.js";

export default defineNuxtComponent({
	async setup() {
		onMounted(() => {
			Object.defineProperty(document, "referrer", {get: () => 'https://snrtlive.ma/'});

			const hls = new Hls();
			const VIDEO = <HTMLMediaElement>document.getElementById("player");
			const VIDEO_CONTAINER = <HTMLInputElement>(
				document.getElementById("video-player")
			);
			function toggleFullscreen() {
				if (!document.fullscreenElement) {
					if (VIDEO_CONTAINER.requestFullscreen)
						VIDEO_CONTAINER.requestFullscreen();
				} else document.exitFullscreen();
			}

			VIDEO_CONTAINER.addEventListener("dblclick", toggleFullscreen);

			if (!PLAYLIST.value) return;
			VIDEO.setAttribute("poster", PLAYLIST.value[0].poster);
			hls.loadSource(PLAYLIST.value[0].source);
			hls.attachMedia(VIDEO);
			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				// VIDEO.muted = true;
				VIDEO.play();

				let timeout: NodeJS.Timeout;
				const duration = 3000;
				document.addEventListener("mousemove", () => {
					(
						document.getElementById("controls") as HTMLInputElement
					).style.display = "flex";
					(
						document.getElementById("playlist") as HTMLInputElement
					).style.display = "grid";
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
				if (!PLAYLIST.value) return;
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

			const sliderElement = document.getElementById("playlist");
			const slideWidth = 120;
			const slideMaxWidth = (
				document.getElementById("playlist") as HTMLInputElement
			).clientHeight;

			function throttle(wait: number) {
				let time = Date.now();

				return (event: WheelEvent) => {
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

		const { data: PLAYLIST } = await useFetch(
			'https://api.inicontent.com/iptv/playlist?_options[order_by]=["created_at","ASC"]&_options[per_page]=100&_options[columns]=["name","poster","source"]',
			{
				transform: (res: {
					result: { poster: string; name: string; source: string }[];
				}) => res.result,
			},
		);
		const currentSliderScrollPos = ref(0);
		const currentChannel = ref(0);

		const ChangeChannel = (index: number) => {
			if (!PLAYLIST.value) return;
			const hls = new Hls();
			const VIDEO = <HTMLMediaElement>document.getElementById("player");
			currentChannel.value = index;
			VIDEO.setAttribute("poster", PLAYLIST.value[index].poster);
			hls.loadSource(PLAYLIST.value[index].source);
			hls.attachMedia(VIDEO);
			hls.on(Hls.Events.MANIFEST_PARSED, () => VIDEO.play());
		};

		return () =>
			h("div", { id: "video-player" }, [
				h("video", {
					id: "player",
					controls: true,
					autoplay: true,
					controlsList: "nofullscreen nodownload",
				}),
				h("div", { id: "controls" }, [
					h(NuxtLink, { to: "https://google.com", external: true }, () =>
						h(IconsGoogle),
					),
					h(
						NuxtLink,
						{
							to: "https://youtube.com/results?search_query=%D8%A3%D9%81%D9%84%D8%A7%D9%85+%D9%85%D8%BA%D8%B1%D8%A8%D9%8A%D8%A9",
							external: true,
						},
						() => h(IconsYoutube),
					),
					h(NuxtLink, { to: "https://yacine-app.tv", external: true }, () =>
						h(IconsSport),
					),
				]),
				h(
					"div",
					{ id: "playlist" },
					PLAYLIST.value?.map(({ poster, name }, index) =>
						h(
							"div",
							{
								class: `item${currentChannel.value === index ? " active" : ""}`,
								style: {
									backgroundImage: `url(${poster})`,
								},
								onClick: () => ChangeChannel(index),
							},
							h("span", { class: "name" }, name),
						),
					),
				),
			]);
	},
});
