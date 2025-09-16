import {type InjectionKey, ref, type Ref} from "vue";

import {HighlightHandler} from "./editorHighlight";
import {CreateElement, type CreateElementMeta} from "./modes/CreateElement";
import {ConnectElementProperties, type ConnectElementPropertiesMeta} from "./modes/ConnectProperty";
import {type IUndoRedoAction, UndoRedoHandler} from "~/stores/editor/undoredo";
import {GridHandler} from "~/stores/editor/grid";
import type {Grid} from "./grid";
import type {EditorElementDefinition, ISaveGridFn} from "~/components/GridEditor/editorConfiguration";
import type {EditorElementInstance} from "~/components/GridEditor/editorElementInstanceRegistry";

export const EditorInjectionKey: InjectionKey<Editor> = Symbol("editor");

export enum BuilderMode {
    Create,
    ConnectProperty
}

type ModeMetaMap = {
  [BuilderMode.Create]: CreateElementMeta;
  [BuilderMode.ConnectProperty]: ConnectElementPropertiesMeta;
};

type ModeMap = {
  [K in BuilderMode]: EditorMode<ModeMetaMap[K]>
};


export class Editor {
  private readonly _undoRedoHandler: UndoRedoHandler;
  private readonly _gridHandler: GridHandler;

  constructor(private _grid: Grid, private _persist: ISaveGridFn) {
    this._undoRedoHandler = new UndoRedoHandler(_persist);
    this._gridHandler = new GridHandler(this._undoRedoHandler);

    this._modes = {
      [BuilderMode.Create]: new CreateElement(),
      [BuilderMode.ConnectProperty]: new ConnectElementProperties(this._gridHandler, this),
    };

    this.highlightHandler = new HighlightHandler();
  }

    /**
     * Searches within the grid for the element with the given ID.
     * @template Properties
     * @template ProvidedProperties
     * @template ConsumedProperties
     * @param id - ID of the element to be searched for.
     * @param grid - The grid where the element shall be located from.
     * @returns The element if found, is otherwise undefined.
     */
    public findElementWithId<T extends EditorElementInstance<any>>(id: string, grid: Grid)
        : T | undefined {

        for (const row of grid.rows) {
            for (const column of row.columns) {
                if (column.element && column.element.instanceId === id) {
                    return column.element as unknown as T;
                }
            }
        }

        return undefined;
    }


  private _modes: ModeMap;

  public highlightHandler: HighlightHandler;

  private _activeMode: Ref<BuilderMode> = ref(BuilderMode.Create);

  /// The currently selected element if one is selected
  private _selectedElement: Ref<EditorElementInstance | undefined> = ref(undefined);

  /// Shown as a toast to the user
  private _warnings: Ref<string[]> = ref([]);

  public async executeAction<C extends IUndoRedoAction>(action: C) {
    await this._undoRedoHandler.execute(action);
    await this._persist(this.grid);
  }

  public switchMode<T extends BuilderMode>(newMode: T, metaInformation: ModeMetaMap[T]) {
    this._activeMode.value = newMode;
    this._modes[newMode].activate(metaInformation);
  }

  public get activeMode(): BuilderMode {
    return this._activeMode.value;
  }

  public get selectedElement() {
    return this._selectedElement;
  }

  public get grid() {
    return this._grid;
  }

  public handleSelectElement<T extends EditorElementInstance>(newSelectedElement: T): void {

    this._modes[this._activeMode.value].onSelectElement(newSelectedElement);

    this.highlightHandler.clear();
    this._selectedElement.value = newSelectedElement as unknown as T;
    this.highlightHandler.add(this._selectedElement.value);
  }

  public clearSelectedElements(): void {
    this.highlightHandler.clear();
  }

  public pushWarning(warning: string) {
    this._warnings.value.push(warning);
  }
}

export interface EditorMode<Meta> {
  onSelectElement<T extends EditorElementDefinition
  >(newSelectedElement: T): void

  activate(meta: Meta): void;
}
