import {Editor, EditorInjectionKey} from "@trail/grid-editor/editor";
import type {Grid} from "@trail/grid-editor/grid";

export function createGlobal(grid: Grid = {tripId: 0, rows: []}) {
    return {
        provide: {
            [EditorInjectionKey]: new Editor(grid, () => {
                return Promise.resolve();
            }),
        }
    }
}
