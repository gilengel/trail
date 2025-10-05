import {beforeEach, describe, expect, it} from "vitest";
import {defineAsyncComponent} from "vue";
import {IntegratedEditorRegistry} from "./editorElementRegistry";

describe("IntegratedEditorRegistry", () => {
    const mockDefinition = {
        id: "test-element",
        name: "Test Element",
        defaults: {
            properties: {},
            providedProperties: {},
            consumedProperties: {}
        },

        component: defineAsyncComponent(() =>
            Promise.resolve({template: '<div>Element</div>'})
        ),

    };

    let registry: IntegratedEditorRegistry;

    beforeEach(() => {
        registry = new IntegratedEditorRegistry();
    });

    it('returns "null" if an element was not registered', () => {
        expect(registry.getComponent("test-id")).toBeNull();
    })

    it('returns "null" if an element was not registered', () => {
        expect(registry.getComponent("test-id")).toBeNull();
    });

    it('returns the element component when element is registered', () => {
        registry.definitions.register(mockDefinition);

        const result = registry.getComponent("test-element");
        expect(result).not.toBeNull();
    });
})