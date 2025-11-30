import {BuilderMode, Editor} from "../editor";
import type {EditorMode} from "../editorMode";
import type {EditorElementInstance} from "../instances/instance";
import {AddEventConnection} from "../undoredo/actions/addEventConnection";

export type ConnectElementEventsMeta = {
    event: string
}

export class ConnectElementEvents implements EditorMode<ConnectElementEventsMeta> {
    private meta: ConnectElementEventsMeta | undefined = undefined;

    constructor(private _editor: Editor) {
    }

    async onSelectElement<Element extends EditorElementInstance>(newSelectedElement: Element) {
        if (!this._editor.selectedElement.value || !this.meta || !this.meta.event) {
            return;
        }

        const providingElement = this._editor.selectedElement.value;

        await this._editor.executeAction(new AddEventConnection(providingElement, newSelectedElement, this.meta.event));

        this._editor.clearSelectedElements();
        this._editor.switchMode(BuilderMode.Create, {});
    }

    activate(meta: ConnectElementEventsMeta): void {
        this.meta = meta;
    }
}