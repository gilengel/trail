import {describe, it, expect, beforeEach} from 'vitest';
import ElevationProfileComponent from '~/components/builder/elements/elevation_profile/Element.vue';
import {createMockElement} from "~/components/builder/elements/elevation_profile/__mocks__";
import {mount} from "@vue/test-utils";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import {createVuetify} from "vuetify";

describe('Component', () => {
    describe('ElevationProfile', () => {
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
            const component = mount(ElevationProfileComponent, {
                global: {
                    ...global,
                    plugins: [createVuetify()]
                },
                props
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
