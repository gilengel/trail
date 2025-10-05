import {describe, it, expect, beforeEach} from 'vitest';
import {mount} from "@vue/test-utils";
import {createVuetify} from "vuetify";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import ImageComponent from '~/components/builder/elements/image/Element.vue';
import {createGlobal} from "~/components/builder/elements/__mocks__";
import {createMockElement} from "~/components/builder/elements/image/__mocks__";
import type {ImageElement} from "~/components/builder/elements/image/index";

describe('Component', () => {
    describe('Image', () => {
        let global: ReturnType<typeof createGlobal>;
        let props: EditorElementProperties<typeof ImageElement>;

        beforeEach(() => {
            global = createGlobal();

            props = {
                element: createMockElement(),
                definition: {} as unknown as any, // not relevant for the test
                grid: global.provide[EditorInjectionKey].grid
            };
        });

        it('renders', () => {
            const component = mount(ImageComponent, {
                global: {
                    ...global,
                    plugins: [createVuetify()]
                },
                props
            });

            expect(component.find('[data-testid="element-img"]').exists()).toBeTruthy();
        });
    });
});