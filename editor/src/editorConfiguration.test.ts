import {defineAsyncComponent} from "vue";
import {describe, expect, it} from "vitest";
import {createEditorElementDefinition} from "./editorConfiguration";

describe("EditorConfiguration", () => {
    it("creates a element definition", async () => {
        const meta = {
            id: 'elevation_profile',
            name: 'Elevation Profile',
            category: 'content',

            components: {
                element: defineAsyncComponent,
                properties: defineAsyncComponent,
            },

            defaults: {
                properties: {},
                providedProperties: [],
                consumedProperties: [],
            },

            metadata: {
                description: 'Test element',
                icon: 'text-icon',
                tags: ['text', 'content', 'basic'],
                version: '1.0.0',
            },
        };

        // @ts-ignore
        const definition: EditorElementDefinition<{}, [], []> = createEditorElementDefinition<{}, [], []>(meta);

        expect(definition).toStrictEqual(meta);
    })
})