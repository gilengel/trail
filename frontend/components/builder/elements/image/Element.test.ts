import {describe, it, expect, beforeEach} from 'vitest';
import ImageComponent from '~/components/builder/elements/image/Element.vue';
import {createGlobal} from "~/components/builder/elements/__mocks__";
import type {EditorElementProperties} from "~/components/GridEditor/grid";
import {createMockElement} from "~/components/builder/elements/elevation_profile/__mocks__";
import {EditorInjectionKey} from "~/components/GridEditor/editor";
import {mount} from "@vue/test-utils";
import {createVuetify} from "vuetify";

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