import {mount} from '@vue/test-utils';
import {describe, expect, it, vi, beforeEach} from 'vitest';
import {ElementType} from "~/types/grid";
import Properties from "./Properties.vue";
import {ImagePosition, ImageSize} from "./Props";
import {createPinia, setActivePinia} from "pinia";
import {useGridStore} from "~/stores/grid";

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


const mockElement = {
    id: '1',
    type: ElementType.Image,
    attributes: {
        aspectRatio: 4 / 3,
        scale: {origin: {x: 0, y: 0}, value: 1},
        sizeType: ImageSize.Free,
        positionType: ImagePosition.Free,
    }
};

const vuetifyStubs = {

    VBtnToggle: {

        template: '<div><slot /></div>',
        props: ['modelValue'],
        emits: ['update:modelValue'],
    },
    VBtn: {
        template: '<button @click="$emit(\'click\')"><slot /></button>',
        emits: ['click'],
    },
    VCard: {
        template: '<div><slot /></div>'
    },
    VCardTitle: true,
    VCardText: {
        template: '<div><slot/></div>',
    },
    VDivider: true,
    VRow: {
        template: '<div><slot/></div>',
    },
    VCol: {
        template: '<div><slot/></div>',
    },
    VResponsive: {
        template: '<div @click="$emit(\'click\')"><slot /></div>',
        emits: ['click'],
    },
    VIcon: {
        template: '<span />'
    },
    VSlider: {
        props: ['modelValue'],
        emits: ['update:modelValue'],
        template: `<input type="range" :value="modelValue"
                          @input="$emit('update:modelValue', Number($event.target.value))"/>`
    },
    VNumberInput: {
        props: ['modelValue'],
        emits: ['update:modelValue'],
        template: `<input type="number" :value="modelValue"
                          @input="$emit('update:modelValue', Number($event.target.value))"/>`
    },

};

describe('ImagePropertiesComponent', () => {
    let store: ReturnType<typeof useGridStore>;

    beforeEach(() => {
        vi.clearAllMocks();

        setActivePinia(createPinia());
        store = useGridStore();
    });

    it('changes aspect ratio when a new one is clicked', async () => {
        const wrapper = mount(Properties, {
            props: {element: mockElement, selected: false},
            global: {
                plugins: [createPinia()],
                provide: {
                    useGridStore,
                },
                stubs: vuetifyStubs
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
