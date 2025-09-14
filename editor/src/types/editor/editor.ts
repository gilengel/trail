import {type InjectionKey, ref, type Ref} from "vue";
import {BuilderMode} from "../../components/BuilderMode";
import {Element, type Grid} from "../../types/grid";
import {ElementHandler} from "../../types/editor/editor.elements";
import {HighlightHandler} from "../../types/editor/editor.highlight";
import {CreateElement, type CreateElementMeta} from "../../types/editor/CreateElement";
import {ConnectElementProperties, type ConnectElementPropertiesMeta} from "../../types/editor/ConnectProperty";
import type {ISaveGridFn} from "../../stores/ISaveGrid";
import {type IUndoRedoAction, useUndoRedoStore} from "../../stores/undoredo";

export const EditorInjectionKey: InjectionKey<Editor> = Symbol("editor");


type ModeMetaMap = {
    [BuilderMode.Create]: CreateElementMeta;
    [BuilderMode.ConnectProperty]: ConnectElementPropertiesMeta;
};

type ModeMap = {
    [K in BuilderMode]: EditorMode<ModeMetaMap[K]>
};


export class Editor {
    private readonly _undoRedoStore;
    private readonly _gridStore;

    constructor(private _grid: Grid, persistFn: ISaveGridFn) {
        this._undoRedoStore = useUndoRedoStore(persistFn)();
        this._gridStore = useGridStore(this._undoRedoStore);

        this._modes = {
            [BuilderMode.Create]: new CreateElement(this._gridStore, this),
            [BuilderMode.ConnectProperty]: new ConnectElementProperties(this._gridStore, this),
        };

        this.highlightHandler = new HighlightHandler();
    }

    private _modes: ModeMap;

    public highlightHandler: HighlightHandler;

    public elements: ElementHandler = new ElementHandler();

    private _activeMode: Ref<BuilderMode> = ref(BuilderMode.Create);

    /// The currently selected element if one is selected
    private _selectedElement: Ref<Element<object> | undefined> = ref(undefined);

    /// Shown as a toast to the user
    private _warnings: Ref<string[]> = ref([]);

    public executeAction<C extends IUndoRedoAction>(action: C) {
        this._undoRedoStore.execute(action);
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

    public handleSelectElement<
        Props extends object,
        Provided extends readonly (keyof Props)[],
        Consumed extends readonly (keyof Props)[]
    >(newSelectedElement: Element<Props, Provided, Consumed>): void {

        this._modes[this._activeMode.value].onSelectElement(newSelectedElement);

        this.highlightHandler.clear();
        this._selectedElement.value = newSelectedElement as unknown as Element<object>;
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
    onSelectElement<
        Props extends object,
        Provided extends readonly (keyof Props)[],
        Consumed extends readonly (keyof Props)[]
    >(newSelectedElement: Element<Props, Provided, Consumed>): void

    activate(meta: Meta): void;
}