import {Editor, EditorInjectionKey} from "@trail/grid-editor/editor";
import type {Grid} from "@trail/grid-editor/grid";
import {EventManager} from "@trail/grid-editor/events/eventManager";
import {UndoRedoHandler} from "@trail/grid-editor/undoredo";
import {HighlightHandler} from "@trail/grid-editor/handler/highlight";
import {LoggerHandler} from "@trail/grid-editor/handler/logger";

/**
 * Mocks the provided editor key that is injected into the editor element and property components.
 * Use it for unit testing.
 * @param grid - The grid used by the editor.
 * @returns Object with the provide key.
 */
export function createGlobal(grid: Grid = {tripId: 0, rows: []}) {
    const persist = () => {
        return Promise.resolve();
    };

    return {
        provide: {
            [EditorInjectionKey]: new Editor(grid,
                new EventManager(),
                new UndoRedoHandler(persist),
                new HighlightHandler(),
                new LoggerHandler(),
                persist),
        }
    };
}
