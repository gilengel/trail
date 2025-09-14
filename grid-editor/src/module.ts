import {defineNuxtModule, addPlugin, createResolver, addComponent, addImports, addImportsDir} from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module',
    configKey: 'myModule',

    dependencies: [
      "@pinia/nuxt",
      '@vueuse/nuxt',
      "@nuxtjs/google-fonts",
      "@nuxt/test-utils/module",
      "vuetify-nuxt-module",
      "nuxt-tiptap-editor",
    ]
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // @ts-expect-error
    nuxt.hook('vuetify:registerModule', (register) => {
      register({
        moduleOptions: {
          /* module specific options */
        },
        vuetifyOptions: {
          /* vuetify options */
        },
      })

      console.log("MUUUUUUUUUUUU?")
    })



    nuxt.hook('modules:done', () => {
      const runtimeDir = resolver.resolve('./runtime')

      // ensure runtime is transpiled when installed from node_modules
      nuxt.options.build = nuxt.options.build || {}
      nuxt.options.build.transpile = nuxt.options.build.transpile || []
      nuxt.options.build.transpile.push(runtimeDir)

      // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
      addPlugin(resolver.resolve('./runtime/plugin'))


      // Now add your custom components
      addComponent({
        name: "GridEditor",
        filePath: resolver.resolve('./runtime/components/GridEditor')
      })

      addComponent({
        name: "GridRow",
        filePath: resolver.resolve('./runtime/components/GridRow')
      })

      addComponent({
        name: "GridColumn",
        filePath: resolver.resolve('./runtime/components/GridColumn')
      })


      //addImports(resolver.resolve('./runtime/components/BuilderMode'))
      addImportsDir(resolver.resolve('runtime/composables/types'))
      addImportsDir(resolver.resolve('runtime/composables/stores'))
    });


  },
})
