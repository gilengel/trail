import {mount} from '@vue/test-utils';
import {describe, expect, it, vi, beforeEach} from 'vitest';
import {Element, ElementType} from "~/types/grid";
import Properties from "./Properties.vue";
import {ImagePosition, type ImageProperties, ImageSize} from "./Properties";
import {createPinia, setActivePinia} from "pinia";
import {useGridStore} from "~/stores/grid";
import {SwitchModeKey} from "~/components/builder/BuilderMode";
import {createVuetify} from "vuetify";

const storeMock = {
    addRow: vi.fn(),
    deleteRow: vi.fn(),
    deleteColumn: vi.fn(),
    splitColumn: vi.fn(),
    moveRow: vi.fn(),
    setColumnElement: vi.fn(),
    updateElementAttribute: vi.fn(),
    updateColumnsWidth: vi.fn()
};

vi.mock('@/stores/grid', () => ({
    useGridStore: vi.fn(() => storeMock)
}));


const mockElement = new Element<ImageProperties, [], []>('0', ElementType.Image, {
    aspectRatio: 4 / 3,
    scale: {origin: {x: 0, y: 0}, value: 1},
    sizeType: ImageSize.Free,
    positionType: ImagePosition.Free,
}, [], [], {}, {});

describe('ImagePropertiesComponent', () => {
    let store: ReturnType<typeof useGridStore>;

    const mockSwitchMode = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        setActivePinia(createPinia());
        store = useGridStore();
    });

    it('changes aspect ratio when a new one is clicked', async () => {
        const wrapper = mount(Properties, {
            props: {element: mockElement, selected: false, highlighted: false, grid: {tripId: 0, rows: []}},
            global: {

                plugins: [createVuetify(), createPinia()],
                provide: {
                    useGridStore,
                    [SwitchModeKey]: mockSwitchMode,
                },
            }
        });

        const aspectRatioButton = wrapper.findComponent('[data-testid="ratio-0"]');
        expect(aspectRatioButton.exists()).toBeTruthy();
        await aspectRatioButton.trigger('click');

        expect(store.updateElementAttribute).toHaveBeenCalledWith(
            mockElement,
            'aspectRatio',
            expect.any(Number)
        );
    });
});
