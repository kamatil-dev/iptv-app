export default defineEventHandler((event) =>
	$fetch(
		`https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/al_aoula_inter/hls_snrt/${
			event.context.params?._ ?? "al_aoula_inter.m3u8"
		}`,
		{
			headers: {
				Accept: "*/*",
				"Accept-Language": "en,fr-FR;q=0.9,fr;q=0.8,ar;q=0.7",
				Connection: "keep-alive",
				DNT: "1",
				Origin: "https://snrtlive.ma",
				Referer: "https://snrtlive.ma/",
				"Sec-Fetch-Dest": "empty",
				"Sec-Fetch-Mode": "cors",
				"Sec-Fetch-Site": "cross-site",
				"User-Agent":
					"Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
				"sec-ch-ua":
					'"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Chrome OS"',
			},
		},
	),
);
