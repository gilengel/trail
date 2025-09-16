import type {GridHandler} from "~/stores/editor/grid";
import {Editor, type EditorMode} from "../editor";
import type {Grid, Element} from "../grid";


/**
 * Checks if connected elements would form a loop that is that the provided data is feed back into
 * the first element that provided the data. In this case the system would not know where to inject
 * the data from the backend in the first place and an update loop would turn into an infinite loop.
 *
 * The check is performed on property level therefore it does not guarantee if an element has such a loop
 * on another property than the one provided as the argument.
 * @template Props The properties of the elements.
 * @template Provided The provided properties of the elements.
 * @template Consumed The consumed properties of the elements.
 * @param property - The property you want to check.
 * @param target - The last element that you want to prevent to form a loop.
 * @param gridHandler - The grid persistence store.
 * @param grid - The currently used grid.
 * @param visitedElementIds - All ids of already visited elements.
 * @returns A list of the ids of all elements that form a loop if a loop was found, undefined otherwise.
 */
function findLoop<
    
  Props extends object,
  Provided extends readonly (keyof Props)[],
  Consumed extends readonly (keyof Props)[]
>(property: keyof Props,
  target: Element< Props, Provided, Consumed>,
  gridHandler: GridHandler,
  grid: Grid,
  visitedElementIds: string[] = []): string[] | undefined {

  const elementIdOfConnectedConsumedProperty = target.connectedConsumedProperties[property];
  if (!elementIdOfConnectedConsumedProperty) {
    return;
  }

  if (visitedElementIds.find((id) => id === elementIdOfConnectedConsumedProperty)) {
    return visitedElementIds;
  }

  const consumer = gridHandler.findElementWithId<Props, Provided, Consumed>(elementIdOfConnectedConsumedProperty, grid);
  if (!consumer) {
    console.error(`Element with id ${elementIdOfConnectedConsumedProperty} not found.`);
    return;
  }


  visitedElementIds.push(elementIdOfConnectedConsumedProperty);

  return findLoop(property, target, gridHandler, grid, visitedElementIds);
}

export type ConnectElementPropertiesMeta = {
  property: string
}

export class ConnectElementProperties<ElementRegistry> implements EditorMode<ConnectElementPropertiesMeta> {
  private meta: ConnectElementPropertiesMeta | undefined = undefined;

  constructor(private _gridHandler: GridHandler, private _editor: Editor<ElementRegistry>) {
  }

  onSelectElement<
  
    Props extends object,
    Provided extends readonly (keyof Props)[],
    Consumed extends readonly (keyof Props)[]
  >(newSelectedElement: Element< Props, Provided, Consumed>): void {
    if (!this._editor.selectedElement.value || !this.meta || !this.meta.property) {
      return;
    }

    const providingElement = this._editor.selectedElement.value as unknown as Element< Props, Provided, Consumed>;

    const foundLoop = findLoop(providingElement.providedProperties[0]!, newSelectedElement, this._gridHandler, this._editor.grid);

    if (foundLoop) {
      this._editor.pushWarning("The data of the connected elements form a loop which is not allowed. The connection is not set.");
      this._editor.clearSelectedElements();
      this._editor.switchMode(BuilderMode.Create, {});

      return;
    }


    const propertyKey = this.meta.property as Consumed[number];

    providingElement.connectedConsumedProperties[propertyKey] = newSelectedElement.id;
    newSelectedElement.connectedProvidedProperties[propertyKey] = providingElement.id;


    this._editor.clearSelectedElements();
    this._editor.switchMode(BuilderMode.Create, {});
  }

  activate(meta: ConnectElementPropertiesMeta): void {
    this.meta = meta;
  }

}
