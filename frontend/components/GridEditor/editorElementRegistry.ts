import {ElementDefinitionRegistry} from "~/components/GridEditor/editorElementDefinitionRegistry";
import {EditorElementInstanceRegistry} from "~/components/GridEditor/editorElementInstanceRegistry";
import type {EditorElementDefinition} from "~/components/GridEditor/editorConfiguration";

export class IntegratedEditorRegistry{
    public definitions = new ElementDefinitionRegistry();
    public instances = new EditorElementInstanceRegistry();

    /**
     * Returns the component for the element as shown to the user if found, null otherwise
     * @param definitionTypeId
     */
    public getComponent<T extends EditorElementDefinition>(definitionTypeId: string): ReturnType<typeof defineAsyncComponent> | null {
        const definition = this.definitions.get(definitionTypeId);
        return definition?.components.element || null;
    }

    /**
     * Returns the component for the element properties to the user if found, null otherwise
     * @param definitionTypeId
     */
    public getPropertyComponent<T extends EditorElementDefinition>(definitionTypeId: string): ReturnType<typeof defineAsyncComponent> | null {
        const definition = this.definitions.get(definitionTypeId);
        return definition?.components.properties || null;
    }
}