import {describe, it, expect, vi} from 'vitest';
import HeadingPropertiesComponent from './Properties.vue';
import {mount} from "@vue/test-utils";
import {createVuetify} from "vuetify";
import {Editor, EditorInjectionKey} from "@trail/grid-editor/editor";
import {createMockElement} from "@trail/grid-editor/undoredo/actions/__mocks__";

const getByTripId = vi.fn();
vi.mock('@/stores/route', () => {
    return {
        useRouteStore: vi.fn(() => ({
            getByTripId,
        })),
    };
});

describe('Component', () => {
    describe('Heading[Properties]', () => {
        it('renders', async () => {
            const component = mount(HeadingPropertiesComponent, {
                global: {
                    plugins: [createVuetify()],
                    provide: {
                        [EditorInjectionKey]: new Editor({tripId: 0, rows: []}, () => {
                            return Promise.resolve();
                        }),
                    }
                },
                props: {
                    grid: {tripId: 0, rows: []},
                    element: createMockElement(),
                }
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
