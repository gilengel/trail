import {EditorElements, globalElementRegistry} from '~/components/builder/editor.configuration';


export default defineNuxtPlugin(() => {
    // Clear existing registrations on refresh/HMR
    if (process.env.NODE_ENV === 'development') {
        globalElementRegistry.definitions.clear();
        globalElementRegistry.properties.clear();
    }

    globalElementRegistry.definitions.registerMany(EditorElements);

    globalElementRegistry.properties.registerType("range", defineAsyncComponent(() => import('~/components/types/Range.vue')))
    globalElementRegistry.properties.registerType("string", defineAsyncComponent(() => import('~/components/types/Text.vue')))
    globalElementRegistry.properties.registerType("color", defineAsyncComponent(() => import('~/components/types/Color.vue')))
    globalElementRegistry.properties.registerType("text-align", defineAsyncComponent(() => import('~/components/types/TextAlign.vue')))
});