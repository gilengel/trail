import {createEditorElementDefinition, type EditorElementDefinition} from "@trail/grid-editor/editorConfiguration";
import {ImagePosition, type ImageProperties, ImageSize} from "~/components/builder/elements/image/Properties";

export const ImageElement: EditorElementDefinition<ImageProperties, [], []> = createEditorElementDefinition({
    id: 'image',
    name: 'Image',
    category: 'content',

    components: {
        element: defineAsyncComponent(() => import('~/components/builder/elements/image/Element.vue')),
        properties: defineAsyncComponent(() => import('~/components/builder/elements/image/Properties.vue')),
    },

    defaults: {
        properties: {
            scale: {origin: {x: 0, y: 0}, value: 1},
            aspectRatio: 1,
            sizeType: ImageSize.Free,
            positionType: ImagePosition.Free
        } as ImageProperties,
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