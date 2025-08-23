import {describe, it, expect, vi} from 'vitest';
import HeadingPropertiesComponent from './Properties.vue';
import {mountSuspended} from "@nuxt/test-utils/runtime";
import {Element, ElementType} from "~/types/grid";
import type {HeadingProperties} from "~/components/builder/elements/heading/Properties";
import {SwitchModeKey} from "~/components/builder/BuilderMode";

const getByTripId = vi.fn();
vi.mock('@/stores/route', () => {
    return {
        useRouteStore: vi.fn(() => ({
            getByTripId,
        })),
    };
});

describe('Component', () => {
    describe('Map[Properties]', () => {
        const mockSwitchMode = vi.fn();

        it('renders', async () => {
            const element = new Element<HeadingProperties, [], []>(
                '0',
                ElementType.Heading,

                {level: 0, color: '#F00', text: 'Heading', alignment: 'left'}, [], [], {}, {});
            const component = await mountSuspended(HeadingPropertiesComponent, {
                provide: {
                    [SwitchModeKey]: mockSwitchMode,
                },
                props: {
                    element,
                    selected: true,
                    highlighted: false,
                    grid: {tripId: 0, rows: []}
                }
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
