import {createEditorElementDefinition} from "@trail/grid-editor/editorConfiguration";
import type {EditorElementDefinition} from "@trail/grid-editor/configuration/elementDefinition";

export type TextElementProperties = {
    content: string;
    fontSize: number;
    color: string;
    bold?: boolean;
}

export const TextElement: EditorElementDefinition<TextElementProperties, ["content"], []> = createEditorElementDefinition({
    id: 'text-element',
    name: 'Text',
    category: 'content',

    component: defineAsyncComponent(() => import('~/components/builder/elements/text/Element.vue')),

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
        icon: 'las la-comment',
        tags: ['text', 'content', 'basic'],
        version: '1.0.0',
    },
});