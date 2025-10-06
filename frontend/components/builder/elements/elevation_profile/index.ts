import type {
    ConsumedPropertiesRoute,
    ProvidedPropertiesRoute,
    RouteProperty
} from "~/components/builder/elements/RouteProperty";
import {createEditorElementDefinition} from "@trail/grid-editor/editorConfiguration";
import type {EditorElementDefinition} from "@trail/grid-editor/configuration/elementDefinition";

export type ElevationProfileProperties = RouteProperty;

export const ElevationProfileElement: EditorElementDefinition<ElevationProfileProperties, ProvidedPropertiesRoute, ConsumedPropertiesRoute> = createEditorElementDefinition({
    id: 'elevation_profile',
    name: 'Elevation Profile',
    category: 'content',

    component: defineAsyncComponent(() => import('~/components/builder/elements/elevation_profile/Element.vue')),

    defaults: {
        properties: {} as ElevationProfileProperties,
        providedProperties: ["route", "color"],
        consumedProperties: ["route", "color"],
    },

    propertySchema: {
        route: {
            type: 'custom',
            component: defineAsyncComponent(() => import('~/components/types/RouteSelect.vue')),
            label: 'Route',
            description: 'Select the route you want to display on the map',
        },

        color: {
            type: 'color',
            label: 'Route Color',
            format: 'hex',
            defaultValue: '#000000'
        },
    },

    metadata: {
        description: 'A simple text element with customizable styling',
        icon: 'text-icon',
        tags: ['text', 'content', 'basic'],
        version: '1.0.0',
    },
});