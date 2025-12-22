import {describe, it, expect, beforeEach} from 'vitest';
import ElevationProfileComponent from '~/components/builder/elements/elevation_profile/Element.vue';
import {createMockElement} from "~/components/builder/elements/elevation_profile/__mocks__";
import {mount} from "@vue/test-utils";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import {createVuetify} from "vuetify";
import {ElevationProfileElement} from "~/components/builder/elements/elevation_profile/index";

describe('Component', () => {
    describe('ElevationProfile', () => {
        let global: ReturnType<typeof createGlobal>;
        let props: EditorElementProperties<typeof ElevationProfileElement>;

        beforeEach(() => {
            global = createGlobal();

            props = {
                element: createMockElement(),
                definition: {} as unknown as any, // not relevant for the test
                grid: global.provide[EditorInjectionKey].grid,
                changeable: true
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
