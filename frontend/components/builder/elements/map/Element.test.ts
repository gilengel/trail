import {describe, it, expect, vi, beforeEach} from 'vitest';
import MapComponent from '~/components/builder/elements/map/Element.vue';
import {shallowMount} from "@vue/test-utils";
import {createPinia, setActivePinia} from "pinia";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import {createMockElement} from "~/components/builder/elements/elevation_profile/__mocks__";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementProperties} from "@trail/grid-editor/grid";

vi.mock('@/stores/route', () => {
    return {
        useRouteStore: vi.fn(() => ({
            getMapLibreRoute: vi.fn(), // Mock `execute`
        })),
        GroupedUndoRedoAction: vi.fn(),
    };
});

describe('Component', () => {
    describe('Map', () => {
        let global: ReturnType<typeof createGlobal>;
        let props: EditorElementProperties<any>;

        beforeEach(() => {
            setActivePinia(createPinia());
            useRouteStore();

            global = createGlobal();

            props = {
                element: createMockElement(),
                grid: global.provide[EditorInjectionKey].grid
            };
        });

        it('renders', async () => {
            const component = shallowMount(MapComponent, {
                props,
                global: {
                    ...global,
                    stubs: {
                        Map: {
                            template: '<div>Mocked Map</div>'
                        }
                    }
                }
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
