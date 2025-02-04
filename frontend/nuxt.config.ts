// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},

    runtimeConfig: {
        myProxyUrl: 'http://localhost:4000'
    },

    compatibilityDate: "2025-01-28",

    modules: [
        "@pinia/nuxt",
        '@vueuse/nuxt',
        "@nuxtjs/google-fonts",
        "@nuxt/test-utils/module",
        "vuetify-nuxt-module",
        "nuxt-tiptap-editor",
    ],


    css: [
        "line-awesome/dist/line-awesome/css/line-awesome.css",
        "assets/maplibre-gl.css",
        'vuetify/styles'
    ],

    vite: {
        optimizeDeps: {
            include: ['@yeger/vue-masonry-wall'],
        },

        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "~/assets/scss/global.scss";',
                },
            },
        },

        server: {
            watch: {
                usePolling: true,
                interval: 1000,
                ignored: [
                    '**/node_modules/**',  // Exclude node_modules from all levels
                    '**/node_modules/*/**',
                    '**/.git/**',           // Exclude .git directories
                    '**/.nuxt/**',          // Exclude nuxt build directories
                    '**/dist/**',           // Exclude dist folders
                    '**/coverage/**',       // Exclude coverage folders
                    '**/tmp/**',            // Exclude tmp folders
                ]
            }
        }
    },

    googleFonts: {
        families: {
            Roboto: true,
            "Josefin+Sans": true,
            Lato: [100, 300],
            Raleway: {
                wght: [100, 400],
                ital: [100],
            },
            Inter: "200..700",
            "Crimson Pro": {
                wght: "200..900",
                ital: "200..700",
            },
            "Amatic SC": {
                wght: [400, 700],
            },
        },
        /*
        families: {
          Roboto: true,
          "Amatic SC": {
            wght: [400, 700],
            display: "swap",
          },
        },
        */

        download: true,
        inject: true,
    },

    vuetify: {
        vuetifyOptions: {
            icons: {
                defaultSet: 'fa', // Specify the default icon set (for Line Awesome, it maps to FontAwesome)
                sets: ['fa', 'mdi'],
            },

            theme: {
                defaultTheme: 'light',
                themes: {
                    light: {
                        dark: false,
                        colors: {
                            primary: '#1976D2', // Define a primary color
                            secondary: '#424242',
                        },
                    },
                },
            },
        },

    },

    tiptap: {
        prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
    },
});