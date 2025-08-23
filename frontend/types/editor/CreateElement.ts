import {Editor, type EditorMode} from "~/types/editor/editor";
import {Element} from "~/types/grid";


export type CreateElementMeta = {}

export class CreateElement implements EditorMode<CreateElementMeta> {

    private meta: CreateElementMeta | undefined = undefined;

    constructor(private _gridModuleStore: GridStore, private _editor: Editor) {
    }

    onSelectElement<
        Props extends object,
        Provided extends readonly (keyof Props)[],
        Consumed extends readonly (keyof Props)[]
    >(newSelectedElement: Element<Props, Provided, Consumed>): void {
    }

    onPropertyConnected<Props extends object, Provided extends readonly (keyof Props)[], Consumed extends readonly (keyof Props)[]>(property: any): void {
    }

    activate(meta: CreateElementMeta): void {
        this.meta = meta;
    }
}