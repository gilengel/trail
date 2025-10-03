import type {RouteProperty} from "~/components/builder/elements/RouteProperty";
import {createEditorElementDefinition, type EditorElementDefinition} from "@trail/grid-editor/editorConfiguration";

export type ElevationProfileProperties = RouteProperty;

export const ElevationProfileElement: EditorElementDefinition<ElevationProfileProperties, ["segmentsIds", "routeId"], ["segmentsIds", "routeId"]> = createEditorElementDefinition({
    id: 'elevation_profile',
    name: 'Elevation Profile',
    category: 'content',

    components: {
        element: defineAsyncComponent(() => import('~/components/builder/elements/elevation_profile/Element.vue')),
        properties: defineAsyncComponent(() => import('~/components/builder/elements/elevation_profile/Properties.vue')),
    },

    defaults: {
        properties: {} as ElevationProfileProperties,
        providedProperties: ["segmentsIds", "routeId"],
        consumedProperties: ["segmentsIds", "routeId"],
    },

    metadata: {
        description: 'A simple text element with customizable styling',
        icon: 'text-icon',
        tags: ['text', 'content', 'basic'],
        version: '1.0.0',
    },
});