import {defineAsyncComponent} from "vue";
import {ElementDefinitionRegistry} from "./editorElementDefinitionRegistry";
import {EditorElementInstanceRegistry} from "./editorElementInstanceRegistry";

export class IntegratedEditorRegistry {
    public definitions = new ElementDefinitionRegistry();
    public instances = new EditorElementInstanceRegistry();

    /**
     * Returns the component for the element as shown to the user if found, null otherwise
     * @param definitionTypeId
     */
    public getComponent(definitionTypeId: string): ReturnType<typeof defineAsyncComponent> | null {
        const definition = this.definitions.get(definitionTypeId);
        return definition?.components.element || null;
    }

    /**
     * Returns the component for the element properties to the user if found, null otherwise
     * @param definitionTypeId
     */
    public getPropertyComponent(definitionTypeId: string): ReturnType<typeof defineAsyncComponent> | null {
        const definition = this.definitions.get(definitionTypeId);
        return definition?.components.properties || null;
    }
}