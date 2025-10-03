import {Editor, EditorInjectionKey} from "@trail/grid-editor/editor";
import type {Grid} from "@trail/grid-editor/grid";

/**
 * Mocks the provided editor key that is injected into the editor element and property components.
 * Use it for unit testing.
 * @param grid - The grid used by the editor.
 * @returns Object with the provide key.
 */
export function createGlobal(grid: Grid = {tripId: 0, rows: []}) {
    return {
        provide: {
            [EditorInjectionKey]: new Editor(grid, () => {
                return Promise.resolve();
            }),
        }
    };
}
