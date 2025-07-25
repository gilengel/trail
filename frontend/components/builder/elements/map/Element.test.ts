import {describe, it, expect, vi, beforeEach} from 'vitest';
import MapComponent from '~/components/builder/elements/map/Element.vue';
import {shallowMount} from "@vue/test-utils";
import {ElementType} from "~/types/grid";
import {createPinia, setActivePinia} from "pinia";

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
        beforeEach(() => {
            setActivePinia(createPinia());
            useRouteStore();
        });

        it('renders', async () => {
            const component = shallowMount(MapComponent, {
                props: {
                    element: {
                        id: '0',
                        type: ElementType.Image,
                        attributes: {
                            routeId: 0,
                            segmentsIds: []
                        }
                    }, selected: true
                },
                global: {
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
