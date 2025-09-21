import {describe, it, expect, vi, beforeEach} from 'vitest';
import ElevationProfilePropertiesComponent from './Properties.vue';
import {createMockElement} from "~/components/builder/elements/elevation_profile/__mocks__";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import type {EditorElementProperties} from "~/components/GridEditor/grid";
import {EditorInjectionKey} from "~/components/GridEditor/editor";
import {mount} from "@vue/test-utils";

const getByTripId = vi.fn();
vi.mock('@/stores/route', () => {
    return {
        useRouteStore: vi.fn(() => ({
            getByTripId,
        })),
    };
});

describe('Component', () => {
    describe('ElevationProfileProperties[Properties]', () => {
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
            getByTripId.mockResolvedValue([]);

            const component = mount(ElevationProfilePropertiesComponent, {
                global,
                props
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
