import {createEditorElementDefinition, type EditorElementDefinition} from "~/components/GridEditor/editorConfiguration";
import type {RouteProperty} from "~/components/builder/elements/RouteProperty";

export const MapElement: EditorElementDefinition<RouteProperty, [], []> = createEditorElementDefinition({
    id: 'map',
    name: 'Map',
    category: 'content',

    components: {
        element: defineAsyncComponent(() => import('~/components/builder/elements/map/Element.vue')),
        properties: defineAsyncComponent(() => import('~/components/builder/elements/map/Properties.vue')),
    },

    defaults: {
        properties: {} as RouteProperty,
        providedProperties: [],
        consumedProperties: [],
    },

    metadata: {
        description: 'A simple text element with customizable styling',
        icon: 'text-icon',
        tags: ['text', 'content', 'basic'],
        version: '1.0.0',
    },
});