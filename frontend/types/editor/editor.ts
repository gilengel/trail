import {Element, type Grid} from '~/types/grid';
import {ref, type Ref} from "vue";
import {BuilderMode} from "~/components/builder/BuilderMode";
import {ConnectElementProperties, type ConnectElementPropertiesMeta} from "~/types/editor/ConnectProperty";
import type {GridStore} from "~/stores/grid";
import {CreateElement, type CreateElementMeta} from "~/types/editor/CreateElement";

type ModeMetaMap = {
    [BuilderMode.Create]: CreateElementMeta;
    [BuilderMode.ConnectProperty]: ConnectElementPropertiesMeta;
};

type ModeMap = {
    [K in BuilderMode]: EditorMode<ModeMetaMap[K]>
};

class HighlightHandler {
    constructor(private _gridModuleStore: GridStore) {
    }

    public clear(): void {
        this._gridModuleStore.clearHighlightedElements();
    }

    public push<
        Props extends object,
        Provided extends readonly (keyof Props)[],
        Consumed extends readonly (keyof Props)[]
    >(...elements: Element<Props, Provided, Consumed>[]) {
        for (const element of elements) {
            this._gridModuleStore.addHighlightedElement(element);
        }
    }
}

export class Editor {
    private _modes: ModeMap;

    public highlightHandler: HighlightHandler;

    constructor(private _gridModuleStore: GridStore, private _grid: Grid) {
        this._modes = {
            [BuilderMode.Create]: new CreateElement(_gridModuleStore, this),
            [BuilderMode.ConnectProperty]: new ConnectElementProperties(_gridModuleStore, this),
        }

        this.highlightHandler = new HighlightHandler(_gridModuleStore);
    }

    private _activeMode: Ref<BuilderMode> = ref(BuilderMode.Create);

    /// The currently selected element if one is selected
    private _selectedElement: Ref<Element<object> | undefined> = ref(undefined);

    /// Shown as a toast to the user
    private _warnings: Ref<string[]> = ref([]);

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
        this.highlightHandler.push(this._selectedElement.value);
    }

    public clearSelectedElements(): void {
        this._gridModuleStore.clearHighlightedElements();
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
    >(newSelectedElement: Element<Props, Provided, Consumed>): void;

    onPropertyConnected<
        Props extends object,
        Provided extends readonly (keyof Props)[],
        Consumed extends readonly (keyof Props)[]
    >(property: any): void;

    activate(meta: Meta): void;
}