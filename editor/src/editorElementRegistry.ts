import {defineAsyncComponent} from "vue";
import {ElementDefinitionRegistry} from "./configuration/editorElementDefinitionRegistry";
import {EditorElementInstanceRegistry} from "./editorElementInstanceRegistry";
import {PropertyTypeRegistry} from "./configuration/elementPropertyRegistry";

export class IntegratedEditorRegistry {
    public definitions = new ElementDefinitionRegistry();
    public instances = new EditorElementInstanceRegistry();
    public properties = new PropertyTypeRegistry();

    /**
     * Returns the component for the element as shown to the user if found, null otherwise
     * @param definitionTypeId
     */
    public getComponent(definitionTypeId: string): ReturnType<typeof defineAsyncComponent> | null {
        const definition = this.definitions.get(definitionTypeId);
        return definition?.component || null;
    }
}