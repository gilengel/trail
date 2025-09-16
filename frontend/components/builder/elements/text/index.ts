import {createEditorElementDefinition, type EditorElementDefinition} from "~/components/GridEditor/editorConfiguration";

interface TextElementProperties {
    content: string;
    fontSize: number;
    color: string;
    bold?: boolean;
}

export const TextElement: EditorElementDefinition<TextElementProperties, ["content"], []> = createEditorElementDefinition({
    id: 'text-element',
    name: 'Text',
    category: 'content',

    components: {
        element: defineAsyncComponent(() => import('~/components/builder/elements/text/Element.vue')),
        properties: defineAsyncComponent(() => import('~/components/builder/elements/text/Element.vue')),
    },

    defaults: {
        properties: {
            content: 'Default text',
            fontSize: 16,
            color: '#000000',
            bold: false,
        } as TextElementProperties,
        providedProperties: ['content'] as const,
        consumedProperties: [] as const,
    },

    metadata: {
        description: 'A simple text element with customizable styling',
        icon: 'text-icon',
        tags: ['text', 'content', 'basic'],
        version: '1.0.0',
    },
});