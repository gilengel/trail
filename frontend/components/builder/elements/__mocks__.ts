import { Editor, EditorInjectionKey } from "@trail/grid-editor/editor";
import type { Grid } from "@trail/grid-editor/grid";
import { EventManager } from "@trail/grid-editor/events/eventManager";
import { UndoRedoHandler } from "@trail/grid-editor/undoredo";
import { HighlightHandler } from "@trail/grid-editor/handler/highlight";
import { LoggerHandler } from "@trail/grid-editor/handler/logger";
import { DefinitionRegistry } from "@trail/grid-editor/definition/definitionRegistry";
import { InstanceRegistry } from "@trail/grid-editor/instances/instanceRegistry";
import { PropertyTypeRegistry } from "@trail/grid-editor/properties/elementPropertyRegistry";

/**
 * Mocks the provided editor key that is injected into the editor element and property components.
 * Use it for unit testing.
 * @param grid - The grid used by the editor.
 * @returns Object with the provide key.
 */
export function createGlobal(grid: Grid = { tripId: 0, rows: [] }) {
  const persist = () => {
    return Promise.resolve();
  };

  const definitionRegistry = new DefinitionRegistry();
  const instanceRegistry = new InstanceRegistry(definitionRegistry);

  return {
    provide: {
      [EditorInjectionKey]: new Editor(
        grid,
        definitionRegistry,
        new PropertyTypeRegistry(),
        instanceRegistry,
        new EventManager(definitionRegistry, instanceRegistry),
        new UndoRedoHandler(persist),
        new HighlightHandler(),
        new LoggerHandler(),
        persist,
      ),
    },
  };
}
