import { EditorElements, globalElementRegistry } from '~/components/builder/editor.configuration';

export default defineNuxtPlugin(() => {
    // Clear existing registrations on refresh/HMR
    if (process.env.NODE_ENV === 'development') {
        globalElementRegistry.definitions.clear();
    }

    globalElementRegistry.definitions.registerMany(EditorElements);
    console.log(`Registered ${EditorElements.length} element definitions`);
});