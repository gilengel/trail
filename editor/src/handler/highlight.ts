import {ref, type Ref} from "vue";
import type {EditorElementInstance} from "../instances/instance";
import type {IHighlightHandler} from "./ihighlight";

export class HighlightHandler implements IHighlightHandler {
    private _highlightedElements: Ref<Set<string>> = ref(new Set([]));

    public add<Element extends EditorElementInstance<any>>(elements: Element[]): void {
        for (const element of elements) {
            this._highlightedElements.value.add(element.instanceId);
        }
    }

    public remove<Element extends EditorElementInstance>(element: Element): void {
        this._highlightedElements.value.delete(element.instanceId);
    }

    public get(): Set<string> {
        return this._highlightedElements.value;
    }

    public isHighlighted<Element extends EditorElementInstance>(element: Element): boolean {
        return this._highlightedElements.value.has(element.instanceId);
    }

    public clear(): void {
        this._highlightedElements.value.clear();
    }
}
