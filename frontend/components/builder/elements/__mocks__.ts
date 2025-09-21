import {Editor, EditorInjectionKey} from "~/components/GridEditor/editor";
import type {Grid} from "~/components/GridEditor/grid";

export function createGlobal(grid: Grid = {tripId: 0, rows: []}) {
    return {
        provide: {
            [EditorInjectionKey]: new Editor(grid, () => {
                return Promise.resolve();
            }),
        }
    }
}
