import {describe, it, expect, beforeEach} from 'vitest';
import {createMockElement} from "~/components/builder/elements/elevation_profile/__mocks__";
import {mount} from "@vue/test-utils";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import {createVuetify} from "vuetify";
import {GridEditorColumn} from "#components";
import {createDefaultGrid, type EditorElementProperties} from "@trail/grid-editor/grid";
import {BuilderMode, EditorInjectionKey} from "@trail/grid-editor/editor";

describe('Component', () => {
    describe('Column', () => {
        let global: ReturnType<typeof createGlobal>;
        let props: EditorElementProperties<any>;

        beforeEach(() => {
            global = createGlobal(createDefaultGrid(0));

            props = {
                element: createMockElement(),
                grid: global.provide[EditorInjectionKey as unknown as number].grid
            };
        });

        it('renders', () => {
            const component = mount(GridEditorColumn, {
                global: {
                    ...global,
                    plugins: [createVuetify()]
                },
                props: {
                    row: props.grid.rows[0],
                    model: props.grid.rows[0].columns[0],
                    grid: props.grid,

                    activeMode: BuilderMode.Create
                }
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
