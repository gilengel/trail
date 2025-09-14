import {ref, type Ref} from "vue";
import {Element} from "../grid";

export class HighlightHandler {
  private _highlightedElements: Ref<Set<string>> = ref(new Set([]));

  constructor() {
  }

  /**
   * Highlights all provided elements
   *
   * @template Properties
   * @template ProvidedProperties
   * @template ConsumedProperties
   * @param element - The element that shall be highlighted.
   */
  public add<
    Props extends object,
    Provided extends readonly (keyof Props)[],
    Consumed extends readonly (keyof Props)[]
  >(...elements: Element<Props, Provided, Consumed>[]) {
    for (const element of elements) {
      this._highlightedElements.value.add(element.id);
    }
  }

  /**
   * Resets an element to not be highlighted.
   * @template Properties
   * @template ProvidedProperties
   * @template ConsumedProperties
   * @param element - The element from which the highlighted flag shall be removed.
   */
  public remove<Properties extends object,
    ProvidedProperties extends readonly (keyof Properties)[] = readonly [],
    ConsumedProperties extends readonly (keyof Properties)[] = readonly []>(element: Element<Properties, ProvidedProperties, ConsumedProperties>) {
    this._highlightedElements.value.delete(element.id);
  }

  /**
   * Returns a set with the ids of all highlighted elements.
   * @returns The set of ids of highlighted elements.
   */
  public get(): Set<string> {
    return this._highlightedElements.value;
  }

  /**
   * Checks for an element if it is highlighted or not.
   * @template Properties
   * @template ProvidedProperties
   * @template ConsumedProperties
   * @param element - The element to be checked if it has the highlighted flag or not.
   * @returns True if the element is highlighted, false otherwise.
   */
  public isHighlighted<Properties extends object,
    ProvidedProperties extends readonly (keyof Properties)[] = readonly [],
    ConsumedProperties extends readonly (keyof Properties)[] = readonly []>(element: Element<Properties, ProvidedProperties, ConsumedProperties>): boolean {

    return this._highlightedElements.value.has(element.id);
  }

  public clear(): void {
    this._highlightedElements.value.clear();
  }
}
