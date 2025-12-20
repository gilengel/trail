import type {EditorElementInstance} from "./instances/instance";

export interface EditorMode<Meta> {
    onSelectElement<Instance extends EditorElementInstance
    >(newSelectedElement: Instance): void

    activate(meta: Meta): void;
}
