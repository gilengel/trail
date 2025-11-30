import type {EditorMode} from "../editorMode";

export type CreateElementMeta = object

export class CreateElement implements EditorMode<CreateElementMeta> {

    private meta: CreateElementMeta | undefined = undefined;

    constructor() {
    }

    onSelectElement(): void {
    }

    activate(meta: CreateElementMeta): void {
        this.meta = meta;
    }

    getMeta(): CreateElementMeta | undefined {
        return this.meta;
    }
}

