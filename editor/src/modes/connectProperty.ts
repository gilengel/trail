import {BuilderMode, Editor, type EditorMode} from "../editor";
import type {EditorElementInstance} from "../editorElementInstanceRegistry";
import {LogLevel} from "../handler/logger";
import {AddConnection} from "../undoredo/actions/addConnection";

/**
 * Checks if connected elements would form a loop that is that the provided data is feed back into
 * the first element that provided the data. In this case the system would not know where to inject
 * the data from the backend in the first place and an update loop would turn into an infinite loop.
 *
 * The check is performed on property level therefore it does not guarantee if an element has such a loop
 * on another property than the one provided as the argument.
 *
 * @template Element type of the target element
 *
 * @param property - The property you want to check.
 * @param target - The last element that you want to prevent to form a loop.
 * @param editor - Editor instance for element lookup
 * @param visitedElementIds - All ids of already visited elements.
 *
 * @returns A list of the ids of all elements that form a loop if a loop was found, undefined otherwise.
 */
export function findLoop<Element extends EditorElementInstance
>(property: string,
  target: Element,
  editor: Editor,
  visitedElementIds: string[] = []): string[] | undefined {

    const elementIdOfConnectedConsumedProperty = target.connections.consumed[property];
    if (!elementIdOfConnectedConsumedProperty) {
        return;
    }

    if (visitedElementIds.find((id) => id === elementIdOfConnectedConsumedProperty)) {
        return visitedElementIds;
    }

    const consumer = editor.findElementWithId(elementIdOfConnectedConsumedProperty);
    if (!consumer) {
        console.error(`Element with id ${elementIdOfConnectedConsumedProperty} not found.`);
        return;
    }


    visitedElementIds.push(elementIdOfConnectedConsumedProperty);

    return findLoop(property, target, editor, visitedElementIds);
}

export type ConnectElementPropertiesMeta = {
    property: string
}

export class ConnectElementProperties implements EditorMode<ConnectElementPropertiesMeta> {
    private meta: ConnectElementPropertiesMeta | undefined = undefined;

    constructor(private _editor: Editor) {
    }

    async onSelectElement<Element extends EditorElementInstance>(newSelectedElement: Element) {
        if (!this._editor.selectedElement.value || !this.meta || !this.meta.property) {
            return;
        }

        const providingElement = this._editor.selectedElement.value;

        const foundLoops = Object.keys(providingElement.connections.provided).filter((value: string) => {
            return findLoop(value, newSelectedElement, this._editor);
        })

        if (foundLoops.length > 0) {
            this._editor.log("The data of the connected elements form a loop which is not allowed. The connection is not set.", LogLevel.Warning);
            this._editor.clearSelectedElements();
            this._editor.switchMode(BuilderMode.Create, {});

            return;
        }

        await this._editor.executeAction(new AddConnection(providingElement, newSelectedElement, this.meta.property));

        this._editor.clearSelectedElements();
        this._editor.switchMode(BuilderMode.Create, {});
    }

    activate(meta: ConnectElementPropertiesMeta): void {
        this.meta = meta;
    }
}
