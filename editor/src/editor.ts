import {type InjectionKey, ref, type Ref} from "vue";

import type {ISaveGridFn} from "./editorConfiguration";
import type {EditorElementInstance} from "./editorElementInstanceRegistry";
import {HighlightHandler} from "./handler/highlight";
import {LoggerHandler, LogLevel} from "./handler/logger";
import type {Grid} from "./grid";
import {CreateElement, type CreateElementMeta} from "./modes/createElement";
import {ConnectElementProperties, type ConnectElementPropertiesMeta} from "./modes/connectProperty";
import {type IUndoRedoAction, UndoRedoHandler} from "./undoredo";


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

    private _loggingHandler: LoggerHandler = new LoggerHandler();

    constructor(private _grid: Grid, private _persist: ISaveGridFn) {
        this._undoRedoHandler = new UndoRedoHandler(_persist);

        this._modes = {
            [BuilderMode.Create]: new CreateElement(),
            [BuilderMode.ConnectProperty]: new ConnectElementProperties(this),
        };

        this.highlightHandler = new HighlightHandler();
    }

    /**
     * Searches within the grid for the element with the given ID.
     * @param id - ID of the element to be searched for.
     * @returns The element if found, is otherwise undefined.
     */
    public findElementWithId(id: string): EditorElementInstance<any> | undefined {
        for (const row of this._grid.rows) {
            for (const column of row.columns) {
                if (column.element && column.element.instanceId === id) {
                    return column.element;
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

    public async executeAction<C extends IUndoRedoAction>(action: C) {
        await this._undoRedoHandler.execute(action);
        await this._persist(this._grid);
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

    public log(message: string, level: LogLevel): void {
        this._loggingHandler.push(message, level)
    }
}

export interface EditorMode<Meta> {
    onSelectElement<T extends EditorElementInstance
    >(newSelectedElement: T): void

    activate(meta: Meta): void;
}
