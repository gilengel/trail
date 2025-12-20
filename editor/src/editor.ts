import {type InjectionKey, ref, type Ref} from "vue";

import type {Grid} from "./grid";
import {CreateElement, type CreateElementMeta} from "./modes/createElement";
import {ConnectElementProperties, type ConnectElementPropertiesMeta} from "./modes/connectProperty";
import {type IUndoRedoAction, UndoRedoHandler} from "./undoredo";
import {type ConnectElementEventsMeta, ConnectElementEvents} from "./modes/connectEvent";
import type {EditorMode} from "./editorMode";
import type {IEventManager} from "./events/ieventManager";
import type {IUndoRedoHandler} from "./undoredo";
import type {IHighlightHandler} from "./handler/ihighlight";
import type {ILoggerHandler, LogLevel} from "./handler/ilogger";
import type {ISaveGridFn} from "./editorConfiguration"
import {EventManager} from "./events/eventManager";
import {LoggerHandler} from "./handler/logger";
import {HighlightHandler} from "./handler/highlight";
import type {IInstanceRegistry} from "./instances/iinstanceRegistry";
import {InstanceRegistry} from "./instances/instanceRegistry";
import {DefinitionRegistry} from "./definition/definitionRegistry";
import type {EditorElementInstance} from "./instances/instance";
import type {IDefinitionRegistry} from "./definition/idefinitionRegistry";
import type {IPropertyTypeRegistry} from "./properties/ipropertyRegistry";
import {PropertyTypeRegistry} from "./properties/elementPropertyRegistry";


export const EditorInjectionKey: InjectionKey<Editor> = Symbol("editor");

export enum BuilderMode {
    Create,
    ConnectProperty,
    ConnectEvent
}

type ModeMetaMap = {
    [BuilderMode.Create]: CreateElementMeta;
    [BuilderMode.ConnectProperty]: ConnectElementPropertiesMeta;
    [BuilderMode.ConnectEvent]: ConnectElementEventsMeta;
};

type ModeMap = {
    [K in BuilderMode]: EditorMode<ModeMetaMap[K]>
};

export class Editor {
    constructor(private _grid: Grid,
                private readonly _definitionRegistry: IDefinitionRegistry,
                private readonly _propertyRegistry: IPropertyTypeRegistry,
                private readonly _instanceRegistry: IInstanceRegistry,
                private readonly _eventManager: IEventManager,
                private readonly _undoRedoHandler: IUndoRedoHandler,
                private _highlightHandler: IHighlightHandler,
                private _loggingHandler: ILoggerHandler,
                private _persist: ISaveGridFn) {

        this._modes = {
            [BuilderMode.Create]: new CreateElement(),
            [BuilderMode.ConnectProperty]: new ConnectElementProperties(this),
            [BuilderMode.ConnectEvent]: new ConnectElementEvents(this)
        };

        for (const row of this._grid.rows) {
            for (const column of row.columns) {
                if (!column.element) continue;

                this._instanceRegistry.insertExistingInstance(column.element);
            }
        }
    }

    public get properties(): IPropertyTypeRegistry {
        return this._propertyRegistry;
    }

    public get definitions(): IDefinitionRegistry {
        return this._definitionRegistry;
    }

    public get instances(): IInstanceRegistry {
        return this._instanceRegistry;
    }

    public get eventManager(): IEventManager {
        return this._eventManager;
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

    public getIdsOfAllHighlightedElements(): Set<string> {
        return this._highlightHandler.get();
    }

    /**
     * @returns the grid of the editor that is the underlying model that stores all the information.
     */
    public get grid() {
        return this._grid;
    }

    /**
     * Logs a message with the given message. How the editor will handle the log message is specified by the
     * provided log manager defined in the constructor
     *
     * @param message the message that will be logged (and possible displayed to the user)
     * @param level the critically of the message
     */
    public log(message: string, level: LogLevel): void {
        this._loggingHandler.push(message, level)
    }


    private _modes: ModeMap;

    private _activeMode: Ref<BuilderMode> = ref(BuilderMode.Create);

    /// The currently selected element if one is selected
    private _selectedElement: Ref<EditorElementInstance | undefined> = ref(undefined);
}

/**
 * Creates the default editor with an opinionated configuration for event, logging and highlight handling.
 * It is configured to handle most use cases and allows you to specify how the data is stored as this is highly
 * unique und difficult to standardize.
 *
 * If you need a more specific configuration, lets say with a very specific logging, don't use this function but call
 * the Editor constructor directly where you can specify the single aspects manually.
 *
 * @param grid
 * @param saveFn
 */
export function createDefaultEditor(grid: Grid, saveFn: ISaveGridFn): Editor {
    const definitionRegistry = new DefinitionRegistry();
    const instanceRegistry = new InstanceRegistry(definitionRegistry);

    return new Editor(grid,
        definitionRegistry,
        new PropertyTypeRegistry(),
        instanceRegistry,
        new EventManager(definitionRegistry, instanceRegistry),
        new UndoRedoHandler(saveFn),
        new HighlightHandler(),
        new LoggerHandler(),
        saveFn)
}
