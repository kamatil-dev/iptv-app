// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	experimental: {
		payloadExtraction: false,
	},
	css: ["@/public/main.css"],
	devtools: { enabled: false },
});
