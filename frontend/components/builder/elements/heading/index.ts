import {createEditorElementDefinition, type EditorElementDefinition} from "~/components/GridEditor/editorConfiguration";
import type {HeadingProperties} from "~/components/builder/elements/heading/Properties";

export const HeadingElement: EditorElementDefinition<HeadingProperties, [], []> = createEditorElementDefinition<HeadingProperties, [], []>({
    id: 'heading-element',
    name: 'Heading Element',
    category: 'content',

    components: {
        element: defineAsyncComponent(() => import('~/components/builder/elements/heading/Element.vue')),
        properties: defineAsyncComponent(() => import('~/components/builder/elements/heading/Properties.vue')),
    },

    defaults: {
        properties: {
            level: 0,
            color: '#000',
            text: 'Heading',
            alignment: 'left'
        } satisfies HeadingProperties,
        providedProperties: [] as const,
        consumedProperties: [] as const,
    },

    /*
    validation: {
        properties: (props: HeadingProperties) => {
            if (props.level >= 1 && props.level <= 6) return ['Heading level must be between 1 and 6'];
            return true;
        },
        required: ['level', 'color'] as const,
    },
    */

    metadata: {
        description: 'A simple text element with customizable styling',
        icon: 'text-icon',
        tags: ['text', 'content', 'basic'],
        version: '1.0.0',
    },
});