import {describe, it, expect, beforeEach, vi} from 'vitest';
import {createMockElement} from "~/components/builder/elements/elevation_profile/__mocks__";
import {mount} from "@vue/test-utils";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import {createVuetify} from "vuetify";
import {GridEditor} from "#components";
import {createDefaultGrid, type EditorElementProperties} from "@trail/grid-editor/grid";
import {Editor, EditorInjectionKey} from "@trail/grid-editor/editor";
import {AddRow} from "@trail/grid-editor/undoredo/actions/addRow";


describe('Component', () => {
    describe('GridEditor', () => {
        let global: ReturnType<typeof createGlobal>;
        let props: EditorElementProperties<any>;

        let component: any;
        let executeActionSpy: any;

        beforeEach(() => {
            global = createGlobal(createDefaultGrid(0));

            executeActionSpy = vi.spyOn(Editor.prototype, 'executeAction')
                .mockImplementation(async () => {
                });


            props = {
                element: createMockElement(),
                grid: global.provide[EditorInjectionKey as unknown as number].grid
            };

            component = mount(GridEditor, {
                global: {
                    ...global,
                    plugins: [createVuetify()]
                },
                props: {
                    grid: props.grid,
                    tripId: props.grid.tripId,

                    save: () => {
                        return Promise.resolve();
                    }
                }
            });
        });

        it('renders', () => {
            expect(component.exists).toBeTruthy();
        });

        it('calls executeAction with AddRow when add row button is clicked', async () => {
            const addButton = component.find('[data-testid="grid-editor-add-row-btn"]');
            expect(addButton.exists()).toBe(true);

            await addButton.trigger('click');

            expect(executeActionSpy).toHaveBeenCalledTimes(1);

            const callArg = executeActionSpy.mock.calls[0][0];
            expect(callArg).toBeInstanceOf(AddRow);
        });
    });
});
