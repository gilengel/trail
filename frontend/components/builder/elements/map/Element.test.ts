import {describe, it, expect, vi, beforeEach} from 'vitest';
import MapComponent from '~/components/builder/elements/map/Element.vue';
import {shallowMount} from "@vue/test-utils";
import {createPinia, setActivePinia} from "pinia";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import {createMockElement} from "~/components/builder/elements/map/__mocks__";
import {EditorInjectionKey} from "@trail/grid-editor/editor";
import type {EditorElementProperties} from "@trail/grid-editor/grid";
import type {MapElement} from "~/components/builder/elements/map/index";

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
        let props: EditorElementProperties<typeof MapElement>;

        beforeEach(() => {
            setActivePinia(createPinia());
            useRouteStore();

            global = createGlobal();

            props = {
                element: createMockElement(),
                definition: {} as unknown as any,
                grid: global.provide[EditorInjectionKey].grid,
                changeable: true,
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
