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
    constructor(private _grid: Grid, private _persist: ISaveGridFn) {
        this._undoRedoHandler = new UndoRedoHandler(_persist);

        this._modes = {
            [BuilderMode.Create]: new CreateElement(),
            [BuilderMode.ConnectProperty]: new ConnectElementProperties(this),
        };
    }

    public switchMode<T extends BuilderMode>(newMode: T, metaInformation: ModeMetaMap[T]) {
        this._activeMode.value = newMode;
        this._modes[newMode].activate(metaInformation);
    }

    public get activeMode(): BuilderMode {
        return this._activeMode.value;
    }

    public async executeAction<C extends IUndoRedoAction>(action: C) {
        await this._undoRedoHandler.execute(action);
        await this._persist(this._grid);
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

    /**
     * Select the given element and sets it to highlight.
     * Unselects any previous selected element.
     *
     * @param newSelectedElement
     */
    public selectElement<T extends EditorElementInstance>(newSelectedElement: T): void {

        this._modes[this._activeMode.value].onSelectElement(newSelectedElement);

        this._highlightHandler.clear();
        this._selectedElement.value = newSelectedElement as unknown as T;
        this._highlightHandler.add([this._selectedElement.value]);
    }

    public get selectedElement(): Ref<EditorElementInstance | undefined> {
        return this._selectedElement;
    }

    public clearSelectedElements(): void {
        this._selectedElement.value = undefined;
        this.clearAllHighlightedElements();
    }

    /**
     * Marks the given elements as highlighted
     * @param elements
     */
    public highlightElements<Element extends EditorElementInstance<any>>(elements: Element[]) {
        this._highlightHandler.add<Element>(elements);
    }

    /**
     * Checks if an element is highlighted or not.
     * @param element
     *
     * @returns true if the element is highlighted, false otherwise
     */
    public isHighlighted<ElementInstance extends EditorElementInstance>(element: ElementInstance) {
        return this._highlightHandler.isHighlighted(element);
    }

    /**
     * Unmarks all element that were previously highlighted.
     */
    public clearAllHighlightedElements(): void {
        this._highlightHandler.clear();
    }

    /**
     * @returns the grid of the editor that is the underlying model that stores all the information.
     */
    public get grid() {
        return this._grid;
    }

    /**
     * Logs a message with the given message. How the editor will handle the log message is specified
     * in the configuration
     *
     * @param message the message that will be logged (and possible displayed to the user)
     * @param level the critically of the message
     */
    public log(message: string, level: LogLevel): void {
        this._loggingHandler.push(message, level)
    }

    private readonly _undoRedoHandler: UndoRedoHandler;

    private _highlightHandler: HighlightHandler = new HighlightHandler();

    private _loggingHandler: LoggerHandler = new LoggerHandler();

    private _modes: ModeMap;

    private _activeMode: Ref<BuilderMode> = ref(BuilderMode.Create);

    /// The currently selected element if one is selected
    private _selectedElement: Ref<EditorElementInstance | undefined> = ref(undefined);
}

export interface EditorMode<Meta> {
    onSelectElement<T extends EditorElementInstance
    >(newSelectedElement: T): void

    activate(meta: Meta): void;
}
