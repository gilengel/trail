import type {EditorElementInstance} from "../instances/instance";

export interface IHighlightHandler {
    /**
     * Highlights all provided elements
     *
     * @template Element
     *
     * @param elements
     */
    add<Element extends EditorElementInstance<any>>(elements: Element[]): void,

    /**
     * Resets an element to not be highlighted.
     *
     * @template Element
     *
     * @param element - The element from which the highlighted flag shall be removed.
     */
    remove<Element extends EditorElementInstance>(element: Element): void,

    /**
     * Returns a set with the ids of all highlighted elements.
     * @returns The set of ids of highlighted elements.
     */
    get(): Set<string>,

    /**
     * Checks for an element if it is highlighted or not.
     *
     * @template Element
     *
     * @param element - The element to be checked if it has the highlighted flag or not.
     *
     * @returns True if the element is highlighted, false otherwise.
     */
    isHighlighted<Element extends EditorElementInstance>(element: Element): boolean,

    clear(): void
}