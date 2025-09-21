import {describe, it, expect, beforeEach} from 'vitest';
import {createMockElement} from "~/components/builder/elements/elevation_profile/__mocks__";
import {mount} from "@vue/test-utils";
import {createGlobal} from "~/components/builder/elements/__mocks__";
import {createDefaultGrid, type EditorElementProperties} from "~/components/GridEditor/grid";
import {BuilderMode, EditorInjectionKey} from "~/components/GridEditor/editor";
import {createVuetify} from "vuetify";
import {GridEditorRow} from "#components";

describe('Component', () => {
    describe('Row', () => {
        let global: ReturnType<typeof createGlobal>;
        let props: EditorElementProperties<any>;

        beforeEach(() => {
            global = createGlobal(createDefaultGrid(0));

            props = {
                element: createMockElement(),
                grid: global.provide[EditorInjectionKey].grid
            };
        });

        it('renders', () => {
            const component = mount(GridEditorRow, {
                global: {
                    ...global,
                    plugins: [createVuetify()]
                },
                props: {
                    rowIndex: 0,
                    model: props.grid.rows[0],
                    grid: props.grid,

                    activeMode: BuilderMode.Create
                }
            });
            expect(component.exists).toBeTruthy();
        });
    });
});
