import {describe, it, expect, beforeEach} from 'vitest';
import ImageComponent from '~/components/builder/elements/image/Element.vue';
import {createGlobal} from "~/components/builder/elements/__mocks__";
import {createMockElement} from "~/components/builder/elements/elevation_profile/__mocks__";
import {mount} from "@vue/test-utils";
import {createVuetify} from "vuetify";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementProperties} from "@trail/grid-editor/grid";

describe('Component', () => {
    describe('Image', () => {
        let global: ReturnType<typeof createGlobal>;
        let props: EditorElementProperties<any>;

        beforeEach(() => {
            global = createGlobal();

            props = {
                element: createMockElement(),
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