import {describe, it, expect, vi} from 'vitest';
import HeadingPropertiesComponent from './Properties.vue';
import {createMockElement} from "~/stores/editor/actions/__mocks__";
import {Editor, EditorInjectionKey} from "~/components/GridEditor/editor";
import {mount} from "@vue/test-utils";
import {createVuetify} from "vuetify";

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
