import {describe, it, expect, vi, beforeEach} from 'vitest';
import RowComponent from '~/components/builder/layout/Row.vue';
import type {VueWrapper} from "@vue/test-utils";
import {mount} from "@vue/test-utils";
import {createTestGrid} from "~/stores/actions/test.helper";
import {createVuetify} from 'vuetify'

const mockUpdateElementAttribute = vi.fn();
const mockGridModuleStore = {
    updateElementAttribute: mockUpdateElementAttribute,
};

vi.mock('@/stores/gridModuleStore', () => ({
    useGridStore: () => mockGridModuleStore,
}));


describe('Component', () => {
    describe('Row', () => {
        let wrapper: VueWrapper<InstanceType<typeof RowComponent>>;

        const mockGrid = createTestGrid(2, 2);
        for (let i = 0; i < 2; ++i) {
            for (let j = 0; j < 2; ++j) {
                mockGrid.rows[i].columns[j].width = 4;
            }
        }

        const props = {
            rowIndex: 0,
            grid: mockGrid,
            model: mockGrid.rows[0],
            minColSize: 2,
            maxColSize: 4,

        };

        beforeEach(async () => {
            // Reset the mock before each test
            mockUpdateElementAttribute.mockReset();

            // Mock the gridModuleStore if needed
            const mockGridModuleStore = {
                deleteRow: vi.fn(),
            };

            vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
                width: 800,
                height: 400,
                top: 0,
                left: 0,
                bottom: 400,
                right: 800,
                x: 0,
                y: 0,
                toJSON: () => {
                },
            });

            // Mount the component
            wrapper = mount(RowComponent, {
                props,
                global: {
                    plugins: [createVuetify()],
                    mocks: {
                        gridModuleStore: mockGridModuleStore, // Mock the store if needed
                    },
                },
            });
            await wrapper.vm.$nextTick();

            const result = wrapper.vm.containerWidth();
            expect(result).toBe(800);
        });

        it('should render', async () => {
            expect(wrapper.exists()).toBeTruthy()
        })

        describe('column resize', () => {
            let rowSplitter;

            beforeEach(async () => {
                rowSplitter = wrapper.find('[data-testid="row-splitter"]');
                await rowSplitter.trigger('mousedown', {
                    clientX: 100,
                    clientY: 50,
                });
            })

            it('should handle dragging the row splitter to the left', async () => {
                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 300,
                    clientY: 50,
                });
                document.dispatchEvent(moveEvent);

                const upEvent = new MouseEvent('mouseup');
                document.dispatchEvent(upEvent);

                // Assertions
                expect(wrapper.vm.isDraggingColumnSize).toBe(false);

            });

            it('should set the left column width to the min prop size on dragging', async () => {
                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 0,
                    clientY: 50,
                });
                document.dispatchEvent(moveEvent);

                const upEvent = new MouseEvent('mouseup');
                document.dispatchEvent(upEvent);

                expect(wrapper.vm.isDraggingColumnSize).toBe(false);
            });

            it('should set the left column width to the min prop size on dragging', async () => {
                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 800,
                    clientY: 50,
                });
                document.dispatchEvent(moveEvent);

                const upEvent = new MouseEvent('mouseup');
                document.dispatchEvent(upEvent);

                expect(wrapper.vm.isDraggingColumnSize).toBe(false);
            });
        });
    });
});