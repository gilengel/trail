import {beforeEach, describe, expect, it, vi} from 'vitest';
import ColumnComponent from '~/components/builder/layout/Column.vue';
import type {VueWrapper} from "@vue/test-utils";
import {mount} from "@vue/test-utils";
import {createTestGrid} from "~/stores/actions/test.helper";
import {createVuetify} from 'vuetify'
import {Element, ElementType} from "~/types/grid";

const mockUpdateElementAttribute = vi.fn();
const mockGridModuleStore = {
    updateElementAttribute: mockUpdateElementAttribute,
};

vi.mock('@/stores/gridModuleStore', () => ({
    useGridStore: () => mockGridModuleStore,
}));


describe('Component', () => {
    describe('Column', () => {
        let wrapper: VueWrapper<InstanceType<typeof ColumnComponent>>;

        const mockGrid = createTestGrid(2, 2);
        for (let i = 0; i < 2; ++i) {
            for (let j = 0; j < 2; ++j) {
                mockGrid.rows[i].columns[j].width = 4;
            }
        }

        mockGrid.rows[0].columns[0].element = new Element(ElementType.Text, {})

        const props = {
            rowIndex: 0,
            columnIndex: 0,
            grid: mockGrid,
            model: mockGrid.rows[0].columns[0],
        };

        beforeEach(async () => {
            mockUpdateElementAttribute.mockReset();

            // Mount the component
            wrapper = mount(ColumnComponent, {
                props,
                global: {
                    plugins: [createVuetify()],
                    mocks: {
                        gridModuleStore: mockGridModuleStore, // Mock the store if needed
                    },
                },
            });
            await wrapper.vm.$nextTick();
        });

        it('should render', () => {
            expect(wrapper.exists()).toBeTruthy()
        })
    });
});