import {createEditorElementDefinition} from "@trail/grid-editor/editorConfiguration";
import type {EditorElementDefinition} from "@trail/grid-editor/configuration/elementDefinition";
import {
    DefaultImageScale,
    ImagePosition,
    type ImageProperties,
    ImageSize
} from "~/components/builder/elements/image/Properties";


export const ImageElement: EditorElementDefinition<ImageProperties, [], []> = createEditorElementDefinition({
    id: 'image',
    name: 'Image',
    category: 'content',

    component: defineAsyncComponent(() => import('~/components/builder/elements/image/Element.vue')),

    defaults: {
        properties: {
            scale: DefaultImageScale,
            aspectRatio: 1,
            sizeType: ImageSize.Free,
            positionType: ImagePosition.Free
        } as ImageProperties,
        providedProperties: [],
        consumedProperties: [],
    },

    propertySchema: {
        scale: {
            type: 'custom',
            component: defineAsyncComponent(() => import('~/components/builder/elements/image/types/Scale.vue')),
            label: 'Scale',
            description: '',
        },
        aspectRatio: {
            type: 'number',
            component: defineAsyncComponent(() => import('~/components/builder/elements/image/types/AspectRatio.vue')),
            label: 'Aspect Ratio',
            defaultValue: '1'
        },
        sizeType: {
            type: 'range',
            component: defineAsyncComponent(() => import('~/components/builder/elements/image/types/Size.vue')),
            label: 'Size',
            options: [ImageSize.Free, ImageSize.FitHorizontally, ImageSize.FitVertically],
            defaultValue: '0'
        }
    },

    metadata: {
        description: 'A simple text element with customizable styling',
        icon: 'text-icon',
        tags: ['text', 'content', 'basic'],
        version: '1.0.0',
    },
});