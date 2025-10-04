import {ref, type Ref} from "vue";
import type {EditorElementInstance} from "../editorElementInstanceRegistry";

export class HighlightHandler {
    private _highlightedElements: Ref<Set<string>> = ref(new Set([]));

    constructor() {
    }

    /**
     * Highlights all provided elements
     *
     * @template Element
     *
     * @param elements
     */
    public add<Element extends EditorElementInstance<any>>(elements: Element[]) {
        for (const element of elements) {
            this._highlightedElements.value.add(element.instanceId);
        }
    }

    /**
     * Resets an element to not be highlighted.
     *
     * @template Element
     *
     * @param element - The element from which the highlighted flag shall be removed.
     */
    public remove<Element extends EditorElementInstance>(element: Element) {
        this._highlightedElements.value.delete(element.instanceId);
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
     *
     * @template Element
     *
     * @param element - The element to be checked if it has the highlighted flag or not.
     *
     * @returns True if the element is highlighted, false otherwise.
     */
    public isHighlighted<Element extends EditorElementInstance>(element: Element): boolean {
        return this._highlightedElements.value.has(element.instanceId);
    }

    public clear(): void {
        this._highlightedElements.value.clear();
    }
}
