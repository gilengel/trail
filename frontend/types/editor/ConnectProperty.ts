import {Element, type Grid} from "~/types/grid";
import {Editor, type EditorMode} from "~/types/editor/editor";
import type {useGridStore} from "~/stores/grid";
import {BuilderMode} from "~/components/builder/BuilderMode";

type GridStore = ReturnType<typeof useGridStore>

/**
 * Checks if connected elements would form a loop that is that the provided data is feed back into
 * the first element that provided the data. In this case the system would not know where to inject
 * the data from the backend in the first place and an update loop would turn into an infinite loop.
 *
 * The check is performed on property level therefore it does not guarantee if an element has such a loop
 * on another property than the one provided as the argument
 *
 * @param property the property you want to check
 * @param target the last element that you want to prevent to form a loop
 * @param gridStore the grid persistence store
 * @param grid the currently used grid
 * @param visitedElementIds all ids of already visited elements.
 *
 * @returns a list of the ids of all elements that form a loop if a loop was found, undefined otherwise
 */
function findLoop<
    Props extends object,
    Provided extends readonly (keyof Props)[],
    Consumed extends readonly (keyof Props)[]
>(property: keyof Props,
  target: Element<Props, Provided, Consumed>,
  gridStore: GridStore,
  grid: Grid,
  visitedElementIds: String[] = []): String[] | undefined {

    const elementIdOfConnectedConsumedProperty = target.connectedConsumedProperties[property];
    if (!elementIdOfConnectedConsumedProperty) {
        return;
    }

    if (visitedElementIds.find((id) => id === elementIdOfConnectedConsumedProperty)) {
        return visitedElementIds;
    }

    const consumer = gridStore.findElementWithId<Props, Provided, Consumed>(elementIdOfConnectedConsumedProperty, grid);
    if (!consumer) {
        console.error(`Element with id ${elementIdOfConnectedConsumedProperty} not found.`);
        return;
    }


    visitedElementIds.push(elementIdOfConnectedConsumedProperty);

    return findLoop(property, target, gridStore, grid, visitedElementIds);
}

export type ConnectElementPropertiesMeta = {
    property: string
}

export class ConnectElementProperties implements EditorMode<ConnectElementPropertiesMeta> {
    private meta: ConnectElementPropertiesMeta | undefined = undefined;

    constructor(private _gridModuleStore: GridStore, private _editor: Editor) {
    }

    onSelectElement<
        Props extends object,
        Provided extends readonly (keyof Props)[],
        Consumed extends readonly (keyof Props)[]
    >(newSelectedElement: Element<Props, Provided, Consumed>): void {
        if (!this._editor.selectedElement.value) {
            return;
        }

        const providingElement = this._editor.selectedElement.value as unknown as Element<Props, Provided, Consumed>;

        const foundLoop = findLoop(providingElement.providedProperties[0], newSelectedElement, this._gridModuleStore, this._editor.grid);

        if (foundLoop) {
            this._editor.pushWarning("The data of the connected elements form a loop which is not allowed. The connection is not set.")
            this._editor.clearSelectedElements();
            this._editor.switchMode(BuilderMode.Create, {});

            return;
        }


        const propertyKey = this.meta?.property! as Consumed[number];

        providingElement.connectedConsumedProperties[propertyKey] = newSelectedElement.id;
        newSelectedElement.connectedProvidedProperties[propertyKey] = providingElement.id;


        this._editor.clearSelectedElements();
        this._editor.switchMode(BuilderMode.Create, {});
    }

    onPropertyConnected<Props extends object, Provided extends readonly (keyof Props)[], Consumed extends readonly (keyof Props)[]>(property: any): void {

    }

    activate(meta: ConnectElementPropertiesMeta): void {
        this.meta = meta;
    }

}