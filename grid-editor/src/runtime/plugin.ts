import {defineNuxtPlugin} from '#app'
import { createVuetify } from 'vuetify'
export default defineNuxtPlugin((nuxtApp) => {
  console.log('Plugin injected by my-module!');

  createVuetify({
    defaults: {
      MyComponent: { foo: 'bar' },

      MyComponent2: {
        MyComponent: { foo: 'baz' },
      }
    }
  })
})
