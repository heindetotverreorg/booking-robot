// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: parseInt(process.env.PORT as string) || 3001
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true }
})
