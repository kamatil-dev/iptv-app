// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	experimental: {
		payloadExtraction: false,
	},
	css: ["~/assets/main.css"],
});
