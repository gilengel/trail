import type {
    ConsumedPropertiesRoute,
    ProvidedPropertiesRoute,
    RouteProperty
} from "~/components/builder/elements/RouteProperty";
import {createEditorElementDefinition} from "@trail/grid-editor/editorConfiguration";
import type {EditorElementDefinition} from "@trail/grid-editor/configuration/elementDefinition";

export const MapElement: EditorElementDefinition<RouteProperty, ProvidedPropertiesRoute, ConsumedPropertiesRoute> = createEditorElementDefinition({
    id: 'map',
    name: 'Map',
    category: 'content',

    component: defineAsyncComponent(() => import('~/components/builder/elements/map/Element.vue')),

    defaults: {
        properties: {} as RouteProperty,
        providedProperties: ["route"],
        consumedProperties: ["route"],
    },

    propertySchema: {
        route: {
            type: 'custom',
            component: defineAsyncComponent(() => import('~/components/types/RouteSelect.vue')),
            label: 'Route',
            description: 'Select the route you want to display on the map',
        },
    },

    metadata: {
        description: 'A simple text element with customizable styling',
        icon: 'text-icon',
        tags: ['text', 'content', 'basic'],
        version: '1.0.0',
    },
});