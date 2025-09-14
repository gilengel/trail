import {Editor, type EditorMode} from "./editor";
import type {GridStore} from "~/stores/grid";


export type CreateElementMeta = object

export class CreateElement implements EditorMode<CreateElementMeta> {

    private meta: CreateElementMeta | undefined = undefined;

    constructor(private _gridModuleStore: GridStore, private _editor: Editor) {
    }

    onSelectElement(): void {
    }

    activate(meta: CreateElementMeta): void {
        this.meta = meta;
    }
}

