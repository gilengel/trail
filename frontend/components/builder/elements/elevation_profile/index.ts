import type {
    ConsumedPropertiesRoute,
    ProvidedPropertiesRoute,
    RouteProperty
} from "~/components/builder/elements/RouteProperty";
import {createEditorElementDefinition} from "@trail/grid-editor/editorConfiguration";
import type {EditorElementDefinition} from "@trail/grid-editor/definition/elementDefinition";
import type {EditorElementInstance} from "@trail/grid-editor/instances/instance";
import {defineCallback} from "@trail/grid-editor/events/eventRegistry";

export type ElevationProfileProperties = RouteProperty;

export const ElevationProfileElement: EditorElementDefinition<ElevationProfileProperties, ProvidedPropertiesRoute, ConsumedPropertiesRoute> = createEditorElementDefinition({
    id: 'elevation_profile',
    name: 'Elevation Profile',
    category: 'content',

    component: defineAsyncComponent(() => import('~/components/builder/elements/elevation_profile/Element.vue')),

    defaults: {
        properties: {} as ElevationProfileProperties,

        connections: {
            provided: {
                properties: ["route", "color"],
                events: {}
            },
            consumed: {
                properties: ["route", "color"],

                callbacks: {
                    'segment-hovered-on': defineCallback(
                        {point: {lat: 0, lng: 0}},
                        (instance: EditorElementInstance, args: {
                            point: { lat: number, lng: number }
                        }) => {
                            instance.properties.marker = args.point
                        },
                        {name: 'segment-hovered-on', label: 'Segment hovered'}
                    )
                }
            }
        }
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
        icon: 'las la-chart-line',
        tags: ['text', 'content', 'basic'],
        version: '1.0.0',
    },
});