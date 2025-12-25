import { EditorElements } from "~/components/builder/editor.configuration";
import { PropertyTypeRegistry } from "@trail/grid-editor/properties/elementPropertyRegistry";
import { DefinitionRegistry } from "@trail/grid-editor/definition/definitionRegistry";
import type { Grid } from "@trail/grid-editor/grid";
import type { ISaveGridFn } from "@trail/grid-editor/editorConfiguration";
import { Editor } from "@trail/grid-editor/editor";
import { InstanceRegistry } from "@trail/grid-editor/instances/instanceRegistry";
import { EventManager } from "@trail/grid-editor/events/eventManager";
import { UndoRedoHandler } from "@trail/grid-editor/undoredo";
import { HighlightHandler } from "@trail/grid-editor/handler/highlight";
import { LoggerHandler } from "@trail/grid-editor/handler/logger";

export default defineNuxtPlugin(() => {
  const definitionRegistry = new DefinitionRegistry();
  definitionRegistry.registerMany(EditorElements);

  const propertyRegistry = new PropertyTypeRegistry();

  const instanceRegistry = new InstanceRegistry(definitionRegistry);

  propertyRegistry.register(
    "range",
    // @ts-ignore
    defineAsyncComponent(() => import("~/components/types/Range.vue")),
  );
  propertyRegistry.register(
    "string",
    // @ts-ignore
    defineAsyncComponent(() => import("~/components/types/Text.vue")),
  );
  propertyRegistry.register(
    "color",
    // @ts-ignore
    defineAsyncComponent(() => import("~/components/types/Color.vue")),
  );
  propertyRegistry.register(
    // @ts-ignore
    "text-align",
    // @ts-ignore
    defineAsyncComponent(() => import("~/components/types/TextAlign.vue")),
  );

  return {
    provide: {
      createGridEditor(grid: Grid, saveFn: ISaveGridFn): Editor {
        return new Editor(
          grid,
          definitionRegistry,
          propertyRegistry,
          instanceRegistry,
          new EventManager(definitionRegistry, instanceRegistry),
          new UndoRedoHandler(saveFn),
          new HighlightHandler(),
          new LoggerHandler(),
          saveFn,
        );
      },
    },
  };
});
